import {runAllCombosTests, snapSlice} from './helpers/utils'

// TODO This is broken
// fit(
//   'testing nestedIf(true, true)',
//   snapSlice(require.resolve('./fixtures/if-statements'), ({nestedIf}) => {
//     nestedIf(true, true)
//   })
// )
//

runAllCombosTests({
  filename: require.resolve('./fixtures/if-statements'),
  methods: [
    {methodName: 'ifOnly', possibleArguments: [[true], [false]]},
    {methodName: 'ifElse', possibleArguments: [[true], [false]]},
    {
      methodName: 'ifElseIfElse',
      possibleArguments: [
        [true, true], [true, false], [false, true], [false, false],
      ],
    },
    {
      methodName: 'nestedIf',
      possibleArguments: [
        [true, true], [true, false], [false, true], [false, false],
      ],
    },
  ],
})
