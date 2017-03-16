import {runAllCombosTests} from './helpers/utils'

/*
test.only(
  'switchWithSideEffects({"name":"harry"})',
  require('./helpers/utils').snapSlice(
    require.resolve('./fixtures/switch-statement'),
    ({switchWithSideEffects}) => {
      return [switchWithSideEffects({name: 'harry'})]
    },
  ),
)
/* */

runAllCombosTests({
  filename: require.resolve('./fixtures/switch-statement'),
  methods: [
    {
      methodName: 'switchWithFallThrough',
      possibleArguments: [
        ['green'],
        ['blue'],
        ['purple'],
        ['yellow'],
        ['orange'],
        ['red'],
      ],
    },
    {
      methodName: 'switchWithDefault',
      possibleArguments: [['twix'], ['snickers']],
    },
    {
      methodName: 'switchWithSideEffects',
      possibleArguments: [[{name: 'harry'}], [{name: 'ron'}]],
    },
  ],
})
