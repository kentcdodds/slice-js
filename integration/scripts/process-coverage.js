/* eslint no-console:0 */
import fs from 'fs'
import {oneLine} from 'common-tags'
import {SnapshotState} from 'jest-snapshot'
import {sliceCodeAndGetInfo} from '../../src/slice-code'

const allCoverage = require('../coverage/coverage-final.json')

Object.keys(allCoverage)
  .map(filepath => {
    const source = fs.readFileSync(filepath, 'utf8')
    const fileCoverage = allCoverage[filepath]
    const sliceInfo = sliceCodeAndGetInfo(source, fileCoverage)
    if (sliceInfo.error) {
      console.info(
        `${filepath} failed to slice:\n${sliceInfo.error.message}\n\n`,
      )
      console.info(
        oneLine(String.raw)`
          Here's the filtered coverage:
          \n\n${JSON.stringify(sliceInfo.filteredCoverage)}\n\n
        `,
      )
      console.info(`Here's the source:\n\n${source}\n\n`)
      // ignore...
    }
    return {filepath, source, slice: sliceInfo.slice}
  })
  .filter(({slice}) => !!slice)
  .forEach(({filepath, slice}) => {
    const update = false
    const sliceshotsPath = filepath.replace(
      'node_modules',
      '__tests__/__sliceshots__',
    )
    const snapshotPath = `${sliceshotsPath}.slice`
    const expand = false
    const state = new SnapshotState(filepath, update, snapshotPath, expand)
    state.update = true
    const matchResult = state.match(filepath, slice, filepath)
    const saveResult = state.save(true)
    console.log({matchResult, saveResult})
  })
