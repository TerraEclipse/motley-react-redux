/**
 * Handle fatal errors caused actions.
 */
const crashReporter = store => next => action => {
  try {
    return next(action)
  } catch (err) {
    // Eventually manipulate the store such that we show a modal or something?
    throw err
  }
}

export default crashReporter
