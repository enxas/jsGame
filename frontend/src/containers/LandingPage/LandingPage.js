import React, { Component } from "react";
import { Link } from "react-router-dom";

class LandingPage extends Component {
  render() {
    return (
      <div className="columns is-mobile">
        <div className="column is-6 is-offset-one-quarter">
          <span style={{ fontSize: "200%" }}>
            Welcome to the best game ever made!!!
            <br />
            You probably want to <Link to="/signin">Sign In</Link> or{" "}
            <Link to="/signup">Sign Up</Link>
          </span>
        </div>
      </div>
    );
  }
}

export default LandingPage;
