import React from 'react';
import Context from './context';
import { bindActionCreators } from '../redux';
/**
 * 
 * @param {*} mapStateToProps 可以把完整的状态对象映射为组件属性对象
 * @param {*} mapDispatchToProps  是一个对象，里面的属性是actionCreator,返回一个对象{}
 * 把dispatch映射为了一个属性对象
 */
export default function (mapStateToProps, mapDispatchToProps) {
  return function (OldComponent) {
    class Proxy extends React.Component {      
      static contextType = Context
      constructor(props, context) {
        super(props);        
        this.state = mapStateToProps(context.store.getState());
      }
      componentDidMount() {
        //每当仓库中的状态发生改变的时候，会执行此回调函数 
        this.unsubscribe = this.context.store.subscribe(() => {
          this.setState(mapStateToProps(this.context.store.getState()));
        });
      }
      componentWillUnmount() {
        this.unsubscribe();
      }
      render() {        
        let actions = bindActionCreators(
          mapDispatchToProps,
          this.context.store.dispatch);        
        return <OldComponent {...this.props} {...this.state}  {...actions} />
      }
    }

    // 通过向Proxy挂载静态属性即可实现在组件内部通过：
    // context
    Proxy.contextType = Context;
    return Proxy;
  }
}