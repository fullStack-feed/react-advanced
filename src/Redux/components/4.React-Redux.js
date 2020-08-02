import React, { Component } from 'react';
import { connect } from '../react-redux';
import actions from '../store/actions/counter1';
/**
 * 所有用到Redux中状态的组件都要：
 * 
 * 1.引入仓库 
 * 2.都要订阅状态事件(刷新视图)和取消订阅（组件卸载时）
 * 3.都要获取仓库中的状态 映射为当前组件状态 （this.state = store.getState()） 
 * 4.都要绑定actions(bindActionCreators,使得组件内部方便执行actions)
 * 
 * 不同点
 * 1. 绑定的actions不一样（来自不同的action）
 * 
 * 2. 获取的子状态不一样 
 */
class Counter1 extends Component {
  render() {
    return (
      <div>
        <p>{this.props.name}:{this.props.number}</p>
        <button onClick={() => this.props.add1(5)}>+</button>
        <button onClick={() => this.props.thunkAdd(5)}>thunkAdd</button>
        <button onClick={() => this.props.promiseAdd(5)}>promiseAdd</button>
      </div>
    )
  }
}
//输入就是把仓库中的状态进行计算或者说过滤变成当前组件的属性
// 等同于？ this.props = state.counter1={number:0};
const mapStateToProps = state => state.counter1;//{number:0}
export default connect(
  mapStateToProps,
  actions //里面会进行自动绑定
)(Counter1);