/**
 * 包裹函数，将actions中每一个action使用dispatch函数映射一下
 * 
 * @param {*} actions action集合，保存着所有action函数
 * @param {*} dispatch 
 */
export default function bindActionCreators(actions, dispatch) {
  // 用于保存所有被dispatch包装过的action集合
  let boundActions = {};
  for (const action in actions) {
    // 注意 此处需要透传 原 action中参数
    boundActions[action] = (...args) => {
      dispatch(actions[action](...args))
    }
  }
  return boundActions;
}