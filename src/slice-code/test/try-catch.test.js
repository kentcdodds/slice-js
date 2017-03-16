import {runAllCombosTests, comboOfBools} from './helpers/utils'

/*
test.only(
  'tryCatch(false)',
  require('./helpers/utils').snapSlice(
    require.resolve('./fixtures/try-catch'),
    ({tryCatch}) => {
      return [tryCatch(false)]
    },
  ),
)
/* */

runAllCombosTests({
  filename: require.resolve('./fixtures/try-catch'),
  methods: [
    {methodName: 'tryCatch', possibleArguments: comboOfBools(1)},
    {methodName: 'statementsAfterThrow', explicitArgs: [[]]},
  ],
})
