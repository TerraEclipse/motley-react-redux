import React from 'react'
import {Provider} from 'react-redux'
import App from './components/App'

export default function getRoot (store) {
  return (
    <Provider store={store}>
      {() => (
        <App/>
      )}
    </Provider>
  )
}
