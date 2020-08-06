## redux中间件

原理:对dispatch进行改造，增加副作用（增加业务逻辑或异步请求）

![20200806145320]( https://supyyy-1259673491.cos.ap-beijing.myqcloud.com/2020/pictures20200806145320.png)

### 常见中间件

**Logger：** 使用logger中间件后，在状态改变前后会执行状态打印。

**Thunk：** 使用thunk中间件后，action可以是函数因此可以通过该函数执行一些额外逻辑后，再store再次派发一个action
**Promise：** 可以让action 拥有then方法，在then方法中调用dispatch函数。

- [ ] Saga：saga中间件能够将异步逻辑（复杂逻辑）统一管理到一个文件中

### 原理

> src/Redux/中间件函数 + src/redux/ 中有写好的源码

以下为自己练习思路的代码：

```js

// --- demo

let store = createStore(reducer,{},applyMiddleware(promise,thunk,looger))

export function createStore (reducer,initialState,enhancer) {
  // ...
  if(typeof enhancer !== 'undefined') {
    return enhancer(createStore)(reducer,initialState)
  }
  // ...
}

/**
 * 思路：
 * - 创建 store 并返回
 * - 重写dispatch 方法
 * @param  {...any} middlewares
 */
export const applyMiddleware = (...middlewares) => createStore => (reducer,initialState) => {
  let store = createStore(reducer,initialState);
  
  let dispatch = undefined;
  let middlewareAPI = {
    dispatch: (action) => dispatch(action),
    getState: store.getState
  }
  // 处理中间件，将API缓存
  
  middlewares = middlewares.map(m => m(middlewareAPI))

  // 加持dispatch方法
  // 需要：(...args) => a(b(c(args)))
  dispatch = compose(...middlewares)(sotre.dispatch)

  return {
    ...store,
    dispatch
  }
}

// 避免一个中间件进来，数组收一下
let compose = (...middlewares) => middlewares.reducer((a,b) => (...args) => a(b(args)))
```
