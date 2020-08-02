import React, { Component } from 'react';
import { connect } from '../react-redux';
import actions from '../store/actions/counter1';
/**
 * 通常在组件使用原生Redux时需要做如下四件事儿：
 * 
 * - 引入store 
 * - 将需要的状态映射成组件内部的状态 （this.state = store.getState()） 
   - 当状态发生改变后，需要手动 订阅和取消订阅 一个“视图更新”函数，例如this.setState() 
 * - bindActionCreators,使得组件内部方便执行actions
 * 
 * 如下两点是有区别的：

 * - 绑定的actions不一样（来自不同的action）
 * 
 * - 映射的状态不同
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

// 通过connect函数会自动映射到组件的props中

const mapStateToProps = state => state.counter1;
export default connect(
  mapStateToProps,
  actions
)(Counter1);