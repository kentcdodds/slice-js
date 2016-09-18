import {curry} from 'lodash'
import {snapSlice} from './helpers/utils'

const branchesFilename = require.resolve('./fixtures/branches')
const snapBranchesSlice = curry(snapSlice)(branchesFilename)

test(
  'ifOnly(true)',
  snapBranchesSlice(({ifOnly}) => ifOnly(true))
)

test(
  'ifOnly(false)',
  snapBranchesSlice(({ifOnly}) => ifOnly(false))
)

test(
  'ifElse(true)',
  snapBranchesSlice(({ifElse}) => ifElse(true))
)

test(
  'ifElse(false)',
  snapBranchesSlice(({ifElse}) => ifElse(false))
)

test(
  'ifElseIfElse(true, true)',
  snapBranchesSlice(({ifElseIfElse}) => ifElseIfElse(true, true))
)

test(
  'ifElseIfElse(true, false)',
  snapBranchesSlice(({ifElseIfElse}) => ifElseIfElse(true, false))
)

test(
  'ifElseIfElse(false, true)',
  snapBranchesSlice(({ifElseIfElse}) => ifElseIfElse(false, true))
)

test(
  'ifElseIfElse(false, false)',
  snapBranchesSlice(({ifElseIfElse}) => ifElseIfElse(false, false))
)
