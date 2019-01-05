import React, { Component } from "react";
import { Route, withRouter, Redirect, Switch } from "react-router-dom";
import { connect } from "react-redux";

import LandingPage from "./containers/LandingPage/LandingPage";
import Signup from "./containers/Auth/Signup/Signup";
import Signin from "./containers/Auth/Signin/Signin";
import Logout from "./containers/Auth/Logout/Logout";
import Home from "./containers/Home/Home";
import CreateParty from "./containers/Party/Create/Create";
import LeaveParty from "./containers/Party/Leave/Leave";
import * as actions from "./store/actions/index";
import Layout from "./hoc/Layout/Layout";
import ListParty from "./containers/Party/List/List";
import Battlefield from "./containers/Battlefield/Battlefield";
import Fight from "./containers/Auth/Fight/Fight";

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }
  render() {
    let routes = (
      <Switch>
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={Signin} />
        <Route path="/fight" component={Fight} />
        <Route path="/" exact component={LandingPage} />
        <Redirect to="/" />
      </Switch>
    );

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/logout" component={Logout} />
          <Route path="/home" component={Home} />
          <Route path="/battlefield" component={Battlefield} />
          <Route path="/party/create" component={CreateParty} />
          <Route path="/party/leave" component={LeaveParty} />
          <Route path="/party/list" component={ListParty} />
          <Redirect to="/home" />
        </Switch>
      );
    }

    return (
      <div>
        <Layout>{routes}</Layout>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.signIn.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
