/* istanbul ignore next */
import Module from 'module'
import path from 'path'
import combs from 'combs'
import {uniqueId} from 'lodash'
import * as babel from 'babel-core'
// import requireFromString from 'require-from-string'
import sliceCode from '../..'

export {snapSlice, runAllCombosTests}

function snapSlice(relativePath, tester) {
  // the function returned here is what you'd place in a call to Jest's `test` function
  return () => {
    const absolutePath = require.resolve(relativePath)
    const mod = require(absolutePath) // eslint-disable-line global-require
    tester(mod)
    const slicedCode = sliceCode(global.__coverage__[absolutePath])
    expect(slicedCode).toMatchSnapshot()
    const is100 = slicedCoverageIs100(relativePath, slicedCode, tester)
    expect(is100).toBe(true)
    jest.resetModules()
    delete require.cache[absolutePath]
    delete global.__coverage__[absolutePath]
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
      test(testTitle, snapSlice(filename, mod => {
        const method = mod[methodName]
        comboOfArgs.forEach(args => {
          method(...args)
        })
      }))
    })
  })
}

function slicedCoverageIs100(filename, slicedCode, tester) {
  const {dir, name, ext} = path.parse(filename)
  const slicedFilename = path.join(dir, `${name}.sliced-${uniqueId()}${ext}`)
  const {code} = babel.transform(slicedCode, {
    filename: slicedFilename,
    babelrc: false,
    presets: ['node6', 'stage-2'],
    plugins: [
      'istanbul',
      exposeCoverageData,
    ],
  })
  const mod = requireFromString(code, slicedFilename)
  tester(mod)
  return coverageIs100Percent(mod.____coverage____) // just in case :)

  function coverageIs100Percent(coverageData) {
    const cov = coverageData[slicedFilename]
    const functions100 = Object.keys(cov.f).every(k => cov.f[k] > 0)
    const statements100 = Object.keys(cov.s).every(k => cov.s[k] > 0)
    const branches100 = Object.keys(cov.b).every(k => cov.b[k][0] > 0 && cov.b[k][0] > 0)
    return functions100 && statements100 && branches100
  }
}

function requireFromString(code, filename, opts) {
  if (typeof filename === 'object') {
    opts = filename
    filename = undefined
  }

  opts = opts || {}
  filename = filename || ''

  opts.appendPaths = opts.appendPaths || []
  opts.prependPaths = opts.prependPaths || []

  if (typeof code !== 'string') {
    throw new Error(`code must be a string, not ${typeof code}`)
  }

  const paths = Module._nodeModulePaths(path.dirname(filename))

  const m = new Module(filename, module.parent)
  m.filename = filename
  m.paths = [].concat(opts.prependPaths).concat(paths).concat(opts.appendPaths)
  m._compile(code, filename)

  return m.exports
}

function exposeCoverageData({types: t}) {
  return {
    visitor: {
      Program({node}) {
        const variableDeclarator = t.variableDeclarator(
          t.identifier('____coverage____'),
          t.memberExpression(
            t.identifier('global'),
            t.identifier('__coverage__')
          )
        )
        node.body.push(
          t.exportNamedDeclaration(
            t.variableDeclaration(
              'const', [variableDeclarator]
            ),
            []
          )
        )
      },
    },
  }
}
