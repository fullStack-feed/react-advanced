## Redux总结

### Redux 哲学

**唯一数据源**： 全局维持一个store

**不可变性**： 改变状态通过派发action，不能直接修改store中的值

**纯函数reducer** : 接受action，根据老状态和新action生成新的状态返还给Store

### 使用Redux的好处

1. **视图层变得很薄**，只包含渲染逻辑和触发action这两个职责
2. **状态变更逻辑清晰**
3. 强制让状态变更时留下一笔记录也就是dispatcher，利用它去做**debug工具**，**历史回滚等工具**

### reducer

之所以叫 `reducer` 是因为他和 `Array.prototype.reduce` 函数非常相似，本质上都是根据前一个状态返回一个新的状态。

**例如reducer 根据 prevState + action => newState**

同时reducer 也有缩减的含义，现在有两个状态：前一刻的状态和想要变更的状态，当reducer函数执行后，只剩一个新的状态，不就是缩减的意思吗？

### 工作流

![20200802104740]( https://supyyy-1259673491.cos.ap-beijing.myqcloud.com/2020/pictures20200802104740.png)

> 注意维持reducer 纯函数特性（不产生任何副作用，也不能修改参数state和action对象）

### 基本使用 & 实现

#### 基本工作流使用

[Redux-base](../../src/Redux/components/1.Redux-base.js)

**核心方法实现：**

- 初始化Store
- `getState()`
- `dispatch()`
- `subscribe()`

[redux store模拟实现](../../src/Redux/redux/createStore.js)

#### bindActionCreators基本使用

[bindActionCreators-base](./../../src/Redux/components/2.bindActionCreators-base.js)

**方法实现：**
[bindActionCreators-实现](./../../src/Redux/redux/bindActionCreators.js)

#### 模块化拆分reducers

主要是使用`combineReducers`，[入口文件](./../../src/Redux/store-模块化reducer/reducers/index.js)

**方法实现：**
[combineReducers](./../../src/Redux/redux/combineReducers.js)
