export {ifStatement, condExpr, logicalExpr}

function ifStatement(passIf) {
  if (!passIf) {
    return 'did not reach IfStatement'
  }
  if (passIf) {
    return 'reached IfStatement'
  }
}

function condExpr(passIf) {
  if (!passIf) {
    return 'did not reach IfStatement'
  }
  return passIf ? 'reached CondExpr Consequent' : 'reached CondExpr Alternate'
}

function logicalExpr(passIf) {
  if (!passIf) {
    return 'did not reach IfStatement'
  }
  return passIf && 'reached LogicalExpression'
}
