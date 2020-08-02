import React, { Component } from 'react';
import { createStore } from 'redux';
// action-types
const ADD = 'ADD';
const MINUS = 'MINUS';
// reducer
function counter(state, action) {
  switch (action.type) {
    case ADD:
      return { number: state.number + 1 }
      break;
    case MINUS:
      return { number: state.number - 1 }
    default:
      break;
  }
}
// store
let store = createStore(counter, { number: 0 });

class Counter extends Component {
  constructor() {
    super(props)
    this.state = {
      number: store.getState().number
    }
  }
  componentDidMount() {
    // 订阅函数，在Redux内部中，数据发生改变后要刷新这个函数
    this.unsubscribe = store.subscribe(() => this.setState({ number: store.getState().number }))
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    return (
      <div>
        {/* 
          修改store中的数据唯一方式：
          dispatch 一个 action
          action 就是一个type（必有） + payload（可无）
        */}
        <button onClick={() => store.dispatch({ type: 'ADD' })}></button>
        <button onClick={() => store.dispatch({ type: 'MINUS' })} ></button>
      </div>
    )
  }
}
