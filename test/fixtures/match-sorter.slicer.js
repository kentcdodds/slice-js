import slice from '../../src'

// this is just here to make it so we can generate a coverage report with jest easily
if (global.test) {
  test('works', () => {})
}

const modulePath = require.resolve('match-sorter')

slice(modulePath, 'basic use', matchSorter => {
  const list = ['hi', 'hey', 'hello', 'sup', 'yo']
  matchSorter(list, 'h')
})
