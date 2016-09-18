/* istanbul ignore next */
import combs from 'combs'
import sliceCode from '../..'

export {snapSlice, runAllCombosTests}

function snapSlice(relativePath, tester) {
  // the function returned here is what you'd place in a call to Jest's `test` function
  return () => {
    const absolutePath = require.resolve(relativePath)
    const module = require(absolutePath) // eslint-disable-line global-require
    tester(module)
    const slicedCode = sliceCode(global.__coverage__[absolutePath])
    expect(slicedCode).toMatchSnapshot()
    jest.resetModules()
    delete require.cache[absolutePath]
    delete global.__coverage__[absolutePath]
  }
}

function runAllCombosTests({filename, methods}) {
  methods.forEach(({methodName, possibleArguments}) => {
    const possibleCombinations = combs(possibleArguments)

    possibleCombinations.forEach(comboOfArgs => {

      // generate the message for the test title
      const testTitle = comboOfArgs.map(args => {
        return `${methodName}(${args.join(', ')})`
      }).join(' && ')

      // this is the call to Jest's `test` function
      test(testTitle, snapSlice(filename, module => {
        const method = module[methodName]
        comboOfArgs.forEach(args => {
          method(...args)
        })
      }))
    })
  })
}
