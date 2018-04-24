import * as actionTypes from "./actionTypes";
import axios from "axios";

export const getBattlefieldData = data => {
  return {
    type: actionTypes.GET_MAP_DATA,
    error: data.error,
    message: data.message
  };
};

export const enteredBattlefield = () => {
  return dispatch => {
    let url = "/battlefield";

    axios
      .get(url)
      .then(response => {
        console.log(response.data);
        dispatch(getBattlefieldData(response.data));
      })
      .catch(err => {
        console.log(err);
        // dispatch(partyCreateFail(err.response.data.message));
      });
  };
};
////////////////////////////////////
export const setBattlefieldDataOnLeaderEnter = data => {
  return {
    type: actionTypes.SET_MAP_DATA_ON_LEADER_ENTER,
    field: data.field,
    battlefieldData: data.battlefieldData
  };
};

export const leaderEnteredBattlefield = data => {
  return dispatch => {
    dispatch(setBattlefieldDataOnLeaderEnter(data));
  };
};
///////////////////////////////
export const onRedirectedToBattlefield = () => {
  return {
    type: actionTypes.REDIRECTED_TO_BATTLEFIELD
  };
};

export const redirectedToBattlefield = () => {
  return dispatch => {
    dispatch(onRedirectedToBattlefield());
  };
};
///////////////////////////////////
export const onPlayerEnteredBattlefield = data => {
  return {
    type: actionTypes.PLAYER_ENTERED_BATTLEFIELD,
    userId: data
  };
};

export const playerEnteredBattlefield = data => {
  return dispatch => {
    dispatch(onPlayerEnteredBattlefield(data));
  };
};

export const onPlayerLeftBattlefield = data => {
  return {
    type: actionTypes.PLAYER_LEFT_BATTLEFIELD,
    userId: data
  };
};

export const playerLeftBattlefield = data => {
  return dispatch => {
    dispatch(onPlayerLeftBattlefield(data));
  };
};

/////////////////////////////////////////////////////
export const setMovedInBattlefield = data => {
  return {
    type: actionTypes.ACTOR_MOVED_IN_BATTLEFIELD,
    movementData: data
  };
};

export const movedInBattlefield = data => {
  return dispatch => {
    var i = 0;
    function movementFunc() {
      if (data.directionMoved === "up") {
        data.y = (Math.round((parseFloat(data.y) - 0.2) * 10) / 10).toFixed(1); //Math.ceil(data.y - 0.2);
      } else if (data.directionMoved === "down") {
        data.y = (Math.round((parseFloat(data.y) + 0.2) * 10) / 10).toFixed(1); //Math.ceil(data.y + 0.2);
      } else if (data.directionMoved === "left") {
        data.x = (Math.round((parseFloat(data.x) - 0.2) * 10) / 10).toFixed(1); //Math.ceil(data.x - 0.2);
      } else if (data.directionMoved === "right") {
        data.x = (Math.round((parseFloat(data.x) + 0.2) * 10) / 10).toFixed(1); //Math.ceil(data.x + 0.2);
      }
      data.stillMoving = true;

      i++;
      if (i === 5) {
        clearInterval(interval);
        data.stillMoving = false;
      }
      console.log("tick " + i);
      dispatch(setMovedInBattlefield(data));
    }
    var interval = setInterval(movementFunc, 200);
    movementFunc();
  };
};
/////////////////////////////////////////////////////
