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
    case actionTypes.PLAYER_ENTERED_BATTLEFIELD:
      let newPlayersObject = JSON.parse(
        JSON.stringify(state.battlefieldData.actors.players)
      );

      for (let playerId in newPlayersObject) {
        // if (newPlayersObject[playerId].isConnected === false) {
        if (playerId === action.userId) {
          newPlayersObject[playerId].isConnected = true;
        }
      }

      return {
        ...state,
        battlefieldData: {
          ...state.battlefieldData,
          actors: {
            ...state.battlefieldData.actors,
            players: newPlayersObject
          }
        }
      };

    case actionTypes.PLAYER_LEFT_BATTLEFIELD:
      let newPlayersObject2 = JSON.parse(
        JSON.stringify(state.battlefieldData.actors.players)
      );

      for (let playerId2 in newPlayersObject2) {
        // if (newPlayersObject2[playerId2].isConnected === true) {
        if (playerId2 === action.userId) {
          newPlayersObject2[playerId2].isConnected = false;
        }
      }

      return {
        ...state,
        battlefieldData: {
          ...state.battlefieldData,
          actors: {
            ...state.battlefieldData.actors,
            players: newPlayersObject2
          }
        }
      };

    default:
      return state;
  }
};

export default reducer;
