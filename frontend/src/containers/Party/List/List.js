import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import PartyTile from "../../../components/PartyTile/PartyTile";
import toastr from "toastr";

class List extends Component {
  state = {
    // response: false,
    // endpoint: "http://127.0.0.1:4001"
  };
  componentDidMount() {
    this.props.onGetPartiesList();
    console.log("List.js componentDidMount()");
    // const socket = socketIOClient(this.state.endpoint);
    //  socket.on("FromAPI", data => this.setState({ response: data }));
    // socket.emit('change color', 'red') ;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading === false && this.props.loading === true) {
      toastr.options = {
        closeButton: true,
        progressBar: true
      };
      toastr.info(nextProps.message, "Party");
    }
  }

  partyJoinHandler = partyId => {
    this.props.onJoinParty(partyId);
  };

  render() {
    return (
      <div className="columns is-mobile">
        <div className="column is-6 is-offset-one-quarter">
          Parties that are Looking for Players:
          <hr />
          {this.props.partiesList
            ? this.props.partiesList.map(ctrl => (
                <PartyTile
                  key={ctrl._id}
                  creator={ctrl.creator}
                  floor={ctrl.floor}
                  members={ctrl.members}
                  clicked={() => this.partyJoinHandler(ctrl._id)}
                />
              ))
            : null}
          {/*
          <div style={{ textAlign: "center" }}>
            {this.state.response ? (
              <p>The temperature in Florence is: {this.state.response} °F</p>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.party.loading,
    error: state.party.error,
    message: state.party.message,
    partiesList: state.party.list
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetPartiesList: () => dispatch(actions.getPartiesList()),
    onJoinParty: partyId => dispatch(actions.joinParty(partyId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
