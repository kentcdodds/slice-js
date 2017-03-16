import {runAllCombosTests} from './helpers/utils'

/*
test.only(
  'orAndOr(false, false, true, true)',
  require('./helpers/utils').snapSlice(
    require.resolve('./fixtures/logical-expressions'),
    ({orAndOr}) => {
      return [orAndOr(false, false, true, true)]
    },
  ),
)
/* */

runAllCombosTests({
  filename: require.resolve('match-sorter'),
  methods: [
    {
      useDefaultExport: true,
      methodName: 'matchSorter',
      explicitArgs: [[['hi', 'hey', 'hello', 'sup', 'yo'], 'y']],
    },
  ],
})
