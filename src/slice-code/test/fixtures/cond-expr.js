/* eslint import/prefer-default-export:0, no-nested-ternary:0, no-unneeded-ternary:0 */
export {isConsequentOrAlternate, isConsequentOrAlternatesConsequentOrAlternate}

function isConsequentOrAlternate(isConsequent) {
  return isConsequent ? isConsequent : !isConsequent
}

function isConsequentOrAlternatesConsequentOrAlternate(isConsequent, isAlternatesConsequent) {
  return isConsequent ? isConsequent : isAlternatesConsequent ? isAlternatesConsequent : !isConsequent && !isAlternatesConsequent
}
