import * as actionTypes from "./actionTypes";
import axios from "axios";

export const getBattlefieldData = data => {
  return {
    type: actionTypes.GET_MAP_DATA,
    field: data.field
  };
};

export const enteredBattlefield = () => {
  return dispatch => {
    let url = "/battlefield";

    axios
      .get(url)
      .then(response => {
        dispatch(getBattlefieldData(response.data));
      })
      .catch(err => {
        console.log(err);
        // dispatch(partyCreateFail(err.response.data.message));
      });
  };
};

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
