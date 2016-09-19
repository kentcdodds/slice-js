export {ifWithAssignment, ifWithFunctionCall}

function ifWithAssignment(passIf) {
  let x
  if ((x = 'hi') && passIf) {
    return x + passIf
  } else {
    return !passIf + x
  }
}

function ifWithFunctionCall(passIf) {
  let thing
  const setThing = a => thing = a
  if (passIf && setThing('hey')) {
    return thing + passIf
  } else {
    return !passIf
  }
}
