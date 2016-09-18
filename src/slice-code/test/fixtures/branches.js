/* eslint no-constant-condition:0, consistent-return:0 */
export {ifOnly, ifElse, ifElseIfElse}

function ifOnly(passIf) {
  if (passIf) {
    return passIf
  }
}

function ifElse(passIf) {
  if (passIf) {
    return passIf
  } else {
    return !passIf
  }
}

function ifElseIfElse(passIf1, passIf2) {
  if (passIf1) {
    return passIf1
  } else if (passIf2) {
    return passIf2
  } else {
    return !passIf1 && !passIf2
  }
}
