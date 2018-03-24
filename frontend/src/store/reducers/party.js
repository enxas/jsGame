import * as actionTypes from "../actions/actionTypes";

const initialState = {
  message: null,
  error: null,
  loading: false,
  list: null,
  partyInfo: {
    id: null,
    floor: null,
    members: []
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PARTY_CREATE_START:
      return {
        ...state,
        error: null,
        message: null,
        loading: true
      };
    case actionTypes.PARTY_CREATE_FINISH:
      return {
        ...state,
        error: null,
        message: null,
        loading: false
      };
    case actionTypes.PARTY_CREATE_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: action.error,
        loading: false,

        partyInfo: {
          id: action.partyId,
          floor: action.floor,
          members: action.members
        }
      };
    case actionTypes.PARTY_CREATE_FAIL:
      return {
        ...state,
        message: action.message,
        error: action.error,
        loading: false
      };

    case actionTypes.PARTY_LEAVE_START:
      return {
        ...state,
        error: null,
        message: null,
        loading: true
      };
    case actionTypes.PARTY_LEAVE_FINISH:
      return {
        ...state,
        error: null,
        message: null,
        loading: false
      };
    case actionTypes.PARTY_LEAVE_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: action.error,
        loading: false,

        partyInfo: {
          id: null,
          floor: null,
          members: []
        }
      };
    case actionTypes.PARTY_LEAVE_FAIL:
      return {
        ...state,
        message: action.message,
        error: action.error,
        loading: false
      };

    case actionTypes.PARTY_LIST_FAIL:
      return {
        ...state,
        error: action.error,
        list: null
      };
    case actionTypes.PARTY_LIST_SUCCESS:
      return {
        ...state,
        list: action.list
      };

    case actionTypes.PARTY_JOIN_START:
      return {
        ...state,
        error: null,
        message: null,
        loading: true
      };
    case actionTypes.PARTY_JOIN_SUCCESS:
      return {
        ...state,
        partyInfo: {
          id: action.partyId,
          floor: action.floor,
          members: action.members
        },
        message: action.message,
        error: action.error,
        loading: false
      };
    case actionTypes.PARTY_JOIN_FAIL:
      return {
        ...state,
        message: action.message,
        error: action.error,
        loading: false
      };

    case actionTypes.PLAYER_JOINED_PARTY:
      return {
        ...state,
        partyInfo: {
          ...state.partyInfo,
          members: [...state.partyInfo.members, action.playerName]
        }
      };
    case actionTypes.PLAYER_LEFT_PARTY:
      const leftPlayers = state.partyInfo.members.filter(
        e => e !== action.playerName
      );
      return {
        ...state,
        partyInfo: {
          ...state.partyInfo,
          members: leftPlayers
        }
      };
    case actionTypes.PLAYER_DISBANDED_PARTY:
      return {
        ...state,
        partyInfo: {
          id: null,
          floor: null,
          members: []
        }
      };

    default:
      return state;
  }
};

export default reducer;
