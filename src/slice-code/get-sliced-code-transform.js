/* eslint max-lines:[2, 1000] */ // I know it's nuts, but it's a lot easier to develop with ASTExplorer.net this way...
export default getSliceCodeTransform

function getSliceCodeTransform(filteredCoverage) {
  const {fnMap, branchMap} = filteredCoverage
  const removedPaths = new Set()
  return function sliceCodeTransform({types: t}) {
    return {
      visitor: {
        Program(path) {
          path.traverse({
            enter(childPath) {
              t.removeComments(childPath.node)
            },
          })
        },
        FunctionDeclaration: functionVisitor,
        FunctionExpression: functionVisitor,
        ArrowFunctionExpression: arrowFunctionVisitor,
        IfStatement(path) {
          if (!isBranchCovered(branchMap, path.node)) {
            // console.log('2922')
            removedPaths.add(path)
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
                  // console.log('2954')
                  path.remove()
                } else {
                  // if (foo) { /* not covered */ } // (else-path doesn't exist and isn't covered) // result: ... not sure :shrug:
                  // console.log('2959')
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
          const branchCoverageData = getBranchCoverageData(branchMap, path.node)

          if (!branchCoverageData) {
            // console.log('2981')
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
                // console.log('2995')
                replaceNodeWithNodeFromParent(childPath, otherKey)
              }
            },
          })
        },
        LogicalExpression(path) {
          const branchCoverageInfo = getLogicalExpressionBranchCoverageInfo(branchMap, path.node)
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
              if (childPath.type === 'LogicalExpression') {
                handleNestedLogicalExpression(childPath)
                return
              }
              if (!nodesToPreserve.includes(childPath.node)) {
                const otherSideKey = childPath.key === 'left' ? 'right' : 'left'
                replaceNodeWithNodeFromParent(childPath, otherSideKey)
              }

              function handleNestedLogicalExpression(nestedExpressionPath) {
                const otherSideKey = nestedExpressionPath.key === 'left' ? 'right' : 'left'
                // if the child is a LogicalExpression, then we need to replace the parent node with only the
                // side of the expression that is covered.
                const includesLeft = isNestedLogicalExpressionIsCovered(nodesToPreserve, nestedExpressionPath.node.left)
                const includesRight = isNestedLogicalExpressionIsCovered(nodesToPreserve, nestedExpressionPath.node.right)
                if (!includesLeft && !includesRight) {
                  // if neither side is covered, then take the parent (LogicalExpression) and replace it with just the other side
                  replaceNodeWithNodeFromParent(nestedExpressionPath, otherSideKey)
                  return
                }
                if (includesLeft && includesRight) {
                  // if both sides are covered, then don't replace the parent at all. This side is is needed
                  return // eslint-disable-line no-useless-return
                } else if (!includesRight) { // eslint-disable-line no-negated-condition
                  // if the right isn't covered (and the left is), then just replace the whole LogicalExpression with the left
                  // console.log('3045')
                  nestedExpressionPath.replaceWith(nestedExpressionPath.node.left)
                } else { // !includesLeft
                  // if the left isn't covered (and the right is), then just replace the whole LogicalExpression with the right
                  // console.log('3049')
                  nestedExpressionPath.replaceWith(nestedExpressionPath.node.right)
                }
                return // eslint-disable-line no-useless-return
              }
            },
          })
        },
        TryStatement(path) {
          const {statementMap} = filteredCoverage
          const tryBlockPath = path.get('block')
          const catchBlockPath = path.get('handler.body')
          const finallyBlockPath = path.get('finalizer')
          const coveredTryStatements = getCoveredStatementsFromBlock(statementMap, tryBlockPath.node)
          const coveredCatchStatements = getCoveredStatementsFromBlock(statementMap, catchBlockPath.node)
          const coveredFinallyStatements = getCoveredStatementsFromBlock(statementMap, finallyBlockPath.node)
          if (!coveredCatchStatements.length) {
            path.replaceWithMultiple([
              ...coveredTryStatements,
              ...coveredFinallyStatements,
            ])
          } else if (coveredTryStatements.length < tryBlockPath.node.body) {
            tryBlockPath.node.body = coveredTryStatements
          }
        },
        SwitchStatement(path) {
          // note: SwitchStatements will always be covered.
          // the only time it isn't is if it's in a function/IfStatement/etc.
          // that isn't covered, which would be removed. So we don't need to
          // worry about checking whether the switch is covered.
          const coverageInfo = getBranchCoverageData(branchMap, path.node)
          path.get('cases').forEach(casePath => {
            if (!isCaseCovered(casePath.node)) {
              casePath.remove()
            }
          })
          const remainingCases = path.get('cases')
          if (remainingCases.length === 1) {
            const nodesToPreserve = remainingCases[0].node.consequent.filter(node => {
              return !t.isBreakStatement(node)
            })
            if (!t.isIdentifier(path.node.discriminant)) {
              path.insertBefore(path.node.discriminant)
            }
            path.replaceWithMultiple(nodesToPreserve)
          }

          function isCaseCovered(caseNode) {
            const caseLocation = coverageInfo.locations.find(location => {
              return isLocationEqual(location, caseNode.loc)
            })
            return !!caseLocation && caseLocation.covered
          }
        },
      },
    }

    function arrowFunctionVisitor(path) {
      if (!isFunctionCovered(fnMap, path.node)) {
        if (isFunctionReferenced(path)) {
          // if the function is referenced, then the best we can do is clear the body
          path.addComment('leading', `slice-js-coverage-ignore ignore next`)
          path.node.body.body = []
          return
        }
        if (t.isAssignmentExpression(path.parentPath)) {
          path.parentPath.remove()
        } else if (path.parentPath.node.id) {
          removePathAndReferences(path, path.parentPath.node.id.name)
        } else {
          path.remove()
        }
      }
    }

    function functionVisitor(path) {
      /* eslint complexity:[2,6] */
      if (isFunctionCovered(fnMap, path.node)) {
        return
      }
      if (shouldPreserveFunctionBody(path)) {
        // if it's detected that we should preserve the function body, then
        // we shouldn't do anything with the function except ignore coverage on it
        path.addComment('leading', `slice-js-coverage-ignore ignore next`)
      } else if (isFunctionReferenced(path)) {
        path.addComment('leading', `slice-js-coverage-ignore ignore next`)
        // if the function is referenced, then the best we can do is clear the body
        path.node.body.body = []
      } else if (t.isAssignmentExpression(path.parentPath) || t.isFunctionExpression(path)) {
        path.parentPath.remove()
      } else {
        removePathAndReferences(path, path.node.id.name)
      }
    }

    function shouldPreserveFunctionBody(path) {
      const statementPath = path.getStatementParent()
      if (t.isReturnStatement(statementPath)) {
        // coveres `foo` in: function bar() { return function foo() {} }
        const functionParent = statementPath.getFunctionParent()
        return isFunctionCovered(fnMap, functionParent.node)
      } else {
        // TODO: cover more edge cases
        return isFunctionCovered(fnMap, path.node)
      }
    }

    function isFunctionReferenced(path) {
      if (t.isFunctionDeclaration(path)) {
        return isFunctionDeclarationReferenced()
      } else if (t.isAssignmentExpression(path.parentPath)) {
        return isFunctionExpressionReferenced()
      } else {
        return false
      }

      function isFunctionExpressionReferenced() {
        // from here on out, we're looking for something like this:
        // foo.bar.baz = () => {}
        // // then later
        // foo.bar.baz.buzz = 'referencing baz'
        const expressionStatement = path.parentPath.findParent(t.isExpressionStatement)
        const referenceChain = buildReferenceChain(expressionStatement.get('expression.left'))
        const start = expressionStatement.get('expression.left.object')
        const binding = path.scope.getBinding(start.node.name)
        if (!binding) {
          return false
        }
        // return whether at least one of these references is referencing the function
        return binding.referencePaths.some(refPath => {
          const expStatement = refPath.findParent(t.isExpressionStatement)
          if (!expStatement || !expStatement.node) {
            return false
          }
          const memberExpression = expStatement.get('expression.left')
          if (!t.isMemberExpression(memberExpression)) {
            return false
          }
          const refChain = buildReferenceChain(memberExpression)
          // refChain: [foo, bar, baz], referenceChain: [foo, bar] :+1:
          if (refChain < referenceChain.length) {
            return false
          }
          // return false if the referenceChain has anything the refChain does not
          // this means the refChain can be longer
          return !refChain.every((ref, i) => {
            return !referenceChain[i] || // if we've run out of referenceChain elements, then we're good
              ref.node === referenceChain[i].node || // if we're referencing the same node, this isn't enough to keep it around
              ref.node.name !== referenceChain[i].node.name // if it's a different name, then it's not a reference
          })
        })

        function buildReferenceChain(memberExpression) {
          let iterations = 0
          let property = memberExpression.get('property')
          let object = memberExpression.get('object')
          const chain = [property]
          while (t.isMemberExpression(object)) {
            property = object.get('property')
            object = object.get('object')
            chain.push(property)
            iterations++
            if (iterations > 10) {
              throw new Error('slice-js avoiding infinite loop in buildReferenceChain')
            }
          }
          return chain.reverse()
        }
      }

      function isFunctionDeclarationReferenced() {
        const {name} = path.get('id').node
        path.scope.getBinding(name).referencePaths.every(refPath => (
          refPath.find(parent => (
            // we don't care about references to exports
            !t.isExportDefaultDeclaration(parent) &&
            !t.isExportSpecifier(parent)
          ))
        ))
      }
    }

    function replaceNodeWithNodeFromParent(path, key) {
      // console.log('replaceNodeWithNodeFromParent', path, key)
      const {parentPath, parent} = path
      const replacementNode = parent[key] || path.node
      if (parentPath.type === 'IfStatement') {
        // if there are side-effects in the IfStatement, then we need to preserve those
        const typesToPreserve = ['AssignmentExpression', 'CallExpression', 'UnaryExpression']
        const typesToWrap = ['CallExpression', 'UnaryExpression'] // these can't exist on their own and need to be wrapped in an ExpressionStatement
        const nodesToPreserve = []
        const testPath = parentPath.get('test')
        testPath.traverse({
          enter(testChildPath) {
            const EXIT_EARLY = 'EXIT_EARLY'
            if (testChildPath.parentPath !== testPath) {
              // we're only concerned with direct children
              return
            }

            const result = handleLogicalExpression()
            if (result === EXIT_EARLY) {
              return
            }
            preserveNode()

            function preserveNode() {
              if (typesToPreserve.includes(testChildPath.node.type)) {
                if (typesToWrap.includes(testChildPath.node.type)) {
                  nodesToPreserve.push(t.expressionStatement(testChildPath.node))
                } else {
                  nodesToPreserve.push(testChildPath.node)
                }
              }
            }

            function handleLogicalExpression() {
              const logicalExpressionNodesToPreserve = getLogicalExpressionNodesToPreserve(testChildPath.parentPath, branchMap)
              if (testChildPath.parent.type === 'LogicalExpression') {
                handleNestedLogicalExpression(logicalExpressionNodesToPreserve)
                if (!logicalExpressionNodesToPreserve.includes(testChildPath.node)) {
                  // if this part of the LogicalExpression is not covered, then we don't want to preserve it.
                  return EXIT_EARLY
                }
              }
              return null
            }

            function handleNestedLogicalExpression(coveredNodes) {
              if (testChildPath.type !== 'LogicalExpression') {
                return
              }
              const includesLeft = isNestedLogicalExpressionIsCovered(coveredNodes, testChildPath.node.left)
              const includesRight = isNestedLogicalExpressionIsCovered(coveredNodes, testChildPath.node.right)
              // need to create an expression statement because we'll be removing the if statement
              // and this needs to be a node that can stand on its own.
              if (includesLeft && includesRight) {
                nodesToPreserve.push(t.expressionStatement(testChildPath.node))
              } else if (!includesRight) { // eslint-disable-line no-negated-condition
                nodesToPreserve.push(t.expressionStatement(testChildPath.node.left))
              } else { // !includesLeft
                nodesToPreserve.push(t.expressionStatement(testChildPath.node.right))
              }
            }
          },
        })
        parentPath.insertBefore(nodesToPreserve)
      }
      if (replacementNode && replacementNode.body) {
        // console.log('3213')
        parentPath.replaceWithMultiple(replacementNode.body)
      } else if (replacementNode) {
        // console.log('3216')
        parentPath.replaceWith(replacementNode)
      }
    }

    function removePathAndReferences(path, name) {
      path.scope.getBinding(name).referencePaths.forEach(binding => {
        // console.log('removing binding', binding)
        if (binding.parent.type === 'ExportSpecifier') {
          removeExportSpecifierBinding(binding)
        } else if (binding.type === 'ExportNamedDeclaration') {
          // console.log('3227')
          binding.remove()
        } else if (binding.parent.type === 'CallExpression') {
          // console.log('3230')
          removeCallExpressionBinding(binding)
        } else {
          /* istanbul ignore next we have no coverage of this else... and that's the problem :) */
          console.error('path', path) // eslint-disable-line no-console
          /* istanbul ignore next */
          console.error('binding', binding) // eslint-disable-line no-console
          /* istanbul ignore next */
          throw new Error(
            'Attempting to remove a type of binding for a path that has not yet be implemented. ' +
            'Please investigate how to safely remove this binding.',
          )
        }
      })
      if (path.parentPath.type === 'VariableDeclarator') {
        // console.log('3244')
        path.parentPath.remove()
      } else {
        // console.log('path remove', path)
        // console.log('3248')
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
        const removedNode = binding.findParent(parentPath => removedPaths.has(parentPath))
        if (removedNode) {
          // no need to remove any children
          return
        }
        if (usePath.type === 'LogicalExpression') {
          const otherSideOfLogicalExpressionKey = callPath.key === 'left' ? 'right' : 'left'
          // console.log('3266')
          usePath.replaceWith(usePath.node[otherSideOfLogicalExpressionKey])
        } else if (usePath.type === 'ConditionalExpression') {
          removeConditionalExpressionSide(callPath)
        } else {
          // console.log('3269', usePath.getSource(), usePath)
          usePath.remove()
        }
      }

      function removeConditionalExpressionSide(condPath) {
        const {key} = condPath
        const otherKey = key === 'consequent' ? 'alternate' : 'consequent'
        if (
          !condPath.removed &&
          condPath.parentPath === path &&
          (key === 'consequent' || key === 'alternate')
        ) {
          // console.log('3266')
          replaceNodeWithNodeFromParent(condPath, otherKey)
        }
      }
    }
  }

}

function getFunctionCoverageData(fnLocs, {body: {loc: srcLoc}}) {
  const fnCov = Object.keys(fnLocs)
    .map(key => fnLocs[key])
    .find(({loc}) => isLocationEqual(loc, srcLoc))
  return fnCov
}

function isFunctionCovered(fnLocs, node) {
  return !!getFunctionCoverageData(fnLocs, node)
}

function isBranchCovered(branches, node) {
  const branchCoverageData = getBranchCoverageData(branches, node)
  return !!branchCoverageData
}

function getBranchCoverageData(branches, node) {
  const typeMap = {
    if: 'IfStatement',
    'cond-expr': 'ConditionalExpression',
    'binary-expr': 'LogicalExpression',
    switch: 'SwitchStatement',
  }
  const index = Object.keys(branches).find(key => {
    const branch = branches[key]
    if (typeMap[branch.type] !== node.type) {
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

function isNestedLogicalExpressionIsCovered(coveredNodes, node) {
  if (node.type === 'LogicalExpression') {
    return isNestedLogicalExpressionIsCovered(coveredNodes, node.left) ||
      isNestedLogicalExpressionIsCovered(coveredNodes, node.right)
  } else {
    return coveredNodes.includes(node)
  }
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

function getCoveredStatementsFromBlock(coveredStatements, blockNode) {
  if (!blockNode) {
    return []
  }
  return blockNode.body.reduce((allStatements, statement) => {
    if (isStatementCovered(coveredStatements, statement)) {
      allStatements.push(statement)
    }
    return allStatements
  }, [])
}

function isStatementCovered(coveredStatements, statement) {
  return Object.keys(coveredStatements).find(s => {
    const coveredLoc = coveredStatements[s]
    return isLocationEqual(coveredLoc, statement.loc)
  })
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
