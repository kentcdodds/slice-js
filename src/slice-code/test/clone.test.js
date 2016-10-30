import {runAllCombosTests} from './helpers/utils'

// this is here to make it easy to isolate tests to a specific case
// fit(
//   'testing uncoveredConditionalExpression(false)',
//   require('./helpers/utils').snapSlice(require.resolve('./fixtures/cond-expr'), ({uncoveredConditionalExpression}) => {
//     uncoveredConditionalExpression(false)
//   })
// )

runAllCombosTests({
  filename: require.resolve('./fixtures/clone'),
  methods: [
    {
      useDefaultExport: true,
      methodName: 'clone',
      possibleArguments: [
        ['hello'],
        [null],
        [{name: 'Luke'}],
        [{friends: [{name: 'Rebecca'}]}],
        [{title: 'How to Train Your Dragon', releaseDate: new Date(2010, 2, 26)}],
      ],
    },
  ],
})
