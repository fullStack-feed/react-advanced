import React, { Component } from 'react';
import Context from './context';
import { pathToRegexp } from 'path-to-regexp';
//如果你给类增加了一个static contextType，this.context= Provider.value
export default class Route extends Component {
    static contextType = Context;
    render() {
        let location = this.context.location;
        let history = this.context.history;
        let pathname = location.pathname;
        let { path = "/", component: RouteComponent, exact = false, render, children } = this.props;
        let keys = [];
        let regexp = pathToRegexp(path, keys, { end: exact });
        let result = pathname.match(regexp);
        let props = {
            location,
            history,
        }
        if (result) {
            //处理match params
            let [url, ...values] = result;// 
            let paramNames = keys.map(item => item.name);
            let params = paramNames.reduce((acc, curr, index) => {
                acc[curr] = values[index];
                return acc;
            }, {});
            let match = {
                url,//匹配的URL地址 
                path,//匹配的路径
                isExact: pathname === url,//是否精确匹配
                params//匹配的路径参数对象
            }
            props.match = match;
            if (RouteComponent) {
                return <RouteComponent {...props} />
            } else if (render) {
                return render(props);
            } else if (children) {
                return children(props);
            } else {
                return null;
            }
        } else {
            if (children) {
                return children(props);
            } else {
                return null;
            }
        }
        return null;
    }
}