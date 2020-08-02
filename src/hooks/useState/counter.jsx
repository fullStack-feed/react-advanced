import React, { useState, useCallback } from "react";
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
export const CounterHooks = () => {
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
      {/* https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is */}
      <button onClick={() => setState(state)}>只能进行浅层比较</button>
    </div>
  );
};

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
    "组件更新后，increase是否进行缓存 ? ",
    prevChangeName === changeName
  );
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
