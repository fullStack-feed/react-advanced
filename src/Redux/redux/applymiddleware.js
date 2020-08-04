
/**
 * 1.收集所有中间件
 * 2.接收老的createStore 以便在内部能够创建store 重写dispatch方法
 *    该方法接收 initalState + reducer
 */
export default applymiddleware = (...middleware) => createStore => (reduer,initalState) => {  
  let store = new createStore(reducer,initalState)
  let dispatch = undefined;
  let middlewareAPI = {
    getState: store.getState,
    dispatch: action => dispatch(action)
  }
  // 让中间件缓存API
  middlewares = middleware.map(m => m(middlewareAPI));
  // 让多个中间件串联，返回一个a(b(c())) 让该函数执行后，将store.dispatch传递进去，使得能够获得正常的dispatch方法
  dispatch = compose(...middlewares)(store.dispatch);
  return {
    ...store,
    dispatch
  }
}

const compose = (...func) => func.reduce((a,b) => (...args) => a(b(...args)))

