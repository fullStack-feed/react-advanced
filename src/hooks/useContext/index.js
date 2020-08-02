import React, { useCallback, useReducer, useState, useContext } from 'react';
// 语法糖而已，注意 供应商和消费者关系
let MyContext = React.createContext();

function App() {
	const [state, setState] = useState({ number: 0 });
	return (
		// 向下暴露数据
		<MyContext.Provider value={{ state, setState }}>
			<Counter />
		</MyContext.Provider>
	)
}

function Counter() {
	// 只是把MyContext解构出来，不要想多了
	// 不管父组件是否进行SCU优化，或者memo优化，只要MyContext发生改变，就会重新渲染该组件
	let { state, setState } = useContext(MyContext);
	return (
		<div>
			<p>{state.number}</p>
			<button onClick={() => setState({ number: state.number + 1 })}>+</button>
		</div>
	)
}