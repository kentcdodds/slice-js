import {runAllCombosTests, comboOfBools} from './helpers/utils'

// this is here to make it easy to isolate tests to a specific case
/*
test.only(
  'testing ifStatement(false)',
  require('./helpers/utils').snapSlice(
    require.resolve('./fixtures/early-exit'),
    ({ifStatement}) => {
      ifStatement(false)
    },
  ),
)
/* */

runAllCombosTests({
  filename: require.resolve('./fixtures/early-exit'),
  methods: [
    {methodName: 'ifStatement', possibleArguments: comboOfBools(1)},
    {methodName: 'condExpr', possibleArguments: comboOfBools(1)},
    {methodName: 'logicalExpr', possibleArguments: comboOfBools(1)},
  ],
})
