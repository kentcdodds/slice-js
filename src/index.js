import fs from 'fs'
import indent from 'indent-string'
import {getSliceAndInfo} from './slice-code/test/helpers/utils'

export default sliceTest

async function sliceTest(filename, name, tester) {
  const sourceCode = fs.readFileSync(filename, 'utf8')
  const {slicedCode} = await getSliceAndInfo(sourceCode, tester, filename)
  console.log( // eslint-disable-line no-console
    `${relativeizePath(filename)}: ${name}\n${indent(slicedCode, 4)}`,
  )
}

function relativeizePath(absolutePath) {
  return absolutePath.replace(process.cwd(), '.')
}
