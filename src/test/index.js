import _ from 'lodash'
import sliceCode from './slice-code'

export default sliceTest

function sliceTest(filename, name, testCb) {
  testCb()
  const testCoverage = global.__coverage__[filename]
  const filteredCoverage = filterToRunStatementsFunctionsAndBranches(testCoverage)
  const slicedCode = sliceCode(filteredCoverage)
  console.log(JSON.stringify(filteredCoverage, null, 2))
  console.log(slicedCode)
}

function filterToRunStatementsFunctionsAndBranches(coverageData) {
  const clone = _.cloneDeep(coverageData)
  clone.s = filterToRunCodeOnly(clone.s)
  clone.f = filterToRunCodeOnly(clone.f)
  clone.b = filterToRunCodeOnly(clone.b)
  clone.statementMap = filterMapToRunOnly(clone.statementMap, clone.s)
  clone.fnMap = filterMapToRunOnly(clone.fnMap, clone.f)
  clone.branchMap = filterMapToRunOnly(clone.branchMap, clone.b)
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
