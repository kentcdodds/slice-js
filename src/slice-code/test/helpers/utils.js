/* istanbul ignore next */
import fs from 'fs'
import Module from 'module'
import path from 'path'
import combs from 'combs'
import * as babel from 'babel-core'
import {programVisitor as getInstrumentVisitor} from 'istanbul-lib-instrument'
import {random} from 'lodash'
import template from 'babel-template'
import sliceCode from '../..'

const coverageVariable = '____sliceCoverage____'

export {comboOfBools, comboOfItems, snapSlice, runAllCombosTests, snapSliceCode, getSliceAndInfo}

function comboOfBools(n) {
  const len = (Math.pow(2, n) - 1).toString(2).length
  const result = []
  for (let i = 0; i < Math.pow(2, n); i++) {
    const val = i.toString(2)
    const missing = len - val.length
    result.push(
      Array.from({length: missing}).map(() => false).concat(
        Array.from(val).map(v => v === '1')
      )
    )
  }
  return result
}

/**
 * @param  {Array} items the items to get combinations for
 * @return {Array} an array of arrays of the possible combination of those items
 */
function comboOfItems(items) {
  if (items.length < 2) {
    return [items]
  }
  const combos = []
  items.forEach((item, index) => {
    const firstHalf = items.slice(0, index)
    const secondHalf = items.slice(index + 1)
    const remainingCombos = comboOfItems([
      ...firstHalf,
      ...secondHalf,
    ])
    remainingCombos.forEach(combo => {
      combos.push([
        item,
        ...combo,
      ])
    })
  })
  return combos
}

function snapSlice(relativePath, tester) {
  const absolutePath = require.resolve(relativePath)
  const sourceCode = fs.readFileSync(absolutePath, 'utf8')
  return snapSliceCode(sourceCode, tester, absolutePath)
}

function snapSliceCode(sourceCode, tester, actualFilepath) {
  // the function returned here is what you'd place in a call to Jest's `test` function
  return async () => {
    const {originalResult, slicedCode, isSlicedCoverage100, slicedResult} = await getSliceAndInfo(sourceCode, tester, actualFilepath)
    expect(slicedCode).toMatchSnapshot()
    expect(isSlicedCoverage100).toBe(true, 'coverage should be 100%')
    expect(originalResult).toEqual(slicedResult, 'originalResult should be the same as the slicedResult')
  }
}

async function getSliceAndInfo(sourceCode, tester, actualFilepath) {
  const tempFilename = `./temp-sliced.${random(1, 9999999999999)}.js`
  const mod = getInstrumentedModuleFromString(tempFilename, sourceCode, actualFilepath)
  const originalResult = await tester(mod)
  // console.log('originalResult', originalResult)
  const slicedCode = sliceCode(sourceCode, mod[coverageVariable][tempFilename])
  // console.log('slicedCode', slicedCode)
  const {is100: isSlicedCoverage100, slicedResult} = await slicedCoverageIs100(tempFilename, slicedCode, tester, actualFilepath)
  return {mod, originalResult, slicedCode, isSlicedCoverage100, slicedResult}
}

function runAllCombosTests({filename, methods}) {
  methods.forEach(({methodName, useDefaultExport, possibleArguments, explicitArgs}) => {
    if (explicitArgs) {
      explicitArgs.forEach(args => {
        const title = `${methodName}(${args.map(a => JSON.stringify(a)).join(', ')})`
        test(title, snapSlice(filename, mod => {
          const method = useDefaultExport ? mod : mod[methodName]
          return method(...args)
        }))
      })
    } else {
      const possibleCombinations = combs(possibleArguments)
      possibleCombinations.forEach(generateTests)
    }

    function generateTests(comboOfArgs) {
      // generate the message for the test title
      const testTitle = comboOfArgs.map(args => {
        return `${methodName}(${args.map(a => JSON.stringify(a)).join(', ')})`
      }).join(' && ')

      // this is the call to Jest's `test` function
      let test = global.test
      if (!test) {
        test = (title, fn) => fn()
      }
      test(testTitle, snapSlice(filename, mod => {
        const method = useDefaultExport ? (mod.default || mod) : mod[methodName]
        // console.log(useDefaultExport, methodName, Object.keys(mod), typeof method)
        return comboOfArgs.map(args => method(...args))
      }))
    }
  })
}

async function slicedCoverageIs100(filename, slicedCode, tester, actualFilepath) {
  const mod = getInstrumentedModuleFromString(filename, slicedCode, actualFilepath)
  const slicedResult = await tester(mod)
  // process.stdout.write('\n\nmod[coverageVariable][filename].s\n\n' + JSON.stringify(mod[coverageVariable][filename].s, null, 2))
  const is100 = coverageIs100Percent(mod[coverageVariable])
  return {slicedResult, is100}

  function coverageIs100Percent(coverageData) {
    const cov = coverageData[filename]
    const functions100 = Object.keys(cov.f).every(k => cov.f[k] > 0)
    const statements100 = Object.keys(cov.s).every(k => cov.s[k] > 0)
    const branches100 = Object.keys(cov.b).every(k => cov.b[k][0] > 0 && cov.b[k][1] > 0)
    return functions100 && statements100 && branches100
  }
}

function getInstrumentedModuleFromString(filename, sourceCode, actualFilepath) {
  // for the original source, we don't want to ignore anything
  // but there are some cases where we have to create empty functions that aren't covered
  // to ensure that the resulting code functions properly. So we add an obnoxiously long comment
  // and replace it here.
  const sourceCodeWithoutIstanbulPragma = sourceCode
    .replace(/istanbul/g, 'ignore-istanbul-ignore')
    .replace(/slice-js-coverage-ignore/g, 'istanbul')
  const {code} = babel.transform(sourceCodeWithoutIstanbulPragma, {
    filename,
    babelrc: false,
    // compact: false,
    only: filename,
    presets: ['node6', 'stage-2'],
    plugins: [
      instrumenter,
    ],
  })
  // process.stdout.write('\n\ninstrumentedCode\n\n' + code)
  return requireFromString(filename, code, actualFilepath)
}

/*
 * copied and modified from require-from-string
 */
function requireFromString(filename, code, actualFilepath) {
  const m = new Module(filename, module.parent)
  m.filename = filename
  m.paths = Module._nodeModulePaths(path.dirname(actualFilepath || filename))
  m._compile(code, filename)
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
          // expose coverage as part of the module
          const newNode = template(
            `module.exports.${coverageVariable} = global.${coverageVariable};`
          )()
          args[0].node.body.push(newNode)
        },
      },
    },
  }
}
