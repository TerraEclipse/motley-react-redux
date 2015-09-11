import createAppStore from './createAppStore'

const initialState = window.__INITIAL_STATE__
const store = createAppStore(initialState)

export default store
