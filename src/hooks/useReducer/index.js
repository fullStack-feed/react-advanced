import React, { useCallback, useReducer } from 'react';
let initialState = { number: 0 };
const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';
function reducer(state, action) {
	switch (action.type) {
		case INCREMENT:
			return { number: state.number + 1 };
		case DECREMENT:
			return { number: state.number - 1 };
		default:
			return state;
	}
}
//TODO: 什么时候使用useState 和 useReducer
//useState 实现原理：
const useState = (initialState) => {
	const reducer = useCallback((state, action) => action);
	let [state, dispatch] = useReducer(reducer, initialState);
	function setState(payload) {
		dispatch(payload);
	}
	return [state, setState];
}
const App = () => {
	let [state, dispatch] = useReducer(reducer, initialState);
	// let [state, setState] = useState(initialState); 
	return (
		<div>
			<p>{state.number}</p>
			<button onClick={() => setState({ number: state.number + 1 })}>+</button>
			<button onClick={() => setState(dispatch({ type: INCREMENT }))}>-</button>
		</div>
	)
}