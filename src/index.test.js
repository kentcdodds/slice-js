import path from 'path'
import spawn from 'spawn-command'
import glob from 'glob'

const BABEL_BIN_PATH = require.resolve('babel-cli/bin/babel-node')

const slicers = glob.sync(
  path.resolve(__dirname, '../test/fixtures/**/*.slicer.js'),
)

slicers.forEach(slicer => {
  test(relativeizePath(slicer), () => {
    return runBabelNode(slicer).then(stdout => {
      expect(stdout).toMatchSnapshot()
    })
  })
})

function runBabelNode(args = '', cwd = process.cwd()) {
  const isRelative = cwd[0] !== '/'
  if (isRelative) {
    cwd = path.resolve(__dirname, cwd)
  }

  return new Promise((resolve, reject) => {
    let stdout = ''
    let stderr = ''
    const command = `${BABEL_BIN_PATH} ${args}`
    const child = spawn(command, {cwd})

    child.on('error', error => {
      reject(error)
    })

    child.stdout.on('data', data => {
      stdout += data.toString()
    })

    child.stderr.on('data', data => {
      stderr += data.toString()
    })

    child.on('close', () => {
      if (stderr) {
        reject(stderr)
      } else {
        resolve(stdout)
      }
    })
  })
}

function relativeizePath(absolutePath) {
  return absolutePath.replace(process.cwd(), '.')
}
