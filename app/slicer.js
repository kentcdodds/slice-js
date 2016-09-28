/* eslint-disable */ // fixme
import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import Codemirror from 'react-codemirror'
import 'codemirror/mode/javascript/javascript'

import {getSliceAndInfo} from '../dist/slice-code/test/helpers/utils'

const sampleCode = `
export {foo, bar}

function foo(passIf) {
  if (passIf) {
    return passIf
  } else {
    return !passIf
  }
}

function bar(throwError) {
  const ret = {}
  try {
    if (throwError) {
      throw new Error('throw error')
    }
    ret.noError = true
  } catch (error) {
    return error
  } finally {
    return ret
  }
}
`.trim()

const usageSample = `
function(mod) {
  return [
    mod.foo(true)
  ]
}
`.trim()

class App extends Component {
  state = {slicedCode: '', moduleUsage: usageSample, codeToSlice: sampleCode}

  componentDidMount() {
    this.updateSlice()
  }

  updateSlice = () => {
    const {codeToSlice, moduleUsage} = this.state
    const usageFn = getUsageFunction(moduleUsage)
    if (!usageFn) {
      return
    }
    const sliceInfo = getSliceAndInfo(
      codeToSlice,
      mod => {
        try {
          return usageFn(mod)
        } catch (e) {
          /* ignore */
        }
      },
    )
    this.setState({
      slicedCode: sliceInfo.slicedCode,
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
    const {slicedCode, codeToSlice, moduleUsage} = this.state
    const codemirrorOptions = {
      lineNumbers: true,
      mode: 'javascript',
    }
    return (
      <div>
        <h1>Enter stuff in here</h1>
        <div>
          <strong>Code to slice</strong>
          <br />
          <Codemirror
            value={codeToSlice}
            onChange={this.onCodeSliceChange}
            options={codemirrorOptions}
          />
        </div>
        <div>
          <strong>Usage</strong>
          <br />
          <Codemirror
            value={moduleUsage}
            onChange={this.onModuleUsageChange}
            options={codemirrorOptions}
          />
        </div>
        <div>
          <strong>Slice</strong>
          <br />
          <Codemirror
            value={slicedCode}
            onChange={this.onModuleUsageChange}
            options={{...codemirrorOptions, readOnly: true}}
          />
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
  try {
    return new Function(`return (${code.trim()})`)()
  } catch (error) {
    return undefined
  }
}
