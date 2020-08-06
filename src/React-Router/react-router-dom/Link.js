import React, { Component } from 'react';
import Context from './context';
export default class Link extends Component {
    static contextType = Context;
    /**
     * - 需要获取当前history.push方法
     * - 监听onClick事件
     * - 将props中的to 传递给history.push 进行路由跳转     
     */
    render() {
        return (
            <a {...this.props} 
            onClick={() => this.context.history.push(this.props.to)}
            >
              {this.props.children}
            </a>
        )
    }
}