import {runAllCombosTests, comboOfBools} from './helpers/utils'

/*
test.only(
  'ifElse(true)',
  require('./helpers/utils').snapSlice(
    require.resolve('./fixtures/if-statements'),
    ({ifElse}) => {
      ifElse(true)
    },
  ),
)
/* */

runAllCombosTests({
  filename: require.resolve('./fixtures/if-statements'),
  methods: [
    {methodName: 'ifOnly', possibleArguments: comboOfBools(1)},
    {methodName: 'ifElse', possibleArguments: comboOfBools(1)},
    {
      methodName: 'ifElseIfElse',
      possibleArguments: comboOfBools(2),
    },
    {
      methodName: 'nestedIf',
      possibleArguments: comboOfBools(2),
    },
  ],
})
