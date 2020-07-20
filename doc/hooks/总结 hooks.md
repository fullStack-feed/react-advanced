
# React Hooks

## 概念

### 是什么

Hook 是 React 16.8 的新增特性，可以让你在不编写 class 的情况下**使用 state 以及其他的 React 特性**。

- 拥有类似class组件（state）的响应式数据（useState）

- 拥有控制组件生命周期的能力（useEffect），当然useEffect 远不如此
- [ ] Ref
- 拥有类似Redux对复杂状态的管理能力（useReducer）

### 解决的问题 

* 在组件之间复用状态逻辑很难, 可能要用到 render props 和高阶组件，React 需要为共享状态逻辑提供更好的原生途径，Hook 使你在无需修改组件结构的情况下**复用状态逻辑**

* 复杂组件变得难以理解，Hook 将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据）

* 难以捉摸的`this`

- [ ] 性能提升

### 注意事项

* 只能在函数最外层调用 Hook，不要在循环、条件判断或者子函数中调用。
* 只能在 React函数组件中调用 Hook。

## 心得总结

### useState

#### 能力层面：

*   通过在函数组件里调用它来给组件添加一些内部的state,当组件重复渲染时会**状态复用**（而不是新创建一个状态）
*   更改状态的函数类似 class 组件的 this.setState，但是并**不会**进行**状态合并**

#### 使用层面：

*   useState 的参数不能为`null`
*   返回值：
    *   在初始渲染期间，返回的状态 (state) 与传入的第一个参数 (initialState) 值相同
    *   setState 函数用于更新 state。它接收一个**新的 state 值**,当他**执行后会将组件的一次重新渲染推入到渲染队列**

```react
const [state, setState] = useState(initialState);
```

#### demo：计数器

```react
import React, { useState } from "react";
export class CounterClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
    };
  }
  handleClick = () => {
    this.setState({ number: this.state.number + 1 });
  };
  render() {
    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={this.handleClick}>点击 + 1</button>
      </div>
    );
  }
}
export const Counter = () => {
  const [counter, setCounter] = useState(0);
  return (
    <div>
      <p>{counter}</p>
      {/* NOTE:
			
			setState函数在使用时候，要注意避免循环渲染，例如这样调用：
			<button onClick={setCounter((prevCounter) => prevCounter + 1)}>
			
			Uncaught Error:
			Too many re-renders. 
			React limits the number of renders to prevent an infinite loop.
			
			也好理解：
			首次渲染时候，会对JSX进行解析，解析到setCounter时，由于是个函数调用因此会将他执行，必然会导致死循环。
			*/}
      <button onClick={() => setCounter((prevCounter) => prevCounter + 1)}>
        点击 + 1
      </button>
    </div>
  );
};

```



#### ‼️Trick:

**1. 闭包现象：**

```react
export const CounterClosure = () => {  
  let [state, setState] = useState(0);
  const alertNumber = () => {
    console.log(`点击alert后，此时作用域下的state为：`, state);
    setTimeout(() => {
      alert(state);
    }, 3000);
  };
  const handleClick = () => {
    console.log(`组件重新渲染， 新的作用域下的state为：`, state);
    setState((lastState) => lastState + 1);
  };
  return (
    <div>
      <p>当前state中的number为：{state}</p>
      <button onClick={handleClick}>点击我创建新的作用域并将状态加1</button>
      <button onClick={alertNumber}>点击我锁定当前作用域并准备alert</button>
    </div>
  );
};
```

*   重新渲染组件会创建一个新的函数作用域（函数组件就是一个函数）
*   alert 会 “锁定” 点击事件触发时的作用域内的状态（闭包现象）
*   视图上的状态虽然已经刷新，但是当alert触发时，依旧使用的是“老作用域”

> [making-setinterval-declarative-with-react-hooks](https://overreacted.io/making-setinterval-declarative-with-react-hooks/)



**2. 函数式更新:**

```react
export const CounterUpdateFunctional = () => {
  let [state, setState] = useState({ number: 0 });
  // 无法跟进当前页面最新值，会将当前页面的值修改到触发时锁定的作用域内的值
  function lazy() {
    setTimeout(() => {
      setState({ number: state.number + 1 });
    }, 1000);
  }
  // 能够跟进当前组件的状态，保证累加到当前渲染的组件身上
  function lazyFunction() {
    setTimeout(() => {
      setState((state) => ({ number: state.number + 1 }));
    }, 3000);
  }
  return (
    <div>
      <p>{state.number}</p>

      <button onClick={() => setState({ number: state.number + 1 })}>
        点我正常增加
      </button>
      <button onClick={lazy}>点我会锁定当前增加的值</button>
      <button onClick={lazyFunction}>点我会在正常增加基础上再增加</button>
    </div>
  );
};
```

*   如果新的 state 需要通过使用先前的 state 计算得出，那么可以将函数传递给 setState。
*   该函数将接收先前的 state，并返回一个更新后的值。
*   使用函数式更新能够避免闭包导致的副作用



**3. 惰性初始化initialState & 不合并更新状态：**

```react

export const CounterLazyNoMergeState = () => {
  let [state, setState] = useState(function () {
    console.log("只有在首次渲染组件时会被执行");
    return { number: 0, name: "计数器" };
  });
  //1.initialState初始状态参数只会有组件初始渲染的时候调用，后续更新渲染时会被忽略

  //2.跟类组件setState不同，这里的状态不会自动合并 ，更新的时候要传入完整的值

  // eg:点击button1时此时name会消失

  return (
    <div>
      <p>
        {state.name}:{state.number}
      </p>
      <button onClick={() => setState({ number: state.number + 1 })}>
        我更新后不会合并参数
      </button>
      <button onClick={() => setState({ ...state, number: state.number + 1 })}>
        那就手动合并参数喽
      </button>
    </div>
  );
};
```

*   initialState 参数只会在组件的初始渲染中起作用，后续渲染时会被忽略
*   如果初始 state 需要通过复杂计算获得，则可以传入一个函数，在函数中计算并返回初始的 state，此函数只在初始渲染时被调用
*   与 class 组件中的 setState 方法不同，useState 不会自动合并更新对象。你可以用函数式的 setState 结合展开运算符来达到合并更新对象的效果



#### ‼️ 性能优化：

**1. Object.is：**

```react
export const performanceCounter = () => {
  let [state, setState] = useState(function () {
    return { number: 0, name: "计数器" };
  });
  return (
    <div>
      <p>
        {state.name}:{state.number}
      </p>
      <button onClick={() => setState({ ...state, number: state.number + 1 })}>
        不能进行深度比较
      </button>
      {/* 此时会判定为相同对象，不会进行更新操作,使用的是Object.is方法来判断是否相同 */}
      {/*     https://developer.mozilla.org/zhCN/docs/Web/JavaScript/Reference/Global_Objects/Object/is 
      */}
      <button onClick={() => setState(state)}>只能进行浅层比较</button>
    </div>
  );
};
```

- setState会通过该比较算法来判断新旧值，以达到避免重复渲染的目的。



**2. 缓存函数，减少重复渲染：**

```react
let prevIncrease;
let prevChangeName;
export const performanceCacheCounter = () => {
  let [number, setNumber] = useState(0);
  let [name, setName] = useState("su");
  // const increase = () => setNumber(number + 1) // 不能被缓存的函数
  const increase = useCallback(() => setNumber(number + 1), [number]); // 能够被缓存的函数
  /**
   * 如果不用useCallback 每次的函数都不相同；
   *
   * 使用 useCallback 后，就能保证在依赖项不改变的情况下使用缓存的函数;
   *
   *  */

  console.log("组件更新后，increase是否进行缓存 ? ", prevIncrease === increase);
  prevIncrease = increase;
  const changeName = useCallback(() => setName(Date.now()), [name]);
  console.log(
    "组件更新后，increase是否进行缓存 ? ",prevChangeName === changeName);
  prevChangeName = changeName;
  return (
    <div>
      <p>
        {name}:{number}
      </p>
      <button onClick={increase}>
        点我只更新number，按道理setName应该被缓存，不会重新创建
      </button>
      <button onClick={changeName}>
        点我只更新name，按道理setNumber应该被缓存，不会重新创建
      </button>
    </div>
  );
};
```

* 把内联回调函数及依赖项作为参数传入 `useCallback`，它将返回memoized 版本的回调函数，仅在依赖项改变后才会重新创建
* 这种优化有助于避免在每次渲染时都进行高开销的计算

> useMemo同样可以实现，useCallback只是 他的 一个 语法糖？

### useReducer

#### 能力层面：


*   useState 的替代方案。它接收一个形如 (state, action) => newState 的 reducer，并返回当前的 state 以及与其配套的 dispatch 方法
*   在某些场景下，useReducer 会比 useState 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等

#### 使用层面：

```
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

#### demo:

```
const initialState = 0;

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {number: state.number + 1};
    case 'decrement':
      return {number: state.number - 1};
    default:
      throw new Error();
  }
}
function init(initialState){
    return {number:initialState};
}
function Counter(){
    const [state, dispatch] = useReducer(reducer, initialState,init);
    return (
        <>
          Count: {state.number}
          <button onClick={() => dispatch({type: 'increment'})}>+</button>
          <button onClick={() => dispatch({type: 'decrement'})}>-</button>
        </>
    )
}
```

#### ‼️最佳实践：

- [ ] fm



### useContext 

#### 能力层面（语法糖？）：

- 接收一个 context 对象（React.createContext 的返回值）并返回该 context 的当前值

*   当前的 context 值由上层组件中距离当前组件最近的 <MyContext.Provider> 的 value prop 决定
*   当组件上层最近的 <MyContext.Provider> 更新时，该 Hook 会触发重渲染，并使用最新传递给 MyContext provider 的 context value 值

#### 使用层面：

*   useContext(MyContext) 相当于 class 组件中的 `static contextType = MyContext` 或者 `<MyContext.Consumer>`
*   useContext(MyContext) 只是让你能够读取 context 的值以及订阅 context 的变化。你仍然需要在上层组件树中使用 <MyContext.Provider> 来为下层组件提供 context

#### demo：

```
const CounterContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {number: state.number + 1};
    case 'decrement':
      return {number: state.number - 1};
    default:
      throw new Error();
  }
}
function Counter(){
  let {state,dispatch} = useContext(CounterContext);
  return (
      <>
        <p>{state.number}</p>
        <button onClick={() => dispatch({type: 'increment'})}>+</button>
        <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      </>
  )
}
function App(){
    const [state, dispatch] = useReducer(reducer, {number:0});
    return (
        <CounterContext.Provider value={{state,dispatch}}>
            <Counter/>
        </CounterContext.Provider>
    )

}
```

### effect

#### 能力层面：


*   在函数组件主体内（这里指在 React 渲染阶段）改变 DOM、添加订阅、设置定时器、记录日志以及执行其他包含副作用的操作都是不被允许的，因为这可能会产生莫名其妙的 bug 并破坏 UI 的一致性
*   使用 useEffect 完成副作用操作。赋值给 useEffect 的函数会在组件渲染到屏幕之后执行。你可以把 effect 看作从 React 的纯函数式世界通往命令式世界的逃生通道
*   useEffect 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。它跟 class 组件中的 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 具有相同的用途，只不过被合并成了一个 API

#### 使用层面：


*   该 Hook 接收一个包含命令式、且可能有副作用代码的函数

```
useEffect(didUpdate);
```

#### demo:  实现修该标题

```
class Counter extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        number: 0
      };
    }

    componentDidMount() {
        document.title = `你点击了${this.state.number}次`;
    }

    componentDidUpdate() {
        document.title = `你点击了${this.state.number}次`;
    }

    render() {
      return (
        <div>
          <p>{this.state.number}</p>
          <button onClick={() => this.setState({ number: this.state.number + 1 })}>
            +
          </button>
        </div>
      );
    }
  }
  import React,{Component,useState,useEffect} from 'react';
import ReactDOM from 'react-dom';
function Counter(){
    const [number,setNumber] = useState(0);
    // 相当于 componentDidMount 和 componentDidUpdate:
    useEffect(() => {
        // 使用浏览器的 API 更新页面标题
        document.title = `你点击了${number}次`;
    });
    return (
        <>
            <p>{number}</p>
            <button onClick={()=>setNumber(number+1)}>+</button>
        </>
    )
}
ReactDOM.render(<Counter />, document.getElementById('root'));
```

#### ‼️最佳实践：

> 在这个 class 中，我们需要在两个生命周期函数中编写重复的代码, 这是因为很多情况下，我们希望在组件加载和更新时执行同样的操作。我们希望它在每次渲染之后执行，但 React 的 class 组件没有提供这样的方法。即使我们提取出一个方法，我们还是要在两个地方调用它。useEffect 会在第一次渲染之后和每次更新之后都会执行



> 每次我们重新渲染，都会生成新的 effect，替换掉之前的。某种意义上讲，effect 更像是渲染结果的一部分 —— 每个 effect 属于一次特定的渲染。

#### ‼️性能优化：

*   如果某些特定值在两次重渲染之间没有发生变化，你可以通知 React 跳过对 effect 的调用，只要传递数组作为 useEffect 的第二个可选参数即可
*   如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行

```
function Counter(){
  const [number,setNumber] = useState(0);
  // 相当于componentDidMount 和 componentDidUpdate
  useEffect(() => {
     console.log('开启一个新的定时器')
     const $timer = setInterval(()=>{
      setNumber(number=>number+1);
     },1000);
  },[]);
  return (
      <>
          <p>{number}</p>
      </>
  )
}
```

#### ‼️清除副作用

*   副作用函数还可以通过返回一个函数来指定如何清除副作用
*   为防止内存泄漏，清除函数会在组件卸载前执行。另外，如果组件多次渲染，则在执行下一个 effect 之前，上一个 effect 就已被清除

```
import React, { useEffect, useState, useReducer } from 'react';
import ReactDOM from 'react-dom';
function Counter() {
    const [number, setNumber] = useState(0);
    useEffect(() => {
        console.log('开启一个新的定时器')
        const $timer = setInterval(() => {
            setNumber(number => number + 1);
        }, 1000);
        return () => {
            console.log('销毁老的定时器');
            clearInterval($timer);
        }
    });
    return (
        <>
            <p>{number}</p>
        </>
    )
}
function App() {
    let [visible, setVisible] = useState(true);
    return (
        <div>
            {visible && <Counter />}
            <button onClick={() => setVisible(false)}>stop</button>
        </div>
    )
}
ReactDOM.render(<App />, document.getElementById('root'));
```

### useRef

*   useRef 返回一个可变的 ref 对象，其 `.current` 属性被初始化为传入的参数（initialValue）
*   返回的 ref 对象在组件的整个生命周期内保持不变

```
const refContainer = useRef(initialValue);
```

#### useRef [#](#t217.5.1 useRef)

```
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
function Parent() {
    let [number, setNumber] = useState(0);
    return (
        <>
            <Child />
            <button onClick={() => setNumber({ number: number + 1 })}>+</button>
        </>
    )
}
let input;
function Child() {
    const inputRef = useRef();
    console.log('input===inputRef', input === inputRef);
    input = inputRef;
    function getFocus() {
        inputRef.current.focus();
    }
    return (
        <>
            <input type="text" ref={inputRef} />
            <button onClick={getFocus}>获得焦点</button>
        </>
    )
}
ReactDOM.render(<Parent />, document.getElementById('root'));
```

#### forwardRef [#](#t227.5.2 forwardRef)

*   将 ref 从父组件中转发到子组件中的 dom 元素上
*   子组件接受 props 和 ref 作为参数

```
function Child(props,ref){
  return (
    <input type="text" ref={ref}/>
  )
}
Child = forwardRef(Child);
function Parent(){
  let [number,setNumber] = useState(0); 
  const inputRef = useRef();
  function getFocus(){
    inputRef.current.value = 'focus';
    inputRef.current.focus();
  }
  return (
      <>
        <Child ref={inputRef}/>
        <button onClick={()=>setNumber({number:number+1})}>+</button>
        <button onClick={getFocus}>获得焦点</button>
      </>
  )
}
```

#### useImperativeHandle [#](#t237.5.3 useImperativeHandle)

*   `useImperativeHandle` 可以让你在使用 ref 时自定义暴露给父组件的实例值
*   在大多数情况下，应当避免使用 ref 这样的命令式代码。useImperativeHandle 应当与 forwardRef 一起使用

```
function Child(props,ref){
  const inputRef = useRef();
  useImperativeHandle(ref,()=>(
    {
      focus(){
        inputRef.current.focus();
      }
    }
  ));
  return (
    <input type="text" ref={inputRef}/>
  )
}
Child = forwardRef(Child);
function Parent(){
  let [number,setNumber] = useState(0); 
  const inputRef = useRef();
  function getFocus(){
    console.log(inputRef.current);
    inputRef.current.value = 'focus';
    inputRef.current.focus();
  }
  return (
      <>
        <Child ref={inputRef}/>
        <button onClick={()=>setNumber({number:number+1})}>+</button>
        <button onClick={getFocus}>获得焦点</button>
      </>
  )
}
```

### useLayoutEffect
----------------------------------------------

*   其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect
*   可以使用它来读取 DOM 布局并同步触发重渲染
*   在浏览器执行绘制之前 useLayoutEffect 内部的更新计划将被同步刷新
*   尽可能使用标准的 useEffect 以避免阻塞视图更新

![](http://img.zhufengpeixun.cn/domrender.jpg)

```
function LayoutEffect() {
    const [color, setColor] = useState('red');
    useLayoutEffect(() => {
        alert(color);
    });
    useEffect(() => {
        console.log('color', color);
    });
    return (
        <>
            <div id="myDiv" style={{ background: color }}>颜色</div>
            <button onClick={() => setColor('red')}>红</button>
            <button onClick={() => setColor('yellow')}>黄</button>
            <button onClick={() => setColor('blue')}>蓝</button>
        </>
    );
}
```

### 自定义 Hook

*   有时候我们会想要在组件之间重用一些状态逻辑
*   自定义 Hook 可以让你在不增加组件的情况下达到同样的目的
*   Hook 是一种复用状态逻辑的方式，它不复用 state 本身
*   事实上 Hook 的每次调用都有一个完全独立的 state
*   自定义 Hook 更像是一种约定，而不是一种功能。如果函数的名字以 use 开头，并且调用了其他的 Hook，则就称其为一个自定义 Hook

#### demo:自定义计数器

```
function useNumber(){
  const [number,setNumber] = useState(0);
  useEffect(() => {
     console.log('开启一个新的定时器')
     const $timer = setInterval(()=>{
      setNumber(number+1);
     },1000);
     return ()=>{
      console.log('销毁老的定时器')
         clearInterval($timer);
     }
  });
  return number;
}
function Counter1(){
  let number1 = useNumber();
  return (
      <>
          <p>{number1}</p>
      </>
  )
}
function Counter2(){
  let number = useNumber();
  return (
      <>
          <p>{number}</p>
      </>
  )
}
function App(){
  return <><Counter1/><Counter2/></>
}
```