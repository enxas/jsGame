import * as actionTypes from "../actions/actionTypes";

const initialState = {
  field: null,
  error: null,
  message: null,
  battlefieldData: null,
  redirectToBattlefield: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_MAP_DATA:
      return {
        ...state,
        error: action.error,
        message: action.message
      };
    case actionTypes.SET_MAP_DATA_ON_LEADER_ENTER:
      return {
        ...state,
        field: action.field,
        battlefieldData: action.battlefieldData,
        redirectToBattlefield: true
      };
    case actionTypes.REDIRECTED_TO_BATTLEFIELD:
      return {
        ...state,
        redirectToBattlefield: false
      };

    default:
      return state;
  }
};

export default reducer;
