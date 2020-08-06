## React-Router

### 使用层面

#### 使用 - Routers 组件

#### 使用 - Route 组件

#### 使用 - Navigation 组件

#### 使用 - 属性

##### history

##### location

#### 使用 - hooks

### HashRouter & BrowserRouter 核心原理

#### HashRouter路由实现原理

- 监听 window.hashchange 事件
- window.location 获取 当前URI信息

```html
<body>
  <a href="#/a">去/a</a>
  <a href="#/b">去/b</a>
  <div id="root"></div>
  <script>
    let root = document.getElementById('root');

    // hash 路由主要靠的是监听 window.hashchange 事件
    // 当路由改变时，从location中获取改变后的 location 对象去 match


    /* location 对象的属性：（常见的）
      protocol: "file:"
      href: "file:///Users/supengyu/Downloads/react/4.router/public/hash.html#/b"
      pathname: "/Users/supengyu/Downloads/react/4.router/public/hash.html"
      hash: "#/b"
      search: ""
      port: ""
      host: ""
      hostname: ""
      origin: "file://"
    */
    window.addEventListener('hashchange', () => {
      let hash = window.location.hash.slice(1);
      if (hash === '/a') {
        root.innerHTML = 'a';
      } else if (hash === '/b') {
        root.innerHTML = 'b';
      }
    });
  </script>
</body>
```

#### BrowserRouter路由实现原理

由于 `window.history.pushState & window.history.replaceState` 无法触发`window.onpopstate`事件，因此需要对`pushState & replaceState`做函数劫持，手动触发自定义的`window.onpushstate`事件。

```html

<body>
    <div id="root"></div>
    <script>
      /**
       * 只有在 history.back() & history.go() 触发该事件
       *
      */
        window.onpopstate = (event) => {
            console.log({ state: event.state, pathname: window.location.pathname, type: 'popstate' });
        }
        /*
        * 自定义window 事件
        */
        window.onpushstate = (event) => {
            console.log(event);
        }

        (function (history) {
            let pushState = history.pushState;
            // 对老的pushState做一个函数劫持
            // 同样需要对history.replaceState做函数劫持 此处省略
            history.pushState = function (state, title, pathname) {
                if (typeof window.onpushstate === 'function') {
                    window.onpushstate({ state, pathname, type: 'pushstate' });
                }
                return pushState.apply(history, arguments)
            }
        })(window.history);



        //pushState 1：state 2：title(没啥用) 3 path
        setTimeout(() => {
            history.pushState({ page: 1 }, 'page1', '/page1');
        }, 1000);
        setTimeout(() => {
            history.pushState({ page: 2 }, 'page2', '/page2');
        }, 2000);
        setTimeout(() => {
            history.pushState({ page: 3 }, 'page3', '/page3');
        }, 3000);
        // 修改当前栈顶路由
        setTimeout(() => {
            history.replaceState({ page: 4 }, 'page4', '/page4');
        }, 4000);
        // 往回调
        setTimeout(() => {
            history.back();
        }, 5000);
        setTimeout(() => {
            history.back();
        }, 6000);
        // + 往前走 -往后走
        setTimeout(() => {
            history.go(1); // 停在哪个路径
        }, 7000);
    </script>
</body>
```

### 组件库原理 & 实现

#### HashRouter

- 利用`React.Context`将路由对象向子组件内部传递
- 利用HOC将子组件渲染
- 组件挂载时监听`window.onhashchange`事件

[HashRouter实现原理](./../src/React-Router/react-router-dom/HashRouter.js)

#### BrowserRouter

和 HashRouter 实现基本类似

[BrowserRouter](./../src/React-Router/react-router-dom/BrowserRouter.js)

#### Route

- 接受`React.Context`传递的 `history & location`
- 处理URL匹配，决定是否渲染组件
- 处理params，向组件内部传递

[Route](./../src/React-Router/react-router-dom/Route.js)

#### Switch

**需要解释一点：Route 即使匹配成功后，也会继续向下匹配，但`Switch`组件只会找到匹配的路由返回**

- 获取所有路由，match 对应的path
- 返回匹配的路由组件 给 Hash/BrowserRouter进行渲染

[Route](./../src/React-Router/react-router-dom/Switch.js)

#### Link

- 获取上层组件通过`Context`传递的`history.push`方法 以及 获取组件的`to` 属性
- 使用`<a></a>`包裹组件
- 向`<a>`注册`onClick`事件处理函数，触发时执行`history.push` 方法并将`this.props.to`传递进push中

[Link](./../src/React-Router/react-router-dom/Link.js)

#### Redirect

- 渲染该组件时，在其内部`componentDidMount`生命周期中执行上层组件传递的`history.push()`方法跳转到`this.props.to`对应的url
