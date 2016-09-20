import {snapSlice} from './helpers/utils'

test(
  'each([1, 2], (i, cb) => cb(), () => {})',
  snapSlice(require.resolve('async/dist/async'), ({each}) => {
    each([1, 2], (i, cb) => cb(), () => {})
  })
)
