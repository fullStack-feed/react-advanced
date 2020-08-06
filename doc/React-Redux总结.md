## Redux-React

### 动机

通常在组件使用原生Redux时需要做如下四件事儿：

- 引入`store`
- 将需要的状态映射成组件内部的状态 （`this.state = store.getState()`）
- 当状态发生改变后，需要手动 订阅和取消订阅 一个“视图更新”函数，例如`this.setState()`
- `bindActionCreators`使得组件内部方便执行`actions`

不同组件有如下几点区别：

- 绑定的`actions`不一样（来自不同的`action文件`）
- 映射的状态不同

Redux-React意图将这一过程精简化，提高开发效率。

例如下面这个组件,使用[connect](./../src/Redux-React/components/connect.js) 函数简化了裸Redux的开发流程。

> 当然，需要在app组件通过Provider组件将store向下传递

### 基本使用 & 实现

[Provider组件](../src/Redux/react-redux/Provider.js)

[connect高阶组件](../src/Redux/react-redux/connect.js)
