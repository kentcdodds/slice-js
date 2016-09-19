import indent from 'indent-string'
import sliceCode from './slice-code'

export default sliceTest

function sliceTest(filename, name, testCb) {
  testCb()
  const testCoverage = global.__coverage__[filename]
  const slicedCode = sliceCode(testCoverage)
  console.log( // eslint-disable-line no-console
    `${relativeizePath(filename)}: ${name}\n${indent(slicedCode, 4)}`
  )
  // reset the module so it will be reinstrumented for coverage for the next test.
  delete require.cache[filename]
}

function relativeizePath(absolutePath) {
  return absolutePath.replace(process.cwd(), '.')
}
