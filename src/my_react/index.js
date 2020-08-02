import React from './react';
import ReactDOM from './react-dom';

let element = React.createElement(
	'h1',
	{ style: { color: "red", background: "green" } },
	'hello',
	React.createElement('span', null, 'world')
)
console.log(element);
// debugger
ReactDOM.render(element, document.getElementById('root'));