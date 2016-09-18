import sliceCode from '../..'

export {snapSlice} // eslint-disable-line import/prefer-default-export

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
