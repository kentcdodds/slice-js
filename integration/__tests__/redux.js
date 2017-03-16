import {createStore} from '../n_modules/redux'

const reducer = (state = 0) => state++ // eslint-disable-line func-style
const store = createStore(reducer)
const unsub = store.subscribe(() => {})
store.dispatch({type: 'blah'})
unsub()
