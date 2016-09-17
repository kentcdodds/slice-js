/* eslint import/prefer-default-export:0, no-nested-ternary:0, no-unneeded-ternary:0 */
export {isConstantOrAlternate}

function isConstantOrAlternate(a) {
  return a === 'consequent' ? 'isConsequent' : a === 'alternate' ? 'isAlternate' : `isAlternate's Consequent`
}
