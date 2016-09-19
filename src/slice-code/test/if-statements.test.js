import {runAllCombosTests} from './helpers/utils'

// fit(
//   'ifElse(true)',
//   require('./helpers/utils').snapSlice(require.resolve('./fixtures/if-statements'), ({ifElse}) => {
//     ifElse(true)
//   })
// )


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
