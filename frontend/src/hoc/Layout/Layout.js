import React, { Component } from "react";
import { connect } from "react-redux";
import Navbar from "../../containers/Navbar/Navbar";
import Wrap from "../Wrap/Wrap";
import socketIOClient from "socket.io-client";
import * as actions from "../../store/actions/index";
import toastr from "toastr";
import { withRouter } from "react-router-dom";
import ReadyScreen from "../../containers/ReadyScreen/ReadyScreen";

class Layout extends Component {
  state = {
    visitorCount: 0,
    decks: [{ id: 0, name: "Default" }, { id: 1, name: "Custom" }],
    heroes: ["hero1", "hero2", "hero3"],
    showReadyScreen: false,
    playerCount: 0,
    floorLvl: 0,
    readyPlayers: 0
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

      socket.on("leaderReadyPrompt", data => {
        toastr.options = {
          closeButton: true,
          progressBar: true
        };
        toastr.info("Party leader prompted Ready Screen!", "Party");
        console.log(data);

        this.setState(prevState => ({
          showReadyScreen: true,
          playerCount: data.memberCount,
          floorLvl: data.floorLvl
        }));
      });

      socket.on("r_memberNotReady", data => {
        toastr.options = {
          closeButton: true,
          progressBar: true
        };
        toastr.info("Player " + data.userId + " clicked Not Ready!", "Party");
        console.log(`Player clicked not ready ${data}`);

        this.setState(prevState => ({
          showReadyScreen: false
        }));
      });

      socket.on("r_memberReady", data => {
        console.log(`Player clicked ready:`);
        console.log(data);

        if (data.error === undefined) {
          this.setState(prevState => ({
            readyPlayers: prevState.readyPlayers + 1
          }));
        }
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
        console.log(
          "[Layout.js] Player " + data.userId + " connected to a battlefield!"
        );
      });

      socket.on("onDisconnectedFromBattlefield", data => {
        toastr.options = {
          closeButton: true,
          progressBar: true
        };
        toastr.info(
          "Player " + data.userId + " disconnected from battlefield!",
          "Party"
        );
        this.props.onPlayerLeftBattlefield(data.userId);
        console.log(
          "[Layout.js] Player " +
            data.userId +
            " disconnected from a battlefield!"
        );
      });

      // socket.on("onActorMovedInBattlefield", data => {
      //   toastr.options = {
      //     closeButton: true,
      //     progressBar: true
      //   };
      //   toastr.info(
      //     "Actor " + data.actorId + " moved " + data.directionMoved + "!",
      //     "Party"
      //   );

      //   if (data.directionMoved !== 'stay') {

      //   if (data.actorId === this.props.userId) {
      //     console.log(`USER ID ARE EQUAL`);
      //     data.isItMeMoving = true;
      //   } else {
      //     data.isItMeMoving = false;
      //   }

      //   if (data.whoMoved === "player") {
      //     data.x = this.props.battlefieldData.actors.players[data.actorId].x;
      //     data.y = this.props.battlefieldData.actors.players[data.actorId].y;
      //   } else if (data.whoMoved === "enemy") {
      //     data.x = this.props.battlefieldData.actors.enemies[data.actorId].x;
      //     data.y = this.props.battlefieldData.actors.enemies[data.actorId].y;
      //   }

      //   console.log("--------------");
      //   console.log(data);
      //   this.props.onMovedInBattlefield(data);
      // }
      //   console.log(
      //     "[Layout.js]  Actor " +
      //       data.actorId +
      //       " moved " +
      //       data.directionMoved +
      //       "!"
      //   );
      // });

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
        <ReadyScreen
          show={this.state.showReadyScreen}
          decks={this.state.decks}
          heroes={this.state.heroes}
          floor={this.state.floorLvl}
          playerCount={this.state.playerCount}
          readyPlayers={this.state.readyPlayers}
        />
        <Navbar visitorCount={this.state.visitorCount} />

        <main>{this.props.children}</main>
      </Wrap>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.signIn.userId,
    socket: state.signIn.socket,
    field: state.battlefield.field,
    redirectToBattlefield: state.battlefield.redirectToBattlefield,
    battlefieldData: state.battlefield.battlefieldData
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
      dispatch(actions.playerLeftBattlefield(data)),
    onMovedInBattlefield: data => dispatch(actions.movedInBattlefield(data))
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout));
