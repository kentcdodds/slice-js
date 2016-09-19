import {runAllCombosTests, snapSlice} from './helpers/utils'

// TODO: Fix these:
// - ifWithAssignment(true)
// - ifWithFunctionCall(true)
// fit(
//   'ifWithAssignment(false)',
//   snapSlice(require.resolve('./fixtures/if-statement-side-effects'), ({ifWithAssignment}) => {
//     ifWithAssignment(false)
//   })
// )


runAllCombosTests({
  filename: require.resolve('./fixtures/if-statement-side-effects'),
  methods: [
    {methodName: 'ifWithAssignment', possibleArguments: [[true], [false]]},
    {methodName: 'ifWithFunctionCall', possibleArguments: [[true], [false]]},
  ],
})
