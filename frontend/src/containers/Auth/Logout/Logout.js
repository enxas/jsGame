import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "../../../store/actions/index";

class Logout extends Component {
  componentDidMount() {
    this.props.onLogout();
    this.props.socket.close();
  }

  render() {
    return <Redirect to="/" />;
  }
}

const mapStateToProps = state => {
  return {
    socket: state.signIn.socket
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(actions.logout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
