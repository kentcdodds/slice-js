import slice from '../../src/test'
import * as math from './math'

global.test = global.test || (() => {})

test('works', () => {})

slice(require.resolve('./math'), 'sum adds numbers together', () => {
  math.isFooOrBar('bars')
  math.isFooOrBar('bar')
  math.isFooOrBar('foo')
})
