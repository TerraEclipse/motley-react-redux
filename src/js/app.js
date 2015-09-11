require('babel/polyfill')

import React from 'react'
import store from './redux/store'
import getRoot from './getRoot'

React.render(getRoot(store), document.getElementById('root'))
