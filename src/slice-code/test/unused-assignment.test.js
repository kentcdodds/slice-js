import {runAllCombosTests, comboOfItems, comboOfBools} from './helpers/utils'

/*
test.only(
  'dependencies([false], [false]) && dependencies([false], [true])',
  require('./helpers/utils').snapSlice(
    require.resolve('./fixtures/unused-assignment'),
    ({dependencies}) => {
      return [dependencies([false], [false]), dependencies([false], [true])]
    },
  ),
)
/* */

const boolsInArrays = comboOfBools(2).map(([first, second]) => [
  [first],
  [second],
])

runAllCombosTests({
  filename: require.resolve('./fixtures/unused-assignment'),
  methods: [
    {
      methodName: 'unusedAssignment',
      possibleArguments: comboOfItems([{index: 0}, {index: 1}, {index: 2}]),
    },
    {
      methodName: 'dependencies',
      possibleArguments: boolsInArrays,
    },
    {
      methodName: 'sortRankedItems',
      possibleArguments: [[{rank: 1}, {rank: 1}], [{rank: 2}, {rank: 1}]],
    },
  ],
})
