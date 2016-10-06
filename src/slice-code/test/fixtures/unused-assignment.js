export {unusedAssignment}

function unusedAssignment(a, b, c) {
  const aIndex = a.index
  const {index: bIndex} = b
  const {index} = c
  return aIndex > bIndex ? 'aIndex' : bIndex > index ? 'bIndex' : 'c.index'
}
