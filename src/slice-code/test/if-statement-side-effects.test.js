import {runAllCombosTests, snapSlice} from './helpers/utils'

// fit(
//   'ifElse(true)',
//   snapSlice(require.resolve('./fixtures/if-statements'), ({ifElse}) => {
//     ifElse(true)
//   })
// )
// TODO: Fix these:
// - ifWithAssignment(true)
// - ifWithFunctionCall(true)


runAllCombosTests({
  filename: require.resolve('./fixtures/if-statement-side-effects'),
  methods: [
    {methodName: 'ifWithAssignment', possibleArguments: [[true], [false]]},
    {methodName: 'ifWithFunctionCall', possibleArguments: [[true], [false]]},
  ],
})
