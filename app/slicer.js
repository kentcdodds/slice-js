/* eslint no-invalid-this:0 */
import fs from 'fs'
import {isEqual} from 'lodash'
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Codemirror from 'react-codemirror'
import 'codemirror/mode/javascript/javascript'

import {getSliceAndInfo} from '../src/slice-code/test/helpers/utils'

const sampleCode = fs.readFileSync(require.resolve('../src/slice-code/test/fixtures/pizza.js'), 'utf-8')

const usageSample = `
function({makePizza}) {
  return [
    makePizza({
      type: 'cheese',
      size: 'Large',
    })
  ]
}
`.trim()

class App extends Component {
  state = {slicedCode: '', moduleUsage: usageSample, codeToSlice: sampleCode}

  componentDidMount() {
    this.updateSlice()
  }

  updateSlice = async () => {
    const {codeToSlice, moduleUsage} = this.state
    const usageFn = getUsageFunction(moduleUsage)
    if (!usageFn) {
      return
    }
    let success = false
    const sliceInfo = await getSliceAndInfo(
      codeToSlice,
      async mod => {
        try {
          const ret = await usageFn(mod)
          success = true
          return ret
        } catch (e) {
          return undefined
        }
      },
    )
    if (!success) {
      return
    }
    const {originalResult, slicedCode, slicedResult, isSlicedCoverage100} = sliceInfo
    this.setState({
      slicedCode,
      originalResult,
      slicedResult,
      isSlicedCoverage100,
    })
  }

  onCodeSliceChange = value => {
    this.setState({
      codeToSlice: value,
    }, this.updateSlice)
  }

  onModuleUsageChange = value => {
    this.setState({
      moduleUsage: value,
    }, this.updateSlice)
  }

  render() {
    const {originalResult, slicedCode, slicedResult, isSlicedCoverage100, codeToSlice, moduleUsage} = this.state
    const sameResult = isEqual(originalResult, slicedResult)
    const codemirrorOptions = {
      lineNumbers: true,
      mode: 'javascript',
    }
    const slicedStyles = {
      marginTop: 30,
      border: isSlicedCoverage100 && sameResult ? '' : 'solid 1px red',
    }
    return (
      <div style={{fontSize: '16px'}}>
        <h1 style={{textAlign: 'center'}}>🍕 SliceJS 🍕</h1>
        <div style={{display: 'flex'}} className="short">
          <div style={{width: '50%', paddingRight: 10}}>
            <strong>Code to slice</strong>
            <br />
            <Codemirror
              value={codeToSlice}
              onChange={this.onCodeSliceChange}
              options={codemirrorOptions}
            />
          </div>
          <div style={{width: '50%', paddingLeft: 10}}>
            <strong>Usage</strong>
            <br />
            <Codemirror
              value={moduleUsage}
              onChange={this.onModuleUsageChange}
              options={codemirrorOptions}
            />
          </div>
        </div>
        <div style={slicedStyles}>
          <strong>Slice</strong>
          <br />
          <Codemirror
            value={slicedCode}
            onChange={this.onModuleUsageChange}
            options={{...codemirrorOptions, readOnly: true}}
          />

          {isSlicedCoverage100 ? (
            <div style={{color: 'green'}}>
              Sliced coverage is 100%, we couldn't slice more...
              Although there may be optimizations we could make with regards to data allocation...
            </div>
          ) : (
            <div style={{color: 'red'}}>
              Sliced coverage is not 100%, we could slice more...
            </div>
          )}
          {sameResult ? (
            <div style={{color: 'green'}}>
              The returned from both the original module and the sliced version is the same.
              <br />
              <strong>Result:</strong>
              <pre>{JSON.stringify(originalResult, null, 2)}</pre>
            </div>
          ) : (
            <div style={{color: 'red'}}>
              The returned from both the original module and the sliced version is different!
              <br />
              <strong>Original Result:</strong>
              <pre>{JSON.stringify(originalResult, null, 2)}</pre>
              <strong>Slice Result:</strong>
              <pre>{JSON.stringify(slicedResult, null, 2)}</pre>
            </div>
          )}

        </div>
      </div>
    )
  }
}

const root = document.getElementById('root')
ReactDOM.render(
  <App />,
  root,
)

function getUsageFunction(code) {
  /* eslint no-new-func:0 */
  try {
    return new Function(`return (${code.trim()})`)()
  } catch (error) {
    return undefined
  }
}
