import {curry} from 'lodash'
import {snapSlice} from './helpers/utils'

const branchesFilename = require.resolve('./fixtures/branches')
const snapFunctionsSlice = curry(snapSlice)(branchesFilename)

test(
  'ifOnly(true)',
  snapFunctionsSlice(({ifOnly}) => ifOnly(true))
)

test(
  'ifOnly(false)',
  snapFunctionsSlice(({ifOnly}) => ifOnly(false))
)

test(
  'ifElse(true)',
  snapFunctionsSlice(({ifElse}) => ifElse(true))
)

test(
  'ifElse(false)',
  snapFunctionsSlice(({ifElse}) => ifElse(false))
)

test(
  'ifElseIfElse(true, true)',
  snapFunctionsSlice(({ifElseIfElse}) => ifElseIfElse(true, true))
)

test(
  'ifElseIfElse(true, false)',
  snapFunctionsSlice(({ifElseIfElse}) => ifElseIfElse(true, false))
)

test(
  'ifElseIfElse(false, true)',
  snapFunctionsSlice(({ifElseIfElse}) => ifElseIfElse(false, true))
)

test(
  'ifElseIfElse(false, false)',
  snapFunctionsSlice(({ifElseIfElse}) => ifElseIfElse(false, false))
)
