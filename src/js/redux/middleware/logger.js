import _ from 'lodash'

/**
 * Logs all actions and states after they are dispatched.
 */
const logger = store => next => action => {
  if (window.localStorage.getItem('DEBUG') === 'enabled') {
    console.log('DISPATCHING', action)
    let result = next(action)
    console.log('NEXT STATE', _.mapValues(store.getState(), (val) => {
      if (typeof val.toJS === 'function') {
        return val.toJS()
      } else {
        return val
      }
    }))
    return result
  } else {
    return next(action)
  }
}

export default logger
