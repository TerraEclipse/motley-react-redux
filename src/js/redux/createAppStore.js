import {createStore, applyMiddleware} from 'redux'
import reducers from './reducers'
import middleware from './middleware'

let finalCreateStore = applyMiddleware.apply(null, middleware)(createStore)

export default function createAppStore (initialState = {}) {
  return finalCreateStore(reducers, initialState)
}
