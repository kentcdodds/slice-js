import {snapSlice} from './helpers/utils'

const tests = [
  is => [is.sameType(32, '32')],
  is => [is.sameType(NaN, 32)],
  is => [is.sameType('hi', 'hey')],
]

tests.forEach(tester => {
  test(
    tester.toString(),
    snapSlice(require.resolve('is_js'), tester)
  )
})
