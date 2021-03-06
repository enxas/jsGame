import * as actionTypes from "../actions/actionTypes";

const initialState = {
  field: null,
  error: null,
  message: null,
  battlefieldData: null,
  redirectToBattlefield: false,
  amIMovingInBattlefield: false
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

    case actionTypes.ACTOR_MOVED_IN_BATTLEFIELD:
      let amIMovingInBattlefield = false;
      if (
        action.movementData.stillMoving === true &&
        action.movementData.isItMeMoving === true
      ) {
        amIMovingInBattlefield = true;
      }

      if (action.movementData.whoMoved === "player") {
        return {
          ...state,
          amIMovingInBattlefield: amIMovingInBattlefield,
          battlefieldData: {
            ...state.battlefieldData,
            actors: {
              ...state.battlefieldData.actors,
              players: {
                ...state.battlefieldData.actors.players,
                [action.movementData.actorId]: {
                  ...state.battlefieldData.actors.players[
                    action.movementData.actorId
                  ],
                  x: parseFloat(action.movementData.x),
                  y: parseFloat(action.movementData.y),
                  actionPoints: action.movementData.actionPoints
                }
              }
            }
          }
        };
      }

      if (action.movementData.whoMoved === "enemy") {
        return {
          ...state,
          amIMovingInBattlefield: amIMovingInBattlefield,
          battlefieldData: {
            ...state.battlefieldData,
            actors: {
              ...state.battlefieldData.actors,
              enemies: {
                ...state.battlefieldData.actors.enemies,
                [action.movementData.actorId]: {
                  ...state.battlefieldData.actors.enemies[
                    action.movementData.actorId
                  ],
                  x: parseFloat(action.movementData.x),
                  y: parseFloat(action.movementData.y)
                }
              }
            }
          }
        };
      }

    case actionTypes.PLAYER_ENDED_TURN:
      console.log("PLAYER_ENDED_TURN:");
      console.log(action);
      return {
        ...state,
        battlefieldData: {
          ...state.battlefieldData,
          actors: {
            ...state.battlefieldData.actors,
            players: {
              ...state.battlefieldData.actors.players,
              [action.player.userId]: {
                ...state.battlefieldData.actors.players[action.player.userId],
                actionPoints: action.player.actionPoints
              }
            }
          }
        }
      };

    case actionTypes.PLAYER_ATTACKED_ENEMY:
      console.log("PLAYER_ATTACKED_ENEMY:");
      console.log(action);
      return {
        ...state,
        battlefieldData: {
          ...state.battlefieldData,
          actors: {
            ...state.battlefieldData.actors,
            players: {
              ...state.battlefieldData.actors.players,
              [action.player.userId]: {
                ...state.battlefieldData.actors.players[action.player.userId],
                actionPoints: action.player.combatLog.actionPoints
              }
            }
          }
        }
      };

    default:
      return state;
  }
};

export default reducer;
