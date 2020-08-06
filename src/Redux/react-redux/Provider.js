import React from 'react'
import Context from './context'

/**
 * - Context 作为 provider
 * - 渲染子组件
 * 
 * 
 */
// TODO: HOC???
export default class extends React.Component {
  render() {
    return (
      <Context.Provider value = {{store: this.props.store}}>
        {/* 插槽：子组件 */}
        {this.props.children}
      </Context.Provider>
    )
  }
}