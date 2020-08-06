import React, { Component } from 'react';
import Context from './context';
export default class HashRouter extends Component {
    state = {
        location: {
            pathname: window.location.hash.slice(1) || '/',
            state: undefined
        }
    }
    componentDidMount() {
        window.addEventListener('hashchange', event => {
            this.setState({
                location: {
                    ...this.state.location,
                    state: this.locationState,
                    pathname: window.location.hash.slice(1) || '/'
                }
            });
        });
        window.location.hash = window.location.hash || '/';
    }
    render() {
        let value = {
            location: this.state.location,
            history: {
                location: this.state.location,
                /**
                 * 兼容 字符串 & 对象的使用方式
                 */
                push: (to) => {
                    if (typeof to === 'object') {
                        let { pathname, state } = to;
                        this.locationState = state;
                        window.location.hash = pathname;
                    } else {
                        window.location.hash = to;
                    }
                }
            }
        }
        return (
            <Context.Provider value={value}>
                {this.props.children}
            </Context.Provider>
        )
    }
}