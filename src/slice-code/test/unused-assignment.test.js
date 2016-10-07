import {runAllCombosTests, comboOfItems, comboOfBools} from './helpers/utils'

// test.only(
//   'sortRankedItems',
//   require('./helpers/utils').snapSlice(require.resolve('./fixtures/unused-assignment'), ({sortRankedItems}) => {
//     return [
//       sortRankedItems({rank: 2, index: 4, keyIndex: 6}, {rank: 3, index: 2, keyIndex: 7}),
//     ]
//   })
// )

const boolsInArrays = comboOfBools(2).map(([first, second]) => [[first], [second]])

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
  ],
})
