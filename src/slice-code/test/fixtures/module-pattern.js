export default (() => {
  const mod = {}

  mod.foo = () => 'foo'

  mod.bar = 'bar'

  mod.baz = returnBaz => (returnBaz ? 'baz' : 'buzz')

  mod.foobar = function() {
    return 'function assignment'
  }

  mod.mokeypatchFn = function() {
    return '🐒'
  }
  mod.mokeypatchFn.favorite = 'my favorite animal is a 🐒'

  mod.monkeypatchArrow = () => {
    return '🐵'
  }
  mod.monkeypatchArrow.favorite = 'my favorite animal is a 🐵'

  return mod
})()
