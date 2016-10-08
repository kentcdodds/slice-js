import {runAllCombosTests} from './helpers/utils'

// test.only(
//   'switchWithFallThrough("purple")',
//   require('./helpers/utils').snapSlice(require.resolve('./fixtures/switch-statement'), ({switchWithFallThrough}) => {
//     return [switchWithFallThrough('purple')]
//   })
// )

runAllCombosTests({
  filename: require.resolve('./fixtures/switch-statement'),
  methods: [
    {
      methodName: 'switchWithFallThrough',
      possibleArguments: [
        ['green'], ['blue'], ['purple'],
        ['yellow'], ['orange'], ['red'],
      ],
    },
    {
      methodName: 'switchWithDefault',
      possibleArguments: [
        ['twix'], ['snickers'],
      ],
    },
  ],
})
