export {switchWithFallThrough}

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
