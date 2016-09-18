import {runAllCombosTests} from './helpers/utils'

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
