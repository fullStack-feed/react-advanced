import * as ACTION_TYPES from '../action-types';
function add1(amount) {
  return { type: ACTION_TYPES.ADD1, amount };
}
function minus1(amount) {
  return { type: ACTION_TYPES.MINUS1, amount };
}
export default { add1, minus1 }