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
  const setThing = a => (thing = a, passIf)
  if (passIf && setThing('hey') && someOtherThing(passIf)) {
    return thing + passIf
  } else if (!someOtherThing(passIf) || passIf) {
    return !passIf
  } else {
    return passIf
  }

  function someOtherThing(a) {
    return a
  }
}
