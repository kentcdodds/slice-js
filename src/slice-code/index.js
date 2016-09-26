import * as babel from 'babel-core'
import deadCodeElimination from 'babel-plugin-minify-dead-code-elimination'
import transformCoverage from './transform-coverage'

export default sliceCode

function sliceCode(sourceCode, coverageData) {
  const {path: filename} = coverageData
  const filteredCoverage = transformCoverage(coverageData)
  // console.log('filteredCoverage', JSON.stringify(filteredCoverage, null, 2))
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
                replaceNodeWithNodeFromParent(childPath, otherKey, branchMap)
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
                replaceNodeWithNodeFromParent(childPath, otherKey, branchMap)
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
          const nodesToPreserve = getLogicalExpressionNodesToPreserve(path, branchMap)
          // console.log(nodesToPreserve)
          path.traverse({
            enter(childPath) {
              if (childPath.parentPath !== path) {
                // we only care about direct children
                return
              }
              if (!nodesToPreserve.includes(childPath.node)) {
                replaceNodeWithNodeFromParent(childPath, childPath.key === 'left' ? 'right' : 'left', branchMap)
              }
            },
          })
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

function getLogicalExpressionNodesToPreserve(path, branchMap) {
  const branchCoverageInfo = getLogicalExpressionBranchCoverageInfo(branchMap, path.node)
  // console.log('branchCoverageInfo', branchCoverageInfo)
  if (!branchCoverageInfo) {
    // if there's not branch coverage info available, that could mean that this
    // LogicalExpression is part of another LogicalExpression, so we can skip this one
    return null
  }
  const nodesToPreserve = []
  path.traverse({
    enter(childPath) {
      const location = branchCoverageInfo.locations.find(loc => isLocationEqual(loc, childPath.node.loc))
      if (location && location.covered) {
        nodesToPreserve.push(childPath.node)
      }
    },
  })
  return nodesToPreserve
}

function replaceNodeWithNodeFromParent(path, key, branchMap) {
  const {parentPath, parent} = path
  const replacementNode = parent[key] || path.node
  if (parentPath.type === 'IfStatement') {
    // if there are side-effects in the IfStatement, then we need to preserve those
    const typesToPreserve = ['AssignmentExpression', 'CallExpression']
    const nodesToPreserve = []
    const testPath = parentPath.get('test')
    testPath.traverse({
      enter(testChildPath) {
        if (testChildPath.parentPath !== testPath) {
          // we're only concerend with direct children
          return
        }
        if (testChildPath.parent.type === 'LogicalExpression') {
          const logicalExpressionNodesToPreserve = getLogicalExpressionNodesToPreserve(testChildPath.parentPath, branchMap)
          if (testChildPath.type === 'LogicalExpression') {
            const includesLeft = logicalExpressionNodesToPreserve.includes(testChildPath.node.left)
            const includesRight = logicalExpressionNodesToPreserve.includes(testChildPath.node.right)
            if (includesLeft && includesRight) {
              nodesToPreserve.push(testChildPath.node)
            } else if (!includesRight) {
              nodesToPreserve.push(testChildPath.node.left)
            } else { // !includesLeft
              nodesToPreserve.push(testChildPath.node.right)
            }
            return
          } else if (!logicalExpressionNodesToPreserve.includes(testChildPath.node)) {
            // if this part of the LogicalExpression is not covered, then we don't want to preserve it.
            return
          }
        }
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
    // console.log('removing binding', binding)
    if (binding.parent.type === 'ExportSpecifier') {
      removeExportSpecifierBinding(binding)
    } else if (binding.type === 'ExportNamedDeclaration') {
      binding.remove()
    } else if (binding.parent.type === 'CallExpression') {
      removeCallExpressionBinding(binding)
    } else {
      /* istanbul ignore next we have no coverage of this else... and that's the problem :) */
      console.error('path', path) // eslint-disable-line no-console
      /* istanbul ignore next */
      console.error('binding', binding) // eslint-disable-line no-console
      /* istanbul ignore next */
      throw new Error(
        'Attempting to remove a type of binding for a path that has not yet be implemented. ' +
        'Please investigate how to safely remove this binding.'
      )
    }
  })
  if (path.parentPath.type === 'VariableDeclarator') {
    path.parentPath.remove()
  } else {
    // console.log('path remove', path)
    path.remove()
  }

  function removeExportSpecifierBinding(binding) {
    const {parentPath: {parent: {specifiers}}} = binding
    const specifierIndex = specifiers.indexOf(binding.parent)
    // no need to check whether index is -1. It's definitely in there.
    specifiers.splice(specifierIndex, 1)
  }

  function removeCallExpressionBinding(binding) {
    // console.log('removeCallExpressionBinding(binding)', binding)
    // console.log(binding.scope.getBinding(binding.node.name).referencePaths)
    const {parentPath: callPath} = binding
    const {parentPath: usePath} = callPath
    if (usePath.type === 'LogicalExpression') {
      const otherSideOfLogicalExpressionKey = callPath.key === 'left' ? 'right' : 'left'
      usePath.replaceWith(usePath.node[otherSideOfLogicalExpressionKey])
    } else {
      usePath.remove()
    }
  }
}
