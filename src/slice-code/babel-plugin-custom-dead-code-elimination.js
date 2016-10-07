export default customDeadCodeElimination

function customDeadCodeElimination({types: t}) {
  return {
    visitor: {
      AssignmentExpression(path) {
        const {left, right} = path.node
        if (t.isIdentifier(left) && t.isIdentifier(right) && left.name === right.name) {
          path.remove()
        }
      },
      VariableDeclarator(path) {
        const id = path.get('id')
        if (t.isObjectPattern(id)) {
          id.get('properties').forEach(objectProperty => {
            findAndRemoveUnusedBindings(objectProperty, objectProperty.get('value'))
          })
        } else if (t.isArrayPattern(id)) {
          id.get('elements').forEach(element => {
            findAndRemoveUnusedBindings(element, element)
          })
        } else if (t.isIdentifier(id)) {
          const keepReferences = true // TODO, there appears to be a bug with
          findAndRemoveUnusedBindings(path, id, keepReferences)
        } else {
          throw new Error(`slice-js does not yet support VariableDeclarators with an id of type ${id.type}`)
        }
      },
      ExpressionStatement(path) {
        if (t.isMemberExpression(path.node.expression)) {
          // foo.bar; (this could break code if there are side-effects via getters)
          path.remove()
        }
      },
      Program: {
        // these are things we can only reasonably try to remove after everything else has been removed.
        exit(path) {
          path.traverse({
            ObjectPattern(objPath) {
              if (!objPath.node.properties.length) {
                // `var {} = foo` // don't ask me why....
                objPath.parentPath.remove()
              }
            },
          })
        },
      },
    },
  }

  function findAndRemoveUnusedBindings(path, identifier) {
    if (isRemoved(path)) {
      return
    }
    const referencePaths = getReferencePaths(path, identifier.node.name)
    if (isReferencingNothingButItself(identifier.node, referencePaths)) {
      path.remove()
    }
  }

  function getReferencePaths(path, name) {
    const binding = path.scope.getBinding(name) || {referencePaths: []}
    return binding.referencePaths.filter(isNotRemoved)
  }

  function isReferencingNothingButItself(identifier, referencePaths) {
    return !referencePaths.length ||
      (referencePaths.length === 1 && referencePaths[0].node === identifier)
  }

  function isRemoved(path) {
    // if the path has a parent that has no node, then it has been removed
    return !!path.find(parent => !parent.node)
  }

  function isNotRemoved(path) {
    return !isRemoved(path)
  }

}
