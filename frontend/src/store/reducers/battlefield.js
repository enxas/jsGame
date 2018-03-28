import * as actionTypes from "../actions/actionTypes";

const initialState = {
  field: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_MAP_DATA:
      return {
        ...state,
        field: action.field
      };

    default:
      return state;
  }
};

export default reducer;
