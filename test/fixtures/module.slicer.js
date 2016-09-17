import slice from '../../src'
import * as module from './module'

// this is just here to make it so we can generate a coverage report with jest easily
if (global.test) {
  test('works', () => {})
}

slice(require.resolve('./module'), 'multiply multiplies numbers together', () => {
  module.multiply(3, 2)
})
