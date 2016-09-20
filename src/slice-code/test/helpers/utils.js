/* istanbul ignore next */
import fs from 'fs'
import Module from 'module'
import path from 'path'
import combs from 'combs'
import * as babel from 'babel-core'
import {programVisitor as getInstrumentVisitor} from 'istanbul-lib-instrument'
import {random} from 'lodash'
import sliceCode from '../..'

const coverageVariable = '____sliceCoverage____'

export {snapSlice, runAllCombosTests}

function snapSlice(relativePath, tester) {
  // the function returned here is what you'd place in a call to Jest's `test` function
  return () => {
    const absolutePath = require.resolve(relativePath)
    const sourceCode = fs.readFileSync(absolutePath, 'utf8')
    const tempFilename = `./temp.${random(1, 9999999999999)}.js`
    const mod = getInstrumentedModuleFromString(tempFilename, sourceCode)
    const originalResult = tester(mod)
    const slicedCode = sliceCode(sourceCode, global[coverageVariable][tempFilename])
    expect(slicedCode).toMatchSnapshot()
    const {is100, slicedResult} = slicedCoverageIs100(relativePath, slicedCode, tester)
    expect(is100).toBe(true)
    expect(originalResult).toEqual(slicedResult)
    delete global[coverageVariable][tempFilename]
    // delete require.cache[absolutePath]
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
      let test = global.test
      if (!test) {
        test = (title, fn) => fn()
      }
      test(testTitle, snapSlice(filename, mod => {
        const method = mod[methodName]
        return comboOfArgs.map(args => method(...args))
      }))
    })
  })
}

function slicedCoverageIs100(filename, slicedCode, tester) {
  const mod = getInstrumentedModuleFromString(filename, slicedCode)
  const slicedResult = tester(mod)
  const is100 = coverageIs100Percent(mod[coverageVariable]) // just in case :)
  return {slicedResult, is100}

  function coverageIs100Percent(coverageData) {
    const cov = coverageData[filename]
    const functions100 = Object.keys(cov.f).every(k => cov.f[k] > 0)
    const statements100 = Object.keys(cov.s).every(k => cov.s[k] > 0)
    const branches100 = Object.keys(cov.b).every(k => cov.b[k][0] > 0 && cov.b[k][1] > 0)
    return functions100 && statements100 && branches100
  }
}

function getInstrumentedModuleFromString(filename, sourceCode) {
  const {code} = babel.transform(sourceCode, {
    filename,
    babelrc: false,
    compact: false,
    only: filename,
    presets: ['node6', 'stage-2'],
    plugins: [
      instrumenter,
    ],
  })
  return requireFromString(filename, code)
}

/*
 * copied and modified from require-from-string
 */
function requireFromString(filename, code) {
  const m = new Module(filename, module.parent)
  m.filename = filename
  m.paths = Module._nodeModulePaths(path.dirname(filename))
  m._compile(code, filename)
  console.log(code)
  return m.exports
}

function instrumenter({types: t}) {
  return {
    visitor: {
      Program: {
        enter(...args) {
          this.__dv__ = getInstrumentVisitor(t, this.file.opts.filename, {
            coverageVariable,
          })
          this.__dv__.enter(...args)
        },
        exit(...args) {
          this.__dv__.exit(...args)
        },
      },
    },
  }
}
