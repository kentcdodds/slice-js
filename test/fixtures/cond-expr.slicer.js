import slice from '../../src'
import * as module from './cond-expr'

// this is just here to make it so we can generate a coverage report with jest easily
if (global.test) {
  test('works', () => {})
}

slice(require.resolve('./cond-expr'), 'consequent-only', () => {
  module.isConstantOrAlternate('consequent')
})

slice(require.resolve('./cond-expr'), 'alternate-only', () => {
  module.isConstantOrAlternate('alternate')
})

slice(require.resolve('./cond-expr'), `alternate's consequent`, () => {
  module.isConstantOrAlternate('neither')
})

slice(require.resolve('./cond-expr'), 'both consequent and alternate', () => {
  // TODO: This one isn't getting rid of the alternate's alternate :-(
  module.isConstantOrAlternate('consequent')
  module.isConstantOrAlternate('alternate')
})

slice(require.resolve('./cond-expr'), `consequent, alternate, and alternate's consequent`, () => {
  module.isConstantOrAlternate('consequent')
  module.isConstantOrAlternate('alternate')
  module.isConstantOrAlternate('neither')
})
