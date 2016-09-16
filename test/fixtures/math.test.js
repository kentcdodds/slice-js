import assert from 'assert'
import slice from '../../src/test'
import * as math from './math'

slice(require.resolve('./math'), 'sum adds numbers together', () => {
  assert(math.sum(3, 4) === 7)
})
