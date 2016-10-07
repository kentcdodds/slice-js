export {unusedAssignment, dependencies, sortRankedItems}

function unusedAssignment(a, b, c) {
  const aIndex = a.index
  const {index: bIndex} = b
  const {index} = c
  return aIndex > bIndex ? 'aIndex' : bIndex > index ? 'bIndex' : 'c.index'
}

function dependencies(foo, bar) {
  const [firstFoo] = foo
  const [firstBar] = bar
  const foobar = firstFoo === firstBar
  if (foobar) {
    return 'same'
  } else {
    return 'different'
  }
}

function sortRankedItems(a, b) {
  var {rank: aRank} = a
  var bRank = b.rank

  var same = aRank === bRank
  if (same) {
    return 'same'
  } else {
    return 'not same'
  }
}
