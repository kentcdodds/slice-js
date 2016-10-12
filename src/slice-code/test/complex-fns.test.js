import {runAllCombosTests} from './helpers/utils'

// test.only(
//   'get("SomethingElse")',
//   require('./helpers/utils').snapSlice(require.resolve('./fixtures/complex-fns'), ({get}) => {
//     return [get('SomethingElse')]
//   })
// )

runAllCombosTests({
  filename: require.resolve('./fixtures/complex-fns'),
  methods: [
    {
      methodName: 'get',
      possibleArguments: [
        ['Luke'], ['Han'],
      ],
    },
  ],
})
