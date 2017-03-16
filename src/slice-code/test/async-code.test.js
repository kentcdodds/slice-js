import {runAllCombosTests, comboOfBools} from './helpers/utils'

/*
test.only(
  'orAndOr(false, false, true, true)',
  require('./helpers/utils').snapSlice(
    require.resolve('./fixtures/logical-expressions'),
    ({orAndOr}) => {
      return [orAndOr(false, false, true, true)]
    },
  ),
)
/* */

runAllCombosTests({
  filename: require.resolve('./fixtures/async-code'),
  methods: [
    {
      methodName: 'callPromise',
      possibleArguments: comboOfBools(1),
    },
    {
      methodName: 'callback',
      possibleArguments: comboOfBools(1),
    },
  ],
})
