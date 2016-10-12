import {curry} from 'lodash'
import combs from 'combs'
import {snapSlice, runAllCombosTests} from './helpers/utils'

const functionsFilename = require.resolve('./fixtures/functions')
const snapFunctionsSlice = curry(snapSlice)(functionsFilename)

// this is here to make it easy to isolate tests to a specific case
// test.only(
//   'sum(1, 2)',
//   snapFunctionsSlice(({sum}) => {
//     return [sum(1, 2)]
//   })
// )


const methodCombos = combs(['sum', 'subtract', 'multiply', 'divide'])

methodCombos.forEach(methods => {
  test(
    methods.map(method => `${method}(1, 2)`).join(' && '),
    snapFunctionsSlice(module => {
      methods.forEach(method => {
        module[method](1, 2)
      })
    })
  )
})

runAllCombosTests({
  filename: functionsFilename,
  methods: [
    {methodName: 'sum', possibleArguments: [[1, 2]]},
    {methodName: 'subtract', possibleArguments: [[1, 2]]},
    {methodName: 'multiply', possibleArguments: [[1, 2]]},
    {methodName: 'divide', possibleArguments: [[1, 2]]},
  ],
})
