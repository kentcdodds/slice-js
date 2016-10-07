import {runAllCombosTests, comboOfBools} from './helpers/utils'

// test.only(
//   'ifWithAssignment(true)',
//   require('./helpers/utils').snapSlice(require.resolve('./fixtures/if-statement-side-effects'), ({ifWithAssignment}) => {
//     return [
//       ifWithAssignment(true),
//     ]
//   })
// )


runAllCombosTests({
  filename: require.resolve('./fixtures/if-statement-side-effects'),
  methods: [
    {methodName: 'ifWithAssignment', possibleArguments: comboOfBools(1)},
    {methodName: 'ifWithFunctionCall', possibleArguments: comboOfBools(1)},
  ],
})
