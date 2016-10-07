export default (() => {
  const mod = {}

  mod.foo = () => 'foo'

  mod.bar = 'bar'

  mod.baz = returnBaz => (returnBaz ? 'baz' : 'buzz')

  mod.foobar = function() {
    return 'function assignment'
  }

  return mod
})()
