import {runAllCombosTests} from './helpers/utils'

/*
test.only(
  'tryCatch(false)',
  require('./helpers/utils').snapSlice(
    require.resolve('./fixtures/try-catch'),
    ({tryCatch}) => {
      return [tryCatch(false)]
    },
  ),
)
/* */

runAllCombosTests({
  filename: require.resolve('./fixtures/pizza'),
  methods: [
    {
      methodName: 'makePizza',
      possibleArguments: [[{type: 'cheese', size: 'Large'}]],
    },
  ],
})
