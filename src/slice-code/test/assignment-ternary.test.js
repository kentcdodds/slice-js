import {runAllCombosTests} from './helpers/utils'

// fit(
//   'orAndOr(false, false, true, true)',
//   require('./helpers/utils').snapSlice(require.resolve('./fixtures/logical-expressions'), ({orAndOr}) => {
//     return [orAndOr(false, false, true, true)]
//   })
// )

runAllCombosTests({
  filename: require.resolve('./fixtures/assignment-ternary'),
  methods: [
    {
      methodName: 'assignmentTernary',
      possibleArguments: [
        ['a'], ['b'],
      ],
    },
    {
      methodName: 'diacriticsClean',
      possibleArguments: [
        ['Some apple'], ['Some Google'],
      ],
    },
  ],
})
