import React, { Component } from "react";
import { connect } from "react-redux";
import Navbar from "../../containers/Navbar/Navbar";
import Wrap from "../Wrap/Wrap";
import socketIOClient from "socket.io-client";
import * as actions from "../../store/actions/index";
import toastr from "toastr";

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
    }

    //  socket.on("FromAPI", data => this.setState({ response: data }));
    // socket.emit('change color', 'red') ;
  }

  render() {
    return (
      <Wrap>
        <Navbar visitorCount={this.state.visitorCount} />

        <main>{this.props.children}</main>
      </Wrap>
    );
  }
}

const mapStateToProps = state => {
  return {
    socket: state.signIn.socket
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetSocketinStore: socket => dispatch(actions.setSocketinStore(socket)),
    onPlayerJoinedParty: name => dispatch(actions.playerJoinedParty(name)),
    onSignIn: data => dispatch(actions.signIn(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
