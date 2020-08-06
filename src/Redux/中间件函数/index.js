import { createElement } from "react";
import { compose } from "../redux/compose";

const { applyMiddleware, createStore } = require("../redux");

const looger = ({getState}) => next => action => {
  // 此处即使增强后的dispatch方法
  console.log('改变前的状态:',getState());
  next(action);
  console.log('改变后的状态:',getState());
}
const thunk = ( {getState,dispatch} ) => next => action => {
  /**
   * 通常 thunk函数在内部会做一些额外逻辑后，在内部会手动调用dispatch(action);
   * 因此只需要将getState dispatch 传递给thunk函数即可
   */
  if(typeof action === 'function') {
    action({getState,dispatch})
  }
  // 否则的话直接调用next
  next(action);
}
const promise = ({dispatch}) => next => action => {
  // 支持action中拥有then函数
  if(action.then && typeof action.then === 'function') {
    action.then(action => dispatch(action))
  }
  next(action);
}
