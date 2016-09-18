/* eslint no-constant-condition:0 */
export {ifOnly, ifElse, ifElseIfElse}

function ifOnly(passIf) {
  if (passIf) {
    return
  }
}

function ifElse(passIf) {
  if (passIf) {
    return
  } else {
    return
  }
}

function ifElseIfElse(passIf1, passIf2) {
  if (passIf1) {
    return
  } else if (passIf2) {
    return
  } else {
    return
  }
}
