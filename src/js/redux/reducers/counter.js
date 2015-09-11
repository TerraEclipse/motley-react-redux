import {
  COUNTER_INCREMENT,
  COUNTER_DECREMENT
} from '../types'

const initialState = {
  count: 0
}

const reducers = {

  [COUNTER_INCREMENT]: (state, action) => {
    return {...state, count: ++state.count}
  },

  [COUNTER_DECREMENT]: (state, {err}) => {
    return {...state, count: --state.count}
  }
}

export default function (state = initialState, action) {
  if (reducers[action.type]) {
    return reducers[action.type](state, action)
  }
  return state
}
