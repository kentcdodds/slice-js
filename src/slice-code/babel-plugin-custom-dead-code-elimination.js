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
        const {id} = path.node
        if (t.isObjectPattern(id)) {
          id.properties.forEach(objectProperty => {
            findAndRemoveUnusedBindings(path, objectProperty.value)
          })
        } else if (t.isIdentifier) {
          findAndRemoveUnusedBindings(path, id)
        }
      },
      ExpressionStatement(path) {
        if (t.isMemberExpression(path.node.expression)) {
          // foo.bar; (this could break code if there are side-effects via getters)
          path.remove()
        }
      },
    },
  }
}

function findAndRemoveUnusedBindings(path, identifier) {
  const binding = path.scope.getBinding(identifier.name)
  if (!binding || !binding.referencePaths.length || isReferencingOnlyItself(identifier, binding)) {
    path.remove()
  }
}

function isReferencingOnlyItself(identifier, binding) {
  return binding.referencePaths.length === 1 &&
    binding.referencePaths[0].node === identifier
}
