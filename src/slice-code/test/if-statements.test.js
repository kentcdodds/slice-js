import {runAllCombosTests, snapSlice} from './helpers/utils'

// TODO This is broken
xit(
  'test case',
  snapSlice(require.resolve('./fixtures/if-statements'), ({ifElseIfElse}) => {
    ifElseIfElse(true, true)
    ifElseIfElse(true, false)
    ifElseIfElse(false, false)
  })
)

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
