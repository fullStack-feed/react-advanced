import React, { Component } from 'react';
import actions from '../store-模块化reducer/actions/counter1';
import { createStore, bindActionCreators } from 'redux';

function counterReducer(state, action) {
  switch (action.type) {
    case ADD:
      return { number: state.number + action.amount }
      break;
    case MINUS:
      return { number: state.number - action.amount }
    default:
      break;
  }
}
let store = createStore(counterReducer, { number: 0 });
// action 加持 store.dispatch 仅此而已。
let boundActions = bindActionCreators(actions, store.dispatch);
class Counter extends Component {
  constructor() {
    super(props)
    this.state = {
      number: store.getState().number
    }
  }
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => this.setState({ number: store.getState().number }))
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
