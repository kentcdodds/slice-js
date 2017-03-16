import * as babel from 'babel-core'
import recast from 'recast'
import deadCodeElimination from 'babel-plugin-minify-dead-code-elimination'
import customDeadCodeElimination
  from './babel-plugin-custom-dead-code-elimination'
import transformCoverage from './transform-coverage'
import getSliceCodeTransform from './get-sliced-code-transform'

export {sliceCodeAndGetInfo, sliceCode as default}

function sliceCode(sourceCode, coverageData) {
  // console.log('coverageData', JSON.stringify(coverageData, null, 2))
  const filteredCoverage = transformCoverage(coverageData)
  // console.log('filteredCoverage', JSON.stringify(filteredCoverage, null, 2))
  // console.log('\n\n\n\nsourceCode\n', sourceCode)
  return sliceCodeFromFilteredCoverage(sourceCode, filteredCoverage)
}

function sliceCodeAndGetInfo(sourceCode, coverageData) {
  // console.log('coverageData', JSON.stringify(coverageData, null, 2))
  const filteredCoverage = transformCoverage(coverageData)
  // console.log('filteredCoverage', JSON.stringify(filteredCoverage, null, 2))
  // console.log('\n\n\n\nsourceCode\n', sourceCode)
  let slice, error
  try {
    slice = sliceCodeFromFilteredCoverage(sourceCode, filteredCoverage)
  } catch (e) {
    error = e
  }
  return {slice, error, filteredCoverage}
}

function sliceCodeFromFilteredCoverage(sourceCode, filteredCoverage) {
  const {path: filename} = filteredCoverage
  const commonOptions = {
    filename,
    babelrc: false,
    parserOpts: {parser: recast.parse},
    generatorOpts: {generator: recast.print},
  }
  const {code: sliced} = babel.transform(sourceCode, {
    ...commonOptions,
    plugins: [getSliceCodeTransform(filteredCoverage)],
  })
  // console.log('sliced', sliced)
  // TODO: perf - save time parsing by just transforming the
  // AST from the previous run
  // This will probably significantly speed things up.
  // Unfortunately, when I tried the first time,
  // I couldn't get it working :shrug:
  const {code: deadCodeEliminated} = babel.transform(sliced, {
    ...commonOptions,
    plugins: [deadCodeElimination],
  })
  // console.log('deadCodeEliminated', deadCodeEliminated)
  const {code: customDeadCodeElimiated} = babel.transform(deadCodeEliminated, {
    ...commonOptions,
    plugins: [customDeadCodeElimination],
  })
  // console.log('customDeadCodeElimiated', customDeadCodeElimiated)
  return customDeadCodeElimiated
}
