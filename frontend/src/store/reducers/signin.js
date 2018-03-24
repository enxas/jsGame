import * as actionTypes from "../actions/actionTypes";

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  partiesList: [],
  socket: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SIGNIN_START:
      return {
        ...state,
        error: null,
        loading: true
      };
    case actionTypes.AUTH_LOGOUT:
      return {
        ...state,
        token: null,
        userId: null
      };
    case actionTypes.SIGNIN_SUCCESS:
      return {
        ...state,
        token: action.idToken,
        userId: action.userId,
        error: null,
        loading: false,
        partiesList: action.partiesList
      };
    case actionTypes.SIGNIN_FAIL:
      return {
        ...state,
        error: action.error,
        loading: false
      };
    case actionTypes.SET_SOCKET:
      return {
        ...state,
        socket: action.socket
      };

    default:
      return state;
  }
};

export default reducer;
