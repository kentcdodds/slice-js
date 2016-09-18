import {curry} from 'lodash'
import sliceCode from '.'

const functionsFilename = require.resolve('./test/fixtures/functions')
const snapFunctionsSlice = curry(snapSlice)(functionsFilename)

test(
  'sum',
  snapFunctionsSlice(({sum}) => sum(1, 2))
)

test(
  'subtract',
  snapFunctionsSlice(({subtract}) => subtract(1, 2))
)

test(
  'multiply',
  snapFunctionsSlice(({multiply}) => multiply(1, 2))
)

test(
  'divide',
  snapFunctionsSlice(({divide}) => divide(1, 2))
)

function snapSlice(relativePath, tester) {
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
