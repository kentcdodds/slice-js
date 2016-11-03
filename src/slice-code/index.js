/* eslint max-lines:[2, 1000] */ // I know it's nuts, but it's a lot easier to develop with ASTExplorer.net this way...
// for development, fork this: https://astexplorer.net/#/bk7MWWZZOR
// and log and copy/paste filteredCoverage and the plugin source
import * as babel from 'babel-core'
import deadCodeElimination from 'babel-plugin-minify-dead-code-elimination'
import customDeadCodeElimination from './babel-plugin-custom-dead-code-elimination'
import transformCoverage from './transform-coverage'
import getSliceCodeTransform from './get-sliced-code-transform'

export default sliceCode

function sliceCode(sourceCode, coverageData) {
  const {path: filename} = coverageData
  // console.log('coverageData', JSON.stringify(coverageData, null, 2))
  const filteredCoverage = transformCoverage(coverageData)
  // console.log('filteredCoverage', JSON.stringify(filteredCoverage, null, 2))
  // console.log('\n\n\n\nsourceCode\n', sourceCode)
  const {code: sliced} = babel.transform(sourceCode, {
    filename,
    babelrc: false,
    plugins: [
      getSliceCodeTransform(filteredCoverage),
    ],
  })
  // console.log('sliced', sliced)
  // TODO: perf - save time parsing by just transforming the AST from the previous run
  // This will probably significantly speed things up.
  // Unfortunately, when I tried the first time, I couldn't get it working :shrug:
  const {code: deadCodeEliminated} = babel.transform(sliced, {
    filename,
    babelrc: false,
    plugins: [
      deadCodeElimination,
    ],
  })
  // console.log('deadCodeEliminated', deadCodeEliminated)
  const {code: customDeadCodeElimiated} = babel.transform(deadCodeEliminated, {
    filename,
    babelrc: false,
    plugins: [
      customDeadCodeElimination,
    ],
  })
  // console.log('customDeadCodeElimiated', customDeadCodeElimiated)
  return customDeadCodeElimiated
}
