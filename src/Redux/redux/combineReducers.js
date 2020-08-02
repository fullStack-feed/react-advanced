/**
 * 返回一个函数，执行该函数能够获取最新的数据 
 * @param {object} reducers redcer的集合
 */
export default function combineReducers(reducers) {
  return (state = {}, action) => {
    let newGlobalState = {};
    for (let reducer in reducers) {
      // 拿到真正的reducer函数
      let reducer = reducers[reducer];
      let localPrevState = state[reducer];
      let localNextState = reducer(localPrevState, action);
      newGlobalState[reducer] = localNextState;
    }
    return newGlobalState
  }
}