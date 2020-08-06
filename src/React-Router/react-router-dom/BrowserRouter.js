import React, { Component } from 'react';
import Context from './context';
export default class HashRouter extends Component {
    state = {
        location: {
            pathname: document.location.pathname,
            state: undefined
        }
    }
    componentDidMount() {
        window.onpopstate = (event) => {
            this.setState({
                location: {
                    ...this.state.location,
                    pathname: document.location.pathname,
                    state: event.state
                }
            });
        }
        window.onpushstate = ({ state, pathname }) => {
            this.setState({
                location: {
                    ...this.state.location,
                    pathname,
                    state
                }
            });
        }
    }
    render() {
        let value = {
            location: this.state.location,
            history: {
                location: this.state.location,
                push: (to) => {
                    if (typeof to === 'object') {
                        let { pathname, state } = to;
                        window.history.pushState(state, '', pathname);
                    } else {
                        window.history.pushState('', '', to);
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