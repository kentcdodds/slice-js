export {switchWithFallThrough, switchWithDefault}

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
