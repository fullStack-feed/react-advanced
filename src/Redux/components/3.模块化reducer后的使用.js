import React, { Component } from 'react';
import actions from '../store-模块化reducer/actions/counter1';
import { bindActionCreators } from '../redux';
import store from '../store-模块化reducer'
let boundActions = bindActionCreators(actions, store.dispatch);
class Counter extends Component {
  constructor() {
    super(props)
    this.state = {
      // 这里需要取对应的state
      number: store.getState().counter1.number
    }
  }
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => this.setState({ number: store.getState().counter1.number }))
  }
  componentWillUnmount() {
    this.unsubscribe();
  }


  render() {
    return (
      <div>
        <button onClick={() => boundActions.add(1)}></button>
        <button onClick={() => boundActions.minus(2)} ></button>
      </div>
    )
  }
}
