import React, { useEffect, useState, useReducer } from 'react';
import ReactDOM from 'react-dom';
// import { CounterUpdateFunctional } from './hooks/useState/counter';
import { UseMemoPerformance } from './hooks/useMemo/index.jsx'
function App() {
	return <div>
		Hey
	</div>
}
ReactDOM.render(<UseMemoPerformance />, document.getElementById('root'));