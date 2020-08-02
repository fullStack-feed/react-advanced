import counter1 from './counter1';
import counter2 from './counter2';
import { combineReducers } from '../../redux';

let reducers = { counter1, counter2 };
// 合并reducer后导出，使得createReducer能够接受一个根reducer（汇总后的）
let reducer = combineReducers(reducers);
export default reducer;