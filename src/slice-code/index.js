import * as babel from 'babel-core'
import deadCodeElimination from 'babel-plugin-minify-dead-code-elimination'
import transformCoverage from './transform-coverage'

export default sliceCode

function sliceCode(sourceCode, coverageData) {
  const {path: filename} = coverageData
  const filteredCoverage = transformCoverage(coverageData)
  // console.log('\n\n\n\nsourceCode\n', sourceCode)
  const sliced = babel.transform(sourceCode, {
    filename,
    comments: false,
    babelrc: false,
    plugins: [
      getSliceCodeTransform(filteredCoverage),
    ],
  })
  // console.log('sliced', sliced.code)
  // TODO: perf - save time parsing by just transforming the AST from the previous run
  // This will probably significantly speed things up.
  // Unfortunately, when I tried the first time, I couldn't get it working :shrug:
  // console.log('deadCodeEliminated', deadCodeEliminated)
  const {code: deadCodeEliminated} = babel.transform(sliced.code, {
    filename,
    babelrc: false,
    plugins: [
      deadCodeElimination,
    ],
  })
  return deadCodeEliminated
}

function getSliceCodeTransform(filteredCoverage) {
  const {fnMap} = filteredCoverage
  return function sliceCodeTransform() {
    return {
      visitor: {
        FunctionDeclaration(path) {
          if (!isFunctionCovered(fnMap, path.node)) {
            removePathAndReferences(path, path.node.id.name)
          }
        },
        ArrowFunctionExpression(path) {
          if (!isFunctionCovered(fnMap, path.node)) {
            removePathAndReferences(path, path.parentPath.node.id.name)
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
              if (skipPath()) {
                return
              }
              const sideIsCovered = isBranchSideCovered(branchMap, key, node, parent)
              const otherSideExists = !!path.node[otherKey]
              const otherSideIsCovered = isBranchSideCovered(branchMap, otherKey, node, parent)
              if (isUncoveredAndMissingElse()) {
                handleUncoveredAndMissingElse()
              } else if (hasUncoveredSide()) {
                // console.log('replaceNodeWithNodeFromParent(childPath, otherKey)', childPath, otherKey)
                replaceNodeWithNodeFromParent(childPath, otherKey)
              }

              function skipPath() {
                return parentPath.removed || parentPath !== path || !(key === 'consequent' || key === 'alternate')
              }

              function isUncoveredAndMissingElse() {
                return !sideIsCovered && !otherSideExists
              }

              function handleUncoveredAndMissingElse() {
                if (otherSideIsCovered) {
                  // if (foo) { /* not covered */ } (else-path doesn't exist but is covered) // result: removed
                  // console.log('path.remove()')
                  path.remove()
                } else {
                  // if (foo) { /* not covered */ } // (else-path doesn't exist and isn't covered) // result: ... not sure :shrug:
                  // console.log('childPath.remove()')
                  childPath.remove()
                }
              }

              function hasUncoveredSide() {
                // if (foo) { /* not covered */ } else { /* covered */ } // result: /* covered */
                // if (foo) { /* not covered */ } else { /* not covered */ } // result: removed
                // if (foo) { /* covered */ } (else-path doesn't exist and isn't covered) // result: /* covered */
                // if (foo) { /* covered */ } else { /* not covered */ } // result: ... not sure :shrug:
                return (
                  (!sideIsCovered || !otherSideExists) && !otherSideIsCovered
                ) || !sideIsCovered && otherSideIsCovered
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
            if (path.parentPath.node.type.includes('Expression')) {
              path.parentPath.remove()
            } else {
              path.remove()
            }
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
        LogicalExpression(path) {
          if (path.removed) {
            return
          }
          const {branchMap} = filteredCoverage
          const branchCoverageInfo = getLogicalExpressionBranchCoverageInfo(branchMap, path.node)
          // console.log('branchCoverageInfo', branchCoverageInfo)
          if (!branchCoverageInfo) {
            // if there's not branch coverage info available, that could mean that this
            // LogicalExpression is part of another LogicalExpression, so we can skip this one
            return
          }
          path.traverse({
            enter(childPath) {
              const location = branchCoverageInfo.locations.find(loc => isLocationEqual(loc, childPath.node.loc))
              // if there's not a location available, that doesn't mean it's not covered in this case
              if (location && !location.covered) {
                replaceNodeWithNodeFromParent(childPath, childPath.key === 'left' ? 'right' : 'left')
              }
            },
          })
          return
        },
      },
    }
  }
}

function isFunctionCovered(fnLocs, {body: {loc: srcLoc}}) {
  const fnCov = Object.keys(fnLocs)
    .map(key => fnLocs[key])
    .find(({loc}) => isLocationEqual(loc, srcLoc))
  return fnCov
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
    } else if (branch.type === 'binary-expr' && node.type !== 'LogicalExpression') {
      return false
    }
    return isLocationEqual(branch.loc, node.loc)
  })
  return branches[index]
}

function isBranchSideCovered(branches, side, node, parentNode) {
  const branch = getBranchCoverageData(branches, parentNode)
  if (!branch) {
    return false
  }
  return branch[side].covered
}

function getLogicalExpressionBranchCoverageInfo(branches, node) {
  return Object.keys(branches)
    .map(key => branches[key])
    .filter(branch => branch.type === 'binary-expr')
    .find(branch => isLocationEqual(node.loc, branch.loc))
}

function isLocationEqual(loc1, loc2) {
  if (!loc1 || !loc2) {
    return false
  }
  const isEqual = isLineColumnEqual(loc1.start, loc2.start) &&
    isLineColumnEqual(loc1.end, loc2.end)
  return isEqual
}

function isLineColumnEqual(obj1, obj2) {
  return obj1.line === obj2.line && obj1.column === obj2.column
}

function replaceNodeWithNodeFromParent(path, key) {
  const {parentPath, parent} = path
  const replacementNode = parent[key] || path.node
  if (parentPath.type === 'IfStatement') {
    // if there are side-effects in the IfStatement, then we need to preserve those
    const typesToPreserve = ['AssignmentExpression', 'CallExpression']
    const nodesToPreserve = []
    parentPath.get('test').traverse({
      enter(testChildPath) {
        if (typesToPreserve.includes(testChildPath.node.type)) {
          nodesToPreserve.push(testChildPath.node)
        }
      },
    })
    parentPath.insertBefore(nodesToPreserve)
  }
  if (replacementNode && replacementNode.body) {
    parentPath.replaceWithMultiple(replacementNode.body)
  } else if (replacementNode) {
    parentPath.replaceWith(replacementNode)
  }
}

function removePathAndReferences(path, name) {
  path.scope.getBinding(name).referencePaths.forEach(binding => {
    if (binding.parent.type === 'ExportSpecifier') {
      const {parentPath: {parent: {specifiers}}} = binding
      const specifierIndex = specifiers.indexOf(binding.parent)
      if (specifierIndex > -1) {
        specifiers.splice(specifierIndex, 1)
      }
    } else if (binding.type === 'ExportNamedDeclaration') {
      binding.remove()
    } else if (binding.parent.type === 'CallExpression') {
      binding.parentPath.parentPath.remove()
    } else {
      binding.parentPath.remove()
    }
  })
  path.remove()
}
