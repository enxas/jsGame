import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import toastr from "toastr";

class Create extends Component {
  state = {
    floorLevel: "1"
  };

  handleSubmit = () => {
    this.props.onPartyCreate(this.state.floorLevel);
  };

  handleFloorChange = event => {
    this.setState({ floorLevel: event.target.value });

    // this.setState(() => ({
    //   isButtonLoading: ["button", "is-success"],
    //   isAuthenticated: true
    // }));
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading === false && this.props.loading === true) {
      toastr.options = {
        closeButton: true,
        progressBar: true
      };
      toastr.info(nextProps.message, "Party");
    }
  }

  render() {
    let isButtonLoading = ["button", "is-link"];
    if (this.props.loading) {
      isButtonLoading = ["button", "is-link", "is-loading"];
    }
    // let redirect = null;
    // if (this.props.error === false) {
    //   redirect = <Redirect to="/home" />;
    // }
    return (
      <div className="columns is-mobile">
        <div className="column is-6 is-offset-one-quarter">
          <div className="field">
            <label className="label">Select Floor</label>
            <div className="control">
              <div className="select">
                <select
                  value={this.state.value}
                  onChange={this.handleFloorChange}
                >
                  <option value="1">Floor 1</option>
                  <option value="2">Floor 2</option>
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <div className="control">
              <button
                className={isButtonLoading.join(" ")}
                onClick={this.handleSubmit}
              >
                Create
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
    loading: state.party.loading,
    error: state.party.error,
    message: state.party.message
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPartyCreate: floorLevel => dispatch(actions.partyCreate(floorLevel))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);
