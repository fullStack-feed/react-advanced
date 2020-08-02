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

### redux中间件

原理:对dispatch进行改造，生成副作用（增加业务逻辑或异步请求）

[image:2AC529B7-3F34-4B40-AEE8-96AF8A130F12-57668-000085C538D5F0EF/E1E5CDCA-F72A-4B85-B1B6-4C4597E1E251.png]

#### 常见异步中间件

Thunk：使用thunk中间件后，action可以是函数因此**可以**通过该函数执行一些额外逻辑后，向 store再次派发一个action

- [ ] Saga：saga中间件能够将异步逻辑（复杂逻辑）统一管理到一个文件中

### React-Redux

通过Provider向组件注入redux 中store的数据
[image:7673BF6D-17EC-4D86-8D71-76BDA3D7021E-57668-000083385571F571/未知.png]

connect HOC 将组件进行包装，使得组件能够获取 指定的store 和 dispatch方法。同时当store状态发生改变后，不再需要手动调用 subscribe方法

- [ ] subscribe方法？？

[image:9C126761-D824-4B3B-BE2B-1561CC90B6A3-57668-000083385540AC53/未知.png]

mapStateToProps：通过该函数将store中的状态映射到props中
[image:1F80BC92-7DD2-4726-819C-768885F381E7-57668-00008338551116E7/未知.png]

mapDispatchToProps：通过该函数暴露出能够提交dispatch的方法
[image:6E4C3A6C-14CA-4A17-A51E-C878D7B5A222-57668-0000833854E35673/未知.png]

最终流程图如下所示
[image:03E5D00C-255D-452C-9714-86E2830B878A-63678-0000B0FEC2F0FEF5/v2-0b716fd55e986163344ef8df174b99b0_720w.jpg]

### Redux 基本使用

## Redux-React

### 意图

通常在组件使用原生Redux时需要做如下四件事儿：

- 引入store
- 将需要的状态映射成组件内部的状态 （this.state = store.getState()）
- 当状态发生改变后，需要手动 订阅和取消订阅 一个“视图更新”函数，例如this.setState()
- bindActionCreators,使得组件内部方便执行actions

不同组件有如下几点区别：

- 绑定的actions不一样（来自不同的action）
- 映射的状态不同

Redux-React意图将这一过程精简化，提高开发效率。

例如下面这个组件,使用[connect](./../src/Redux-React/components/connect.js) 函数简化了裸Redux的开发流程。

> 当然，需要在app组件通过Provider将store向下传递

### 基本使用 & 实现

#### connect
