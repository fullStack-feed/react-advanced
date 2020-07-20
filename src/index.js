import React, { useEffect, useState, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { CounterUpdateFunctional } from './hooks/useState/counter';

ReactDOM.render(<CounterUpdateFunctional />, document.getElementById('root'));