import * as types from '../types'

export function incrementCounter () {
  return {type: types.COUNTER_INCREMENT}
}

export function decrementCounter () {
  return {type: types.COUNTER_DECREMENT}
}
