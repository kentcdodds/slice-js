import {runAllCombosTests, comboOfBools} from './helpers/utils'

// this is here to make it easy to isolate tests to a specific case
/*
test.only(
  'testing uncoveredConditionalExpression(false)',
  require('./helpers/utils').snapSlice(
    require.resolve('./fixtures/cond-expr'),
    ({uncoveredConditionalExpression}) => {
      uncoveredConditionalExpression(false)
    },
  ),
)
/* */

runAllCombosTests({
  filename: require.resolve('./fixtures/cond-expr'),
  methods: [
    {
      methodName: 'isConsequentOrAlternate',
      possibleArguments: comboOfBools(1),
    },
    {
      methodName: 'isConsequentOrAlternatesConsequentOrAlternate',
      possibleArguments: comboOfBools(2),
    },
    {
      methodName: 'uncoveredConditionalExpression',
      possibleArguments: comboOfBools(1),
    },
  ],
})
