import fs from 'fs'
import * as babel from 'babel-core'

export default sliceCode

function sliceCode(filteredCoverage) {
  const {path: filename} = filteredCoverage
  const code = fs.readFileSync(filename, 'utf8')
  return babel.transform(code, {
    filename,
    babelrc: false,
    plugins: [
      getSliceCodeTransform(filteredCoverage),
    ],
  }).code
}

function getSliceCodeTransform(filteredCoverage) {
  return function sliceCodeTransform() {
    return {}
  }
}
