import * as actionTypes from "./actionTypes";
import axios from "axios";

export const partyCreateStart = () => {
  return {
    type: actionTypes.PARTY_CREATE_START
  };
};

export const partyCreateFinish = () => {
  return {
    type: actionTypes.PARTY_CREATE_FINISH
  };
};

export const partyCreateSuccess = response => {
  return {
    type: actionTypes.PARTY_CREATE_SUCCESS,
    error: response.error,
    message: response.message,
    floor: response.floor,
    members: response.members,
    partyId: response.partyId
  };
};

export const partyCreateFail = error => {
  return {
    type: actionTypes.PARTY_CREATE_FAIL,
    error: error
  };
};

export const partyCreate = floorLevel => {
  return dispatch => {
    dispatch(partyCreateStart());
    const payload = {
      floorLevel: floorLevel
    };

    let url = "/party";

    axios
      .post(url, payload)
      .then(response => {
        console.log(response);
        dispatch(partyCreateSuccess(response.data));
        dispatch(partyCreateFinish());
      })
      .catch(err => {
        console.log(err);
        dispatch(partyCreateFail(err.response.data.message));
      });
  };
};

/////////////// PARTY LEAVE /////////////////

export const partyLeaveStart = () => {
  return {
    type: actionTypes.PARTY_LEAVE_START
  };
};

export const partyLeaveFinish = () => {
  return {
    type: actionTypes.PARTY_LEAVE_FINISH
  };
};

export const partyLeaveSuccess = response => {
  return {
    type: actionTypes.PARTY_LEAVE_SUCCESS,
    error: response.error,
    message: response.message
  };
};

export const partyLeaveFail = error => {
  return {
    type: actionTypes.PARTY_LEAVE_FAIL,
    error: error
  };
};

export const partyLeave = () => {
  return dispatch => {
    dispatch(partyLeaveStart());

    let url = "/party/leave";

    axios
      .get(url)
      .then(response => {
        console.log(response);
        dispatch(partyLeaveSuccess(response.data));
        dispatch(partyLeaveFinish());
      })
      .catch(err => {
        console.log(err);
        dispatch(partyLeaveFail(err.response.data.message));
      });
  };
};

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

export const partyListSuccess = message => {
  return {
    type: actionTypes.PARTY_LIST_SUCCESS,
    list: message
  };
};

export const partyListFail = error => {
  return {
    type: actionTypes.PARTY_LIST_FAIL,
    error: error
  };
};

export const getPartiesList = () => {
  return dispatch => {
    dispatch(partyCreateStart());

    let url = "/party";

    axios
      .get(url)
      .then(response => {
        console.log(response);
        dispatch(partyListSuccess(response.data.partiesList));
        dispatch(partyCreateFinish());
      })
      .catch(err => {
        console.log(err);
        dispatch(partyListFail(err.response.data.error));
        dispatch(partyCreateFinish());
      });
  };
};
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
export const partyJoinStart = () => {
  return {
    type: actionTypes.PARTY_JOIN_START
  };
};

export const partyJoinSuccess = (data, error) => {
  return {
    type: actionTypes.PARTY_JOIN_SUCCESS,
    floor: data.floor,
    members: data.members,
    partyId: data.partyId,
    message: data.message,
    error: error
  };
};

export const partyJoinFail = (message, error) => {
  return {
    type: actionTypes.PARTY_JOIN_FAIL,
    message: message,
    error: error
  };
};

export const joinParty = partyId => {
  return dispatch => {
    dispatch(partyJoinStart());

    let url = "/party/join/" + partyId;

    axios
      .get(url)
      .then(response => {
        console.log(response);
        dispatch(partyJoinSuccess(response.data, response.data.error));
      })
      .catch(err => {
        console.log(err);
        dispatch(partyJoinFail(err.response.data.error));
      });
  };
};

export const joinedParty = playerName => {
  return {
    type: actionTypes.PLAYER_JOINED_PARTY,
    playerName: playerName
  };
};

export const playerJoinedParty = playerName => {
  return dispatch => {
    dispatch(joinedParty(playerName));
  };
};
