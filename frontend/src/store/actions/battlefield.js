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

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
