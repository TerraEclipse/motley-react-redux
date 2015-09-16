import {createStore, applyMiddleware} from 'redux'
import reducers from './reducers'
import middleware from './middleware'

let finalCreateStore = applyMiddleware.apply(null, middleware)(createStore)
let store

export default function createAppStore (initialState = {}) {
  store = finalCreateStore(reducers, initialState)
  return store
}

// Enable Webpack hot module replacement for reducers.
// This only works client-side so the module-scoped store copy is OK.
if (module.hot) {
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers/index')
    store.replaceReducer(nextRootReducer)
  })
}