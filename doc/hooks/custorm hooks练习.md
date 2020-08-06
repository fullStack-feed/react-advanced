
## 9.2 中间件 [#](#t279.2 中间件)

#### 9.2.1 logger [#](#t289.2.1 logger)

```
import React, { useEffect, useState, useReducer } from 'react';
import ReactDOM from 'react-dom';
const initialState = 0;

function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return { number: state.number + 1 };
        case 'decrement':
            return { number: state.number - 1 };
        default:
            throw new Error();
    }
}
function init(initialState) {
    return { number: initialState };
}
function useLogger(reducer, initialState, init) {
    const [state, dispatch] = useReducer(reducer, initialState, init);
    let dispatchWithLogger = (action) => {
        console.log('老状态', state);
        dispatch(action);
    }
    useEffect(function () {
        console.log('新状态', state);
    }, [state]);
    return [state, dispatchWithLogger];
}
function Counter() {
    const [state, dispatch] = useLogger(reducer, initialState, init);
    return (
        <>
            Count: {state.number}
            <button onClick={() => dispatch({ type: 'increment' })}>+</button>
            <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
        </>
    )
}
ReactDOM.render(<Counter />, document.getElementById('root'));
```

#### 9.2.2 promise [#](#t299.2.2 promise)

```
import React, { useEffect, useState, useReducer } from 'react';
import ReactDOM from 'react-dom';
const initialState = 0;

function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return { number: state.number + 1 };
        case 'decrement':
            return { number: state.number - 1 };
        default:
            throw new Error();
    }
}
function init(initialState) {
    return { number: initialState };
}
function useLogger(reducer, initialState, init) {
    const [state, dispatch] = useReducer(reducer, initialState, init);
    let dispatchWithLogger = (action) => {
        console.log('老状态', state);
        dispatch(action);
    }
    useEffect(function () {
        console.log('新状态', state);
    }, [state]);
    return [state, dispatchWithLogger];
}
function usePromise(reducer, initialState, init) {
    const [state, dispatch] = useReducer(reducer, initialState, init);
    let dispatchPromise = (action) => {
        if (action.payload && action.payload.then) {
            action.payload.then((payload) => dispatch({ ...action, payload }));
        } else {
            dispatch(action);
        }
    }
    return [state, dispatchPromise];
}
function Counter() {
    const [state, dispatch] = usePromise(reducer, initialState, init);
    return (
        <>
            Count: {state.number}
            <button onClick={() => dispatch({ type: 'increment' })}>+</button>
            <button onClick={() => dispatch({
                type: 'increment',
                payload: new Promise(resolve => {
                    setTimeout(resolve, 1000);
                })
            })}>delay</button>
        </>
    )
}
ReactDOM.render(<Counter />, document.getElementById('root'));
```

#### 9.2.3 thunk [#](#t309.2.3 thunk)

```
import React, { useEffect, useState, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { resolve } from 'dns';
const initialState = 0;

function reducer(state, action) {
    switch (action.type) {
        case 'increment':
            return { number: state.number + 1 };
        case 'decrement':
            return { number: state.number - 1 };
        default:
            throw new Error();
    }
}
function init(initialState) {
    return { number: initialState };
}
function useLogger(reducer, initialState, init) {
    const [state, dispatch] = useReducer(reducer, initialState, init);
    let dispatchWithLogger = (action) => {
        console.log('老状态', state);
        dispatch(action);
    }
    useEffect(function () {
        console.log('新状态', state);
    }, [state]);
    return [state, dispatchWithLogger];
}
function usePromise(reducer, initialState, init) {
    const [state, dispatch] = useReducer(reducer, initialState, init);
    let dispatchPromise = (action) => {
        if (action.payload && action.payload.then) {
            action.payload.then((payload) => dispatch({ ...action, payload }));
        } else {
            dispatch(action);
        }
    }
    return [state, dispatchPromise];
}
function useThunk(reducer, initialState, init) {
    const [state, dispatch] = useReducer(reducer, initialState, init);
    let dispatchPromise = (action) => {
        if (typeof action === 'function') {
            action(dispatchPromise, () => state);
        } else {
            dispatch(action)
        }
    }
    return [state, dispatchPromise];
}
function Counter() {
    const [state, dispatch] = useThunk(reducer, initialState, init);
    return (
        <>
            Count: {state.number}
            <button onClick={() => dispatch({ type: 'increment' })}>+</button>
            <button onClick={() => dispatch(function (dispatch, getState) {
                setTimeout(function () {
                    dispatch({ type: 'increment' });
                }, 1000);
            })}>delay</button>
        </>
    )
}
ReactDOM.render(<Counter />, document.getElementById('root'));
```

### 9.3 ajax [#](#t319.3 ajax)

```
import React, { useState, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
function useRequest(url) {
    let limit = 5;
    let [offset, setOffset] = useState(0);
    let [data, setData] = useState([]);
    function loadMore() {
        setData(null);
        fetch(`${url}?offset=${offset}&limit=${limit}`)
            .then(response => response.json())
            .then(pageData => {
                setData([...data, ...pageData]);
                setOffset(offset + pageData.length);
            });
    }
    useEffect(loadMore, []);
    return [data, loadMore];
}

function App() {
    const [users, loadMore] = useRequest('http://localhost:8000/api/users');
    if (users === null) {
        return <div>正在加载中....</div>
    }
    return (
        <>
            <ul>
                {
                    users.map((item, index) => <li key={index}>{item.id}:{item.name}</li>)
                }
            </ul>
            <button onClick={loadMore}>加载更多</button>
        </>
    )
}
ReactDOM.render(<App />, document.getElementById('root'));
```

async+await

```
import React, { useState, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
function useRequest(url) {
    let limit = 5;
    let [offset, setOffset] = useState(0);
    let [data, setData] = useState([]);
    async function loadMore() {
        setData(null);
        let pageData = await fetch(`${url}?offset=${offset}&limit=${limit}`)
            .then(response => response.json());
        setData([...data, ...pageData]);
        setOffset(offset + pageData.length);
    }
    useEffect(loadMore, []);
    return [data, loadMore];
}

function App() {
    const [users, loadMore] = useRequest('http://localhost:8000/api/users');
    if (users === null) {
        return <div>正在加载中....</div>
    }
    return (
        <>
            <ul>
                {
                    users.map((item, index) => <li key={index}>{item.id}:{item.name}</li>)
                }
            </ul>
            <button onClick={loadMore}>加载更多</button>
        </>
    )
}
ReactDOM.render(<App />, document.getElementById('root'));
```

```
let express = require('express');
let app = express();
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
});
app.get('/api/users', function (req, res) {
    let offset = parseInt(req.query.offset);
    let limit = parseInt(req.query.limit);
    let result = [];
    for (let i = offset; i < offset + limit; i++) {
        result.push({ id: i + 1, name: 'name' + (i + 1) });
    }
    res.json(result);
});
app.listen(8000);
```

### 9.4 动画 [#](#t329.4 动画)

```
import React, { useState, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function useMove(initialClassName) {
    const [className, setClassName] = useState(initialClassName);
    const [state, setState] = useState('');
    function start() {
        setState('bigger');
    }
    useEffect(() => {
        if (state === 'bigger') {
            setClassName(`${initialClassName} ${initialClassName}-bigger`);
        }
    }, [state]);
    return [className, start];
}

function App() {
    const [className, start] = useMove('circle');
    return (
        <div>
            <button onClick={start}>start</button>
            <div className={className}></div>
        </div>
    )
}
ReactDOM.render(<App />, document.getElementById('root'));
```

```
.circle {
    width : 50px;
    height : 50px;
    border-radius: 50%;
    background : red;
    transition: all .5s;
  }
.circle-bigger {
    width : 200px;
    height : 200px;
}
```

10. 路由 hooks [#](#t3310.路由hooks)

--------------------------------

### 10.1 useParams [#](#t3410.1 useParams)

* 获取路由中的 params

#### 10.1.1 老版 [#](#t3510.1.1 老版)

```
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function Post({ match }) {
  let { title } = match.params;
  return <div>{title}</div>;
}

ReactDOM.render(
  <Router>
    <div>
      <Switch>
        <Route path="/post/:title" component={Post} />
      </Switch>
    </div>
  </Router>,
  document.getElementById("root")
);
```

#### 10.1.2. 新版 [#](#t3610.1.2.新版)

```
import React from "react";
import ReactDOM from "react-dom";
+import { BrowserRouter as Router, Route, Switch, useParams } from "react-router-dom";

+function Post() {
+  let { title } = useParams();
+  return <div>{title}</div>;
+}

ReactDOM.render(
  <Router>
    <div>
      <Switch>
+        <Route path="/post/:title"><Post /></Route>
      </Switch>
    </div>
  </Router>,
  document.getElementById("root")
);
```

### 10.2.useLocation [#](#t3710.2.useLocation)

* 可以查看当前路由

#### 10.2.1. 老版 [#](#t3810.2.1.老版)

```
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function Post({ match, location }) {
  let { title } = match.params;
  return <div>{title}{JSON.stringify(location)}</div>;
}

ReactDOM.render(
  <Router>
    <div>
      <Switch>
        <Route path="/post/:title" component={Post} />
      </Switch>
    </div>
  </Router>,
  document.getElementById("root")
);
```

#### 10.2.2 新版 [#](#t3910.2.2 新版)

```
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, useParams, useLocation } from "react-router-dom";

function Post() {
   let { title } = useParams();
+  const location = useLocation();
+  return <div>{title}<hr />{JSON.stringify(location)}</div>;
}

ReactDOM.render(
  <Router>
    <div>
      <Switch>
        <Route path="/post/:title"><Post /></Route>
      </Switch>
    </div>
  </Router>,
  document.getElementById("root")
);
```

### 10.3.useHistory [#](#t4010.3.useHistory)

* 可以返回上一个网页

#### 10.3.1 老版 [#](#t4110.3.1 老版)

```
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";

function Post({ match, history }) {
  let { title } = match.params;
  return (
    <div>
      {title}
      <hr />
      <button type="button" onClick={() => history.goBack()}>
        回去
      </button>
    </div>
  );
}
function Home({ history }) {
  return (
    <>
      <button type="button" onClick={() => history.push("/post/hello")}>
        title
      </button>
    </>
  )
}
ReactDOM.render(
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/post/:title" component={Post} />
      </Switch>
    </div>
  </Router>,
  document.getElementById("root")
);
```

#### 10.3.2 新版 [#](#t4210.3.2 新版)

```
import React from "react";
import ReactDOM from "react-dom";
+import { BrowserRouter as Router, Route, Switch, useParams, useHistory } from "react-router-dom";

function Post() {
+  let { title } = useParams();
+  let history = useHistory();
  return (
    <div>
      {title}
      <hr />
+      <button type="button" onClick={() => history.goBack()}>
+        回去
+      </button>
    </div>
  );
}
function Home() {
+  let history = useHistory();
  return (
    <>
+      <button type="button" onClick={() => history.push("/post/hello")}>
+        title
+      </button>
    </>
  )
}
ReactDOM.render(
  <Router>
    <div>
      <Switch>
+        <Route exact path="/" component={Home} />
+        <Route path="/post/:title" component={Post} />
      </Switch>
    </div>
  </Router>,
  document.getElementById("root")
);
```

### 10.4 useRouteMatch [#](#t4310.4 useRouteMatch)

* `useRouteMatch`挂钩尝试以与`Route`相同的方式匹配当前`URL`
* 在无需实际呈现`Route`的情况下访问匹配数据最有用

#### 10.4.1 旧版 [#](#t4410.4.1 旧版)

```
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
function NotFound() {
  return <div>Not Found</div>
}
function Post(props) {
  return (
    <div>{props.match.params.title}</div>
  )
}
function App() {
  return (
    <div>
      <Route
        path="/post/:title"
        strict
        sensitive
        render={({ match }) => match ? <Post match={match} /> : <NotFound />}
      />
    </div>
  )
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
```

#### 10.4.2 新版 [#](#t4510.4.2 新版)

```
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, useRouteMatch } from 'react-router-dom';
function NotFound() {
  return <div>Not Found</div>
}
function Post(props) {
  return (
    <div>{props.match.params.title}</div>
  )
}
function App() {
  let match = useRouteMatch({
    path: '/post/:title',
    strict: true,
    sensitive: true
  })
  console.log(match);
  return (
    <div>
      {match ? <Post match={match} /> : <NotFound />}
    </div>
  )
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
```
