import slice from '../../src'

// this is just here to make it so we can generate a coverage report with jest easily
if (global.test) {
  test('works', () => {})
}

const modulePath = require.resolve('./cond-expr')

slice(modulePath, `isConstantOrAlternate('consequent')`, ({isConstantOrAlternate}) => {
  return [
    isConstantOrAlternate('consequent'),
  ]
})

slice(modulePath, `isConstantOrAlternate('alternate')`, ({isConstantOrAlternate}) => {
  return [
    isConstantOrAlternate('alternate'),
  ]
})

slice(modulePath, `isConstantOrAlternate('neither')`, ({isConstantOrAlternate}) => {
  return [
    isConstantOrAlternate('neither'),
  ]
})

slice(modulePath, `isConstantOrAlternate('consequent') && isConstantOrAlternate('alternate')`, ({isConstantOrAlternate}) => {
  return [
    isConstantOrAlternate('consequent'),
    isConstantOrAlternate('alternate'),
  ]
})

slice(modulePath, `isConstantOrAlternate('consequent') && isConstantOrAlternate('alternate') && isConstantOrAlternate('neither')`, ({isConstantOrAlternate}) => {
  return [
    isConstantOrAlternate('consequent'),
    isConstantOrAlternate('alternate'),
    isConstantOrAlternate('neither'),
  ]
})
