import * as ACTION_TYPES from '../action-types';
function add2(amount) {
  return { type: ACTION_TYPES.ADD2, amount };
}
function minus2(amount) {
  return { type: ACTION_TYPES.MINUS2, amount };
}
export default {
  add2,
  minus2
}