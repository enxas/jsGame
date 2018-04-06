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

      newPlayersObject.map(player => {
        if (player[action.userId].isConnected === false) {
          player[action.userId].isConnected = true;
        }
      });

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

      newPlayersObject2.map(player => {
        if (player[action.userId].isConnected === true) {
          player[action.userId].isConnected = false;
        }
      });

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
