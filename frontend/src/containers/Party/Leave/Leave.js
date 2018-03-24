import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import toastr from "toastr";

class Leave extends Component {
  handleSubmit = () => {
    this.props.onPartyLeave();
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
            <div className="control">
              <button
                className={isButtonLoading.join(" ")}
                onClick={this.handleSubmit}
              >
                Leave Party
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.party.loading,
    error: state.party.error,
    message: state.party.message
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPartyLeave: floorLevel => dispatch(actions.partyLeave())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Leave);
