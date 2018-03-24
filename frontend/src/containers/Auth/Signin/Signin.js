import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";

class Signin extends Component {
  state = {
    email: "",
    password: ""
  };

  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  handleSubmit = () => {
    console.log("pressed login button");

    this.props.socket.emit("signIn", {
      email: this.state.email,
      password: this.state.password
    });

    // this.props.onSignIn(this.state.email, this.state.password);

    // this.setState(() => ({
    //   isButtonLoading: ["button", "is-success"],
    //   isAuthenticated: true
    // }));
  };

  render() {
    let isButtonLoading = ["button", "is-link"];
    if (this.props.loading) {
      isButtonLoading = ["button", "is-link", "is-loading"];
    }
    let errorMessage = null;

    if (this.props.error) {
      errorMessage = <p>{this.props.error}</p>;
    }

    let authRedirect = null;
    if (this.props.token) {
      authRedirect = <Redirect to="/home" />;
    }
    return (
      <div className="columns is-mobile">
        <div className="column is-6 is-offset-one-quarter">
          {authRedirect}
          {errorMessage}
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input
                className="input"
                type="email"
                name="email"
                maxLength="60"
                onChange={this.handleInputChange}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input
                className="input"
                type="password"
                name="password"
                maxLength="60"
                onChange={this.handleInputChange}
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <button
                className={isButtonLoading.join(" ")}
                onClick={this.handleSubmit}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// const mapStateToProps = state => {
//   return {
//     ings: state.ingredients,
//     price: state.totalPrice
//   };
// };

const mapStateToProps = state => {
  return {
    loading: state.signIn.loading,
    error: state.signIn.error,
    token: state.signIn.token,
    socket: state.signIn.socket
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSignIn: (email, password) => dispatch(actions.signIn(email, password))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
