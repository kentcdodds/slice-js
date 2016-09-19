import {runAllCombosTests, snapSlice} from './helpers/utils'

// fit(
//   'testing uncoveredConditionalExpression(false)',
//   snapSlice(require.resolve('./fixtures/cond-expr'), ({uncoveredConditionalExpression}) => {
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
