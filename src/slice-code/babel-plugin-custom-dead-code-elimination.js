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
                objPath.parentPath.remove()
              }
            },
          })
        },
      },
    },
  }

  function findAndRemoveUnusedBindings(path, identifier, keepReferences = false) {
    if (isRemoved(path)) {
      return
    }
    const referencePaths = getReferencePaths(path, identifier.node.name)
    if (isReferencingNothingButItself(identifier.node, referencePaths)) {
      // because there are either no references or it is only referencing itself, can safely remove it
      // first let's get all the children identifiers (like `baz` in `foo = baz * 43`)
      const childIdentifierReferencePaths = getChildIdentifierReferencePaths(path)
      path.remove()
      if (keepReferences) {
        return
      }
      const remainingIdentifierReferencePaths = childIdentifierReferencePaths.filter(isNotRemoved)
      remainingIdentifierReferencePaths.forEach(idPath => {
        const identifierReferencePaths = getReferencePaths(idPath, idPath.node.name)
        identifierReferencePaths.forEach(removeVariableDeclarationViaIdentifier)
      })
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

  function getChildIdentifierReferencePaths(path) {
    const identifiers = []
    path.traverse({
      Identifier(childPath) {
        identifiers.push(...getReferencePaths(childPath, childPath.node.name))
      },
    })
    return identifiers
  }

  function isRemoved(path) {
    // if the path has a parent that has no node, then it has been removed
    return !!path.find(parent => !parent.node)
  }

  function isNotRemoved(path) {
    return !isRemoved(path)
  }

  function removeVariableDeclarationViaIdentifier(identifier) {
    if (t.isObjectProperty(identifier.parentPath)) {
      const objectPattern = identifier.parentPath.parentPath
      if (objectPattern.node.properties.length < 2) {
        objectPattern.parentPath.remove() // remove entire VariableDeclarator
      } else {
        const index = objectPattern.node.properties.indexOf(identifier.parentPath)
        objectPattern.node.properties.splice(index, 1) // just remove the one objectProperty
      }
    } else {
      throw new Error(`slice-js does not yet support removing the type ${identifier.parentPath.type} in removeVariableDeclarationViaIdentifier`)
    }
  }
}
