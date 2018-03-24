import * as actionTypes from "./actionTypes";
import axios from "axios";

export const signInStart = () => {
  return {
    type: actionTypes.SIGNIN_START
  };
};

export const signInSuccess = (token, userId, partiesList) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;

  return {
    type: actionTypes.SIGNIN_SUCCESS,
    idToken: token,
    userId: userId,
    partiesList: partiesList
  };
};

export const signInFail = error => {
  return {
    type: actionTypes.SIGNIN_FAIL,
    error: error
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("userId");
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const signIn = data => {
  return dispatch => {
    dispatch(signInStart());
    // const authData = {
    //   email: email,
    //   password: password,
    //   returnSecureToken: true
    // };

    // let url = "/auth/signin";

    // axios
    //   .post(url, authData)
    //   .then(response => {

    if (data.error) {
      dispatch(signInFail(data.message));
    } else {
      const expirationDate = new Date(
        new Date().getTime() + data.expiresIn * 1000
      );
      localStorage.setItem("token", data.idToken);
      localStorage.setItem("expirationDate", expirationDate);
      localStorage.setItem("userId", data.localId);
      dispatch(signInSuccess(data.idToken, data.localId, data.partiesList));
      dispatch(checkAuthTimeout(data.expiresIn));
    }

    // })
    // .catch(err => {
    //   console.log(err);
    //   dispatch(signInFail(err.response.data.error));
    // });
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem("userId");
        dispatch(signInSuccess(token, userId));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};

export const setSocket = socket => {
  return {
    type: actionTypes.SET_SOCKET,
    socket: socket
  };
};

export const setSocketinStore = socket => {
  return dispatch => {
    dispatch(setSocket(socket));
  };
};
