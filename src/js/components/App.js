import React from 'react'
import {connect} from 'react-redux'
import Counter from './Counter'
import {
  incrementCounter,
  decrementCounter
} from '../redux/actions/counterActions'

@connect((state) => ({...state.counter}), {incrementCounter, decrementCounter})
class App extends React.Component {

  static propTypes = {
    count: React.PropTypes.number,
    incrementCounter: React.PropTypes.func,
    decrementCounter: React.PropTypes.func
  }

  render () {
    return (
      <div className='app'>
        <h1>React Redux Motley App!</h1>
        <Counter
          count={this.props.count}
          increment={this.props.incrementCounter}
          decrement={this.props.decrementCounter}
        />
      </div>
    )
  }

}

export default App
