import {runAllCombosTests} from './helpers/utils'

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
  filename: require.resolve('./fixtures/assignment-expressions'),
  methods: [
    {
      methodName: 'plusEqual',
      explicitArgs: [[15, 5]],
    },
    {
      methodName: 'minusEqual',
      explicitArgs: [[15, 5]],
    },
    {
      methodName: 'divideEqual',
      explicitArgs: [[15, 5]],
    },
    {
      methodName: 'multiplyEqual',
      explicitArgs: [[15, 5]],
    },
  ],
})
