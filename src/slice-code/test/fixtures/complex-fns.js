export {unusedReturnAssign, get}

function unusedReturnAssign() {
  const foo = {}
  function bar(msg) {
    return function() {
      return `bar: ${msg}`
    }
  }
  foo.getLuke = bar('luke')
  foo.getLuke.characterName = 'luke'

  foo.getHan = bar('han')
  foo.getHan.characterName = 'han'

  foo.getSomethingElse = function() {
    return 'something else'
  }

  return foo
}

function get(name) {
  return unusedReturnAssign()[`get${name}`]()
}
