import {runAllCombosTests, comboOfItems} from './helpers/utils'

// test.only(
//   'unusedAssignment({"index":0}, {"index":1}, {"index":2}) && unusedAssignment({"index":1}, {"index":0}, {"index":2})',
//   require('./helpers/utils').snapSlice(require.resolve('./fixtures/unused-assignment'), ({unusedAssignment}) => {
//     return [
//       unusedAssignment({index: 0}, {index: 1}, {index: 2}),
//       unusedAssignment({index: 1}, {index: 0}, {index: 2}),
//     ]
//   })
// )

runAllCombosTests({
  filename: require.resolve('./fixtures/unused-assignment'),
  methods: [
    {
      methodName: 'unusedAssignment',
      possibleArguments: comboOfItems([{index: 0}, {index: 1}, {index: 2}]),
    },
  ],
})
