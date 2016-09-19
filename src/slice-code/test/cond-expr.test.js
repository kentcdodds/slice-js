import {runAllCombosTests} from './helpers/utils'

// this is here to make it easy to isolate tests to a specific case
// fit(
//   'testing uncoveredConditionalExpression(false)',
//   require('./helpers/utils').snapSlice(require.resolve('./fixtures/cond-expr'), ({uncoveredConditionalExpression}) => {
//     uncoveredConditionalExpression(false)
//   })
// )

runAllCombosTests({
  filename: require.resolve('./fixtures/cond-expr'),
  methods: [
    {
      methodName: 'isConsequentOrAlternate',
      possibleArguments: [[true], [false]],
    },
    {
      methodName: 'isConsequentOrAlternatesConsequentOrAlternate',
      possibleArguments: [
        [true, true], [true, false],
        [false, false], [false, true],
      ],
    },
    {
      methodName: 'uncoveredConditionalExpression',
      possibleArguments: [[true], [false]],
    },
  ],
})
