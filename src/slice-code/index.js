import fs from 'fs'
import * as babel from 'babel-core'
import transformCoverage from './transform-coverage'

export default sliceCode

function sliceCode(coverageData) {
  const {path: filename} = coverageData
  const filteredCoverage = transformCoverage(coverageData)
  // console.log('filteredCoverage', JSON.stringify(filteredCoverage, null, 2))
  const code = fs.readFileSync(filename, 'utf8')
  return babel.transform(code, {
    filename,
    babelrc: false,
    plugins: [
      getSliceCodeTransform(filteredCoverage),
    ],
  }).code
}

function getSliceCodeTransform(filteredCoverage) {
  const fnLocs = getFnLocs(filteredCoverage)
  return function sliceCodeTransform() {
    return {
      visitor: {
        FunctionDeclaration(path) {
          if (!isFunctionCovered(fnLocs, path.node)) {
            path.remove()
          }
        },
        IfStatement(path) {
          const {branchMap} = filteredCoverage
          if (!isBranchCovered(branchMap, path.node)) {
            path.remove()
            return
          }
          path.traverse({
            enter(childPath) {
              const {key, node, parent, parentPath} = childPath
              const otherKey = key === 'consequent' ? 'alternate' : 'consequent'
              if (
              !parentPath.removed &&
              parentPath === path &&
              (key === 'consequent' || key === 'alternate') &&
              !isBranchSideCovered(branchMap, key, node, parent)
            ) {
                replaceNodeWithNodeFromParent(childPath, otherKey)
              }
            },
          })
        },
        ConditionalExpression(path) {
          if (path.removed) {
            return
          }
          const {branchMap} = filteredCoverage
          const branchCoverageData = getBranchCoverageData(branchMap, path.node)
          if (!branchCoverageData) {
            path.remove()
            return
          }
          path.traverse({
            enter(childPath) {
              const {key} = childPath
              const otherKey = key === 'consequent' ? 'alternate' : 'consequent'
              if (
                !childPath.removed &&
                childPath.parentPath === path &&
                (key === 'consequent' || key === 'alternate') &&
                !branchCoverageData[key].covered
              ) {
                replaceNodeWithNodeFromParent(childPath, otherKey)
              }
            },
          })
        },
      },
    }
  }
}

function isFunctionCovered(fnLocs, {id: {name}, loc: {start, end}}) {
  return fnLocs[name] &&
    fnLocs[name][start.line] &&
    fnLocs[name][start.line].some(coveredLoc => end.line === coveredLoc.end.line)
}

function getFnLocs({fnMap}) {
  return Object.keys(fnMap).reduce((fnLocs, key) => {
    const {loc, name} = fnMap[key]
    fnLocs[name] = fnLocs[name] || []
    fnLocs[name][loc.start.line] = fnLocs[name][loc.start.line] || []
    fnLocs[name][loc.start.line].push(loc)
    return fnLocs
  }, {})
}

function isBranchCovered(branches, node) {
  const branchCoverageData = getBranchCoverageData(branches, node)
  return !!branchCoverageData
}

function getBranchCoverageData(branches, node) {
  const index = Object.keys(branches).find(key => {
    const branch = branches[key]
    if (branch.type === 'if' && node.type !== 'IfStatement') {
      return false
    } else if (branch.type === 'cond-expr' && node.type !== 'ConditionalExpression') {
      return false
    }
    return isLocationEqual(branch.loc, node.loc)
  })
  return branches[index]
}

function isBranchSideCovered(branches, side, node, parentNode) {
  const branch = getBranchCoverageData(branches, parentNode)
  return branch[side].covered
}

function isLocationEqual(loc1, loc2) {
  return isLineColumnEqual(loc1.start, loc2.start) &&
    isLineColumnEqual(loc1.end, loc2.end)
}

function isLineColumnEqual(obj1, obj2) {
  return obj1.line === obj2.line && obj1.column === obj2.column
}

function replaceNodeWithNodeFromParent(path, key) {
  const {parentPath, parent} = path
  const replacementNode = parent[key]
  if (replacementNode && replacementNode.body) {
    parentPath.replaceWithMultiple(replacementNode.body)
  } else if (replacementNode) {
    parentPath.replaceWith(replacementNode)
  } else {
    parentPath.remove()
  }
}
