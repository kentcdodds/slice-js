import {runAllCombosTests, comboOfBools} from './helpers/utils'
// import combs from 'combs'

// fit(
//   'ifElse(true)',
//   require('./helpers/utils').snapSlice(require.resolve('./fixtures/logical-expressions'), ({andOr}) => {
//     return andOr(true, true, true)
//   })
// )

runAllCombosTests({
  filename: require.resolve('./fixtures/logical-expressions'),
  methods: [
    {methodName: 'allAnd', explicitArgs: comboOfBools(3)},
    {methodName: 'allOr', explicitArgs: comboOfBools(3)},
    {methodName: 'andOr', explicitArgs: comboOfBools(3)},
    {methodName: 'orAndOr', explicitArgs: comboOfBools(4)},
    {methodName: 'andOrAnd', explicitArgs: comboOfBools(4)},
  ],
})
