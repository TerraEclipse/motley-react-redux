import React from 'react'

class Counter extends React.Component {

  static propTypes = {
    count: React.PropTypes.number.isRequired,
    increment: React.PropTypes.func.isRequired,
    decrement: React.PropTypes.func.isRequired
  }

  render () {
    return (
      <div className='counter'>
        <h2>{this.props.count}</h2>
        <p>
          <button onClick={() => this.props.increment()}>
            Up
          </button>
          <button onClick={() => this.props.decrement()}>
            Down
          </button>
        </p>
      </div>
    )
  }
}

export default Counter
