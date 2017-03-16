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
  filename: require.resolve('./fixtures/logical-expressions'),
  methods: [
    {methodName: 'allAnd', explicitArgs: comboOfBools(3)},
    {methodName: 'allOr', explicitArgs: comboOfBools(3)},
    {methodName: 'andOr', explicitArgs: comboOfBools(3)},
    {methodName: 'orAndOr', explicitArgs: comboOfBools(4)},
    {methodName: 'andOrAnd', explicitArgs: comboOfBools(4)},
  ],
})
