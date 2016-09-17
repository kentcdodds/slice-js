import _ from 'lodash'
import indent from 'indent-string'
import sliceCode from './slice-code'

export default sliceTest

function sliceTest(filename, name, testCb) {
  testCb()
  const testCoverage = global.__coverage__[filename]
  const filteredCoverage = filterToRunStatementsFunctionsAndBranches(testCoverage)
  const slicedCode = sliceCode(filteredCoverage)
  console.log( // eslint-disable-line no-console
    `${relativeizePath(filename)}: ${name}\n${indent(slicedCode, 4)}`
  )
  // reset the module so it will be reinstrumented for coverage for the next test.
  delete require.cache[filename]
}

function filterToRunStatementsFunctionsAndBranches(coverageData) {
  const clone = _.cloneDeep(coverageData)
  clone.s = filterToRunCodeOnly(clone.s)
  clone.f = filterToRunCodeOnly(clone.f)
  clone.b = filterToRunCodeOnly(clone.b)
  clone.statementMap = filterMapToRunOnly(clone.statementMap, clone.s)
  clone.fnMap = filterMapToRunOnly(clone.fnMap, clone.f)
  clone.branchMap = filterMapToRunOnly(clone.branchMap, clone.b)
  clone.branchMap = annotateBranches(clone.branchMap, clone.b)
  return clone
}

function filterToRunCodeOnly(obj) {
  return _.reduce(obj, (newObj, val, key) => {
    if (isRunBranch(val) || (_.isNumber(val) && val !== 0)) {
      newObj[key] = val
    }
    return newObj
  }, {})
}

function isRunBranch(val) {
  return Array.isArray(val) && val.some(i => !!i)
}

function filterMapToRunOnly(map, indexesRun) {
  return Object.keys(indexesRun).reduce((newObj, indexRun) => {
    newObj[indexRun] = map[indexRun]
    return newObj
  }, {})
}

function annotateBranches(branchMap, branchesRun) {
  const clone = _.cloneDeep(branchMap)
  _.forEach(clone, (branch, key) => {
    const run = branchesRun[key]
    const [conLoc, altLoc] = branch.locations
    branch.consequent = {covered: run[0] > 0, loc: conLoc}
    branch.alternate = {covered: run[1] > 0, loc: altLoc}
  })
  return clone
}

function relativeizePath(absolutePath) {
  return absolutePath.replace(process.cwd(), '.')
}
