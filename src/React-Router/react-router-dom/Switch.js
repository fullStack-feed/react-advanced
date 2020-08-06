import React, { Component } from 'react';
import Context from './context';
import { pathToRegexp } from 'path-to-regexp';
export default class Switch extends Component {
    static contextType = Context;
    render() {
        let location = this.context.location;
        let pathname = location.pathname;
        if (!this.props.children) {
            return null;
        }
        /**
         * 循环子组件，匹配对应的路由
         * 
         * 将路由返回给History/BrowserRouter执行
         */
        for (let i = 0; i < this.props.children.length; i++) {
            let child = this.props.children[i];
            let { path = "/", component: RouteComponent, exact = false } = child.props;
            let regexp = pathToRegexp(path, [], { end: exact });
            let result = pathname.match(regexp);
            if (result) {
                return child;
            }
        }
    }
}