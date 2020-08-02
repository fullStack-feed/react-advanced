/**
 * 创建Redux 仓库，以及提供一个对象，对象拥有：
 * - 获取仓库的store数据:getState()
 * - 修改store数据的唯一方式：dispatch()
 * - 预定状态发生改变后的回调函数:subscribe()
 * 
 * @param {*} reducer 和 reduce 什么关系来的？？？
 * @param {*} initialState 
 * @param {*} enhancer 
 */
export default function createStore(reducer, initialState, enhancer) {
  let _state = initialState || {};
  let listeners = [];

  /**
   * 我们要想让仓库创建的时候就得到初始状态，就需要在创建时先派发一个初始化的动作
   * 
      NOTE: 此时的state就会变为初始状态，可以打一个debugger 看一下子。  
   */
  dispatch({ type: '@@REDUX/INIT' });


  /**
   * 通过此方法可以获得仓库中的最新的状态
   * 
   * 简单来说就是 不能将state 直接暴露给外界，这样直接避免了被修改的可能性。
   * 
   * 有点类似：Object.defineProperty  value get set 的意思
  */
  function getState() {
    return _state;
  }
  /**
   * 通过此方法可以向仓库派发修改状态的action
   * 
   * 为了能够状态改变后自动刷新依赖，需要在内部刷新所有listeners [发布订阅]
   * 
   * @param {*} action 
   */
  function dispatch(action) {
    // 通过reducer 拉取状态变更后的新状态
    _state = reducer(_state, action);
    // 通知所有订阅的函数
    listeners.forEach(listener => listener());
  }
  /**
   * 当用户想订阅仓库中的状态变化事件的时候，就可以订阅这个状态变化事件
   * 
   * 需要传递个回调/监听函数
   * 
   * - 缓存监听函数
   * 
   * - 返回一个取消函数，当执行该取消函数后会将当前的listener 从 监听数组中删除
   * 
   * @param {*} listener 监听函数
   * @returns {function} unsubscribe 取消订阅函数
   */
  function subscribe(listener) {
    listeners.push(listener);
    return () => {
      let index = listeners.indexOf(listener);
      listeners.splice(index, 1)
    }
  }
  return {
    getState,
    dispatch,
    subscribe
  }
}