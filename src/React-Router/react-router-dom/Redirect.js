import React, { Component } from 'react';
import Context from './context';
/**
 * 相对简单，只是一个普通组件
 * 
 * 在组件挂载时执行history.push方法
 */
export default class extends Component {
    static contextType = Context;
    componentDidMount() {
        this.context.history.push(this.props.to);
    }
    render() {
        return null;
    }
}