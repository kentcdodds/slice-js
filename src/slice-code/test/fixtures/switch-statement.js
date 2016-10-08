export {switchWithFallThrough, switchWithDefault, switchWithSideEffects}

function switchWithFallThrough(color) {
  let ret = null
  switch (color) {
    case 'green':
    case 'blue':
    case 'purple':
      ret = `1st ${color}`
      break
    case 'yellow':
    case 'orange':
    case 'red':
      ret = `2nd ${color}`
  }
  return ret
}

function switchWithDefault(candy) {
  switch(candy) {
    case 'twix':
      return `case ${candy}`
    default:
      return 'default, no candy :-('
  }
}

function switchWithSideEffects(character) {
  switch(sideEffect(character)) {
    case 'harry':
      return ['main', character]
    default:
      return ['supporting', character]
  }

  function sideEffect(obj) {
    obj.touched = true
    return obj.name
  }
}
