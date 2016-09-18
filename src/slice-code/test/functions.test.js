import {curry} from 'lodash'
import {snapSlice} from './helpers/utils'

const functionsFilename = require.resolve('./fixtures/functions')
const snapFunctionsSlice = curry(snapSlice)(functionsFilename)

test(
  'sum',
  snapFunctionsSlice(({sum}) => sum(1, 2))
)

test(
  'subtract',
  snapFunctionsSlice(({subtract}) => subtract(1, 2))
)

test(
  'multiply',
  snapFunctionsSlice(({multiply}) => multiply(1, 2))
)

test(
  'divide',
  snapFunctionsSlice(({divide}) => divide(1, 2))
)
