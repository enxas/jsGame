import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Navbar from "../../containers/Navbar/Navbar";
import Wrap from "../Wrap/Wrap";
import socketIOClient from "socket.io-client";
import * as actions from "../../store/actions/index";
import toastr from "toastr";
import { withRouter } from "react-router-dom";

class Layout extends Component {
  state = {
    visitorCount: 0
  };
  componentDidMount() {
    if (this.props.socket === null) {
      const socket = socketIOClient("http://127.0.0.1:4001");
      this.props.onSetSocketinStore(socket);
      console.log("Layout.js made socket connection");

      socket.on("visitorCountUpdated", data =>
        this.setState({ visitorCount: data })
      );

      socket.on("signInResponse", data => {
        this.props.onSignIn(data);
        console.log(data.message);
      });

      socket.on("partyCreated", data => console.log(data.message));

      socket.on("playerJoinedParty", data => {
        toastr.options = {
          closeButton: true,
          progressBar: true
        };
        toastr.info("Player " + data.name + " joined your party!", "Party");
        this.props.onPlayerJoinedParty(data.name);
        console.log("player joined my party");
      });

      socket.on("playerLeftParty", data => {
        toastr.options = {
          closeButton: true,
          progressBar: true
        };
        toastr.info("Player " + data.name + " left your party!", "Party");
        this.props.onPlayerLeftParty(data.name);
        console.log("player left my party");
      });

      socket.on("partyDisbanded", () => {
        toastr.options = {
          closeButton: true,
          progressBar: true
        };
        toastr.info("Party leader disbanded party!", "Party");
        this.props.onPartyDisbanded();
        console.log("party disbanded");
      });

      socket.on("leaderEnteredBattlefield", data => {
        toastr.options = {
          closeButton: true,
          progressBar: true
        };
        toastr.info("Party leader entered battlefield!", "Party");
        this.props.onLeaderEnteredBattlefield(data);
      });

      socket.on("onConnectedToBattlefield", data => {
        toastr.options = {
          closeButton: true,
          progressBar: true
        };
        toastr.info(
          "Player " + data.userId + " connected to battlefield!",
          "Party"
        );
        this.props.onPlayerEnteredBattlefield(data.userId);
        console.log("player connected to battlefield");
      });

      socket.on("onDisconnectedFromBattlefield", data => {
        toastr.options = {
          closeButton: true,
          progressBar: true
        };
        toastr.info(
          "Player " + data.userId + " connected to battlefield!",
          "Party"
        );
        this.props.onPlayerLeftBattlefield(data.userId);
        console.log("player disconnected from battlefield");
      });

      // socket.on("getMapData", data => {
      //   this.props.onGetMapData(data);
      //   console.log("got map data");
      // });
    }

    //  socket.on("FromAPI", data => this.setState({ response: data }));
    // socket.emit('change color', 'red') ;
  }

  render() {
    let redirect = null;
    if (this.props.redirectToBattlefield !== false) {
      console.log("REDIRECTED");
      this.props.history.push("/battlefield");
      // redirect = <Redirect to="/battlefield" />;
    }
    return (
      <Wrap>
        {redirect}
        <Navbar visitorCount={this.state.visitorCount} />

        <main>{this.props.children}</main>
      </Wrap>
    );
  }
}

const mapStateToProps = state => {
  return {
    socket: state.signIn.socket,
    field: state.battlefield.field,
    redirectToBattlefield: state.battlefield.redirectToBattlefield
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetSocketinStore: socket => dispatch(actions.setSocketinStore(socket)),
    onPlayerJoinedParty: name => dispatch(actions.playerJoinedParty(name)),
    onPlayerLeftParty: name => dispatch(actions.playerLeftParty(name)),
    onPartyDisbanded: () => dispatch(actions.partyDisbanded()),
    onSignIn: data => dispatch(actions.signIn(data)),
    onLeaderEnteredBattlefield: data =>
      dispatch(actions.leaderEnteredBattlefield(data)),
    onPlayerEnteredBattlefield: data =>
      dispatch(actions.playerEnteredBattlefield(data)),
    onPlayerLeftBattlefield: data =>
      dispatch(actions.playerLeftBattlefield(data))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout));
