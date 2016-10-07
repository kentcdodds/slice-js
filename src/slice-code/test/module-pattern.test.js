import {snapSlice} from './helpers/utils'

const tests = [
  ({default: mod}) => [mod.foo()],
  ({default: mod}) => [mod.foo(), mod.baz(false)],
  ({default: mod}) => [mod.foo(), mod.baz(true)],
  ({default: mod}) => [mod.baz(true)],
  ({default: mod}) => [mod.baz(false)],
  ({default: mod}) => [mod.baz(false)],
  ({default: mod}) => [mod.foobar()],
  ({default: mod}) => [mod.foobar(), mod.baz(false)],
  ({default: mod}) => [mod.foobar(), mod.foo()],
]

tests.forEach(tester => {
  test(
    tester.toString(),
    snapSlice(require.resolve('./fixtures/module-pattern'), tester)
  )
})
