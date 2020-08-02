import * as ACTION_TYPES from '../action-types'

let initialState = { number: 0 };

export default function counter1(state = initialState, action) {
  switch (action.type) {
    case ACTION_TYPES.ADD1:
      return { number: state.number + action.amount };
    case ACTION_TYPES.MINUS1:
      return { number: state.number - action.amount };
    default:
      return state
  }
}