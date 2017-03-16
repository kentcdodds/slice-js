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
  filename: require.resolve('indent-string'),
  methods: [
    {
      useDefaultExport: true,
      methodName: 'indentString',
      possibleArguments: [
        ['hello world'],
        ['hello world', 2],
        ['hello world', undefined, '@'],
        ['hello world', 4, '@'],
      ],
    },
  ],
})
