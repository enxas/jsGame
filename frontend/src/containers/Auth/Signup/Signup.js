import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

class Home extends Component {
  state = {
    email: "",
    password: "",
    repeatPassword: "",
    isButtonDisabled: true,
    isButtonLoading: ["button", "is-link"],
    isAuthenticated: false,
    validation: {
      email: false,
      password: false,
      repeatPassword: false
    },
    touched: {
      email: false,
      password: false,
      repeatPassword: false
    }
  };
  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState(
      {
        [name]: value
      },
      () => {
        if (name === "email") {
          const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

          let updatedValidation = this.state.validation;
          updatedValidation.email = re.test(String(value).toLowerCase())
            ? true
            : false;
          this.setState({ validation: updatedValidation });

          let updatedTouched = this.state.touched;
          updatedTouched.email = true;
          this.setState({ touched: updatedTouched });
        }

        if (name === "password") {
          if (value.length > 5 && value.length < 51) {
            let updatedValidation = this.state.validation;
            updatedValidation.password = true;
            this.setState({ validation: updatedValidation });
          } else {
            let updatedValidation = this.state.validation;
            updatedValidation.password = false;
            this.setState({ validation: updatedValidation });
          }
          if (this.state.password === this.state.repeatPassword) {
            let updatedValidation = this.state.validation;
            updatedValidation.repeatPassword = true;
            this.setState({ validation: updatedValidation });
          } else {
            let updatedValidation = this.state.validation;
            updatedValidation.repeatPassword = false;
            this.setState({ validation: updatedValidation });
          }
          let updatedTouched = this.state.touched;
          updatedTouched.password = true;
          this.setState({ touched: updatedTouched });
        }

        if (name === "repeatPassword") {
          if (this.state.password === this.state.repeatPassword) {
            let updatedValidation = this.state.validation;
            updatedValidation.repeatPassword = true;
            this.setState({ validation: updatedValidation });
          } else {
            let updatedValidation = this.state.validation;
            updatedValidation.repeatPassword = false;
            this.setState({ validation: updatedValidation });
          }
          let updatedTouched = this.state.touched;
          updatedTouched.repeatPassword = true;
          this.setState({ touched: updatedTouched });
        }
      }
    );
  };

  handleSubmit = () => {
    this.setState(() => ({
      isButtonLoading: ["button", "is-link", "is-loading"]
    }));
    const payload = {
      email: this.state.email,
      password: this.state.password,
      returnSecureToken: true
    };

    axios
      .post("http://localhost:4001/auth/signup", payload)
      .then(response => {
        console.log(response);

        this.setState(() => ({
          isButtonLoading: ["button", "is-success"],
          isAuthenticated: true
        }));
      })
      .catch(err => {
        console.log(err.response);
        this.setState(() => ({
          isButtonLoading: ["button", "is-danger"]
        }));
      });
  };

  render() {
    let isButtonDisabled = true;
    if (
      this.state.validation.email === true &&
      this.state.validation.password === true &&
      this.state.validation.repeatPassword === true
    ) {
      isButtonDisabled = false;
    } else {
      isButtonDisabled = true;
    }

    let authRedirect = null;
    if (this.state.isAuthenticated) {
      authRedirect = <Redirect to="/" />;
    }

    return (
      <div className="columns is-mobile">
        {authRedirect}
        <div className="column is-6 is-offset-one-quarter">
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input
                className={[
                  "input",
                  this.state.touched.email
                    ? this.state.validation.email ? "is-success" : "is-danger"
                    : null
                ].join(" ")}
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
                className={[
                  "input",
                  this.state.touched.password
                    ? this.state.validation.password
                      ? "is-success"
                      : "is-danger"
                    : null
                ].join(" ")}
                type="password"
                name="password"
                maxLength="60"
                onChange={this.handleInputChange}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Repeat Password</label>
            <div className="control">
              <input
                className={[
                  "input",
                  this.state.touched.repeatPassword
                    ? this.state.validation.repeatPassword
                      ? "is-success"
                      : "is-danger"
                    : null
                ].join(" ")}
                type="password"
                name="repeatPassword"
                maxLength="60"
                onChange={this.handleInputChange}
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <button
                className={this.state.isButtonLoading.join(" ")}
                onClick={this.handleSubmit}
                disabled={isButtonDisabled}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
