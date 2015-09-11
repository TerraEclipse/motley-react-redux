import logger from './logger'
import crashReporter from './crashReporter'
import promise from './promise'
import thunk from './thunk'

const middleware = [
  logger,
  crashReporter,
  promise,
  thunk
]

export default middleware
