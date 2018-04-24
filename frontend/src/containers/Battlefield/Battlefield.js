import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import "../../assets/css/battlefield.css";

class Battlefield extends Component {
  constructor(props) {
    super(props);
    this.chatboxRef = React.createRef();
  }

  state = {
    windowHeight: 0,
    allLoadedImages: null,
    chat: ["Welcome and Thank You for playing!"]
  };
  // requestAnimationFrame();
  drawField(fieldArr) {
    const componentTHIS = this;

    const windowWidth = window.innerWidth - 300;
    const windowHeight = window.innerHeight - 200;

    this.setState(() => ({
      windowHeight: windowHeight + 60
    }));

    const worldWidth = 25;
    const worldHeight = 16;
    const tileWidth = 32;
    const tileHeight = 32;

    const canvas1 = this.refs.canvas1;

    canvas1.width = worldWidth * tileWidth; // windowWidth
    canvas1.height = worldHeight * tileHeight; // windowHeight

    const ctx1 = canvas1.getContext("2d");

    ///////////////////////////////////////////
    const ground = ["0", "1", "player", "enemy"];
    // 0 => grass, 1 => rock
    var tiles = ground; // getUniqueArray(ground) ["0", "1", "3"]

    var promiseOfAllImages = function(tiles) {
      // Wait until ALL images are loaded
      return Promise.all(
        tiles.map(function(t) {
          // Load each tile, and "resolve" when done
          return new Promise(function(resolve) {
            var img = new Image();
            img.src = require(`../../assets/images/${t}.png`);
            // img.src = "../../assets/images/" + t + ".png";
            img.onload = function() {
              // Image has loaded... resolve the promise!
              resolve(img);
            };
          });
        })
      );
    };

    promiseOfAllImages(tiles).then(function(allImages) {
      console.log("All images are loaded!", allImages); // [Img, Img, Img]
      componentTHIS.state.allLoadedImages = allImages;
      draw(tiles, allImages, ground);
    });

    function draw(tiles, images, ground) {
      console.log(fieldArr);
      var tileW = 32;
      var tileH = 32;
      for (var x = 0; x < worldWidth; x++) {
        for (var y = 0; y < worldHeight; y++) {
          ctx1.drawImage(images[fieldArr[x][y]], x * tileW, y * tileH);
        }
      }
      // emit this when assets are loaded and drawn then player conects to battlefield
      componentTHIS.props.socket.emit("connectedToBattlefield");
    }
  }

  layer2Loop() {
    const worldWidth = 25;
    const worldHeight = 16;
    const tileWidth = 32;
    const tileHeight = 32;

    const canvas2 = this.refs.canvas2;
    const globalTHIS = this;

    if (
      canvas2.width !== worldWidth * tileWidth &&
      canvas2.height !== worldHeight * tileHeight
    ) {
      canvas2.width = worldWidth * tileWidth; // windowWidth
      canvas2.height = worldHeight * tileHeight; // windowHeight
    }

    const ctx2 = canvas2.getContext("2d");

    var tileW = 32;
    var tileH = 32;

    setInterval(function() {
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

      // draw players
      for (let playerId in globalTHIS.props.battlefieldData.actors.players) {
        if (
          globalTHIS.props.battlefieldData.actors.players[playerId]
            .isConnected === true
        ) {
          ctx2.drawImage(
            globalTHIS.state.allLoadedImages[2],
            globalTHIS.props.battlefieldData.actors.players[playerId].x * tileW,
            globalTHIS.props.battlefieldData.actors.players[playerId].y * tileH
          );
        }
      }

      // draw enemies
      for (let enemyId in globalTHIS.props.battlefieldData.actors.enemies) {
        ctx2.drawImage(
          globalTHIS.state.allLoadedImages[3],
          globalTHIS.props.battlefieldData.actors.enemies[enemyId].x * tileW,
          globalTHIS.props.battlefieldData.actors.enemies[enemyId].y * tileH
        );
      }
    }, 200);
  }

  componentDidMount() {
    console.log(` Battlefield.js componentDidMount`);

    this.props.socket.on("onActorMovedInBattlefield", data => {
      if (data.directionMoved !== "stay") {
        if (data.actorId === this.props.userId) {
          console.log(`USER ID ARE EQUAL`);
          data.isItMeMoving = true;
        } else {
          data.isItMeMoving = false;
        }

        if (data.whoMoved === "player") {
          data.x = this.props.battlefieldData.actors.players[data.actorId].x;
          data.y = this.props.battlefieldData.actors.players[data.actorId].y;
        } else if (data.whoMoved === "enemy") {
          data.x = this.props.battlefieldData.actors.enemies[data.actorId].x;
          data.y = this.props.battlefieldData.actors.enemies[data.actorId].y;
        }

        this.props.onMovedInBattlefield(data);
      }
      let addedToChat = [
        ...this.state.chat,
        "Actor " + data.actorId + " moved " + data.directionMoved + "!"
      ];

      this.setState(() => ({
        chat: addedToChat
      }));

      // make chat scroll
      this.chatboxRef.current.scrollTop = 999999;
    });

    this.props.onRedirectedToBattlefield();
    this.drawField(this.props.field);
    this.layer2Loop();
  }

  componentWillUnmount() {
    this.props.socket.emit("disconnectedFromBattlefield");
    this.props.socket.off("onActorMovedInBattlefield");
  }

  drawLayer2(images, x, y, spriteId) {
    const worldWidth = 25;
    const worldHeight = 16;
    const tileWidth = 32;
    const tileHeight = 32;

    const canvas2 = this.refs.canvas2;

    if (
      canvas2.width !== worldWidth * tileWidth &&
      canvas2.height !== worldHeight * tileHeight
    ) {
      canvas2.width = worldWidth * tileWidth; // windowWidth
      canvas2.height = worldHeight * tileHeight; // windowHeight
    }

    const ctx2 = canvas2.getContext("2d");

    var tileW = 32;
    var tileH = 32;

    ctx2.drawImage(images[spriteId], x * tileW, y * tileH);
  }

  handleMoveButtonPress = moveDirection => {
    console.log(`moved ${moveDirection}`);

    this.props.socket.emit("movedInBattlefield", {
      direction: moveDirection
    });
  };

  handleTurnEnding = () => {
    console.log(`pressed end turn`);

    this.props.socket.emit("endedTurn");
  };

  render() {
    return (
      <div className="my-flex-row">
        <div className="field_side">
          <div className="canvas_wrapper" style={{ height: 520 + "px" }}>
            <canvas ref="canvas1" style={{ width: "640", height: "360" }} />
            <canvas ref="canvas2" style={{ width: "640", height: "360" }} />
          </div>

          <div>
            <div
              ref={this.chatboxRef}
              style={{
                width: 60 + "%",
                height: 140 + "px",
                overflow: "auto"
              }}
            >
              {this.state.chat.map((object, i) => {
                return <div key={i}>{object}</div>;
              })}
            </div>

            <form id="chat-form">
              <input id="chat-input" type="text" style={{ width: 60 + "%" }} />
            </form>
          </div>
        </div>
        <div className="info_side">
          <div>
            <table style={{ width: 100 + "%" }}>
              <thead>
                <tr>
                  <th
                    colSpan="3"
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      textAlign: "center"
                    }}
                  >
                    Multipliers
                  </th>
                </tr>
                <tr>
                  <th style={{ textAlign: "center", backgroundColor: "#eee" }}>
                    Player
                  </th>
                  <th style={{ textAlign: "center", backgroundColor: "#eee" }}>
                    Enemy
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "1.5em"
                    }}
                  >
                    4
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "1.5em"
                    }}
                  >
                    6
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <center>
              <table style={{ width: 100 + "%" }}>
                <thead>
                  <tr>
                    <th
                      colSpan="3"
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        textAlign: "center"
                      }}
                    >
                      Navigation
                    </th>
                  </tr>
                </thead>
              </table>
              <table style={{ width: 50 + "%" }}>
                <tbody>
                  <tr>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.5em"
                      }}
                    />
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.5em"
                      }}
                    >
                      <button
                        onClick={() => this.handleMoveButtonPress("up")}
                        disabled={this.props.amIMovingInBattlefield}
                      >
                        UP
                      </button>
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.5em"
                      }}
                    />
                  </tr>
                  <tr>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.5em"
                      }}
                    >
                      <button
                        onClick={() => this.handleMoveButtonPress("left")}
                        disabled={this.props.amIMovingInBattlefield}
                      >
                        LEFT
                      </button>
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.5em"
                      }}
                    />
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.5em"
                      }}
                    >
                      <button
                        onClick={() => this.handleMoveButtonPress("right")}
                        disabled={this.props.amIMovingInBattlefield}
                      >
                        RIGHT
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.5em"
                      }}
                    />
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.5em"
                      }}
                    >
                      <button
                        onClick={() => this.handleMoveButtonPress("down")}
                        disabled={this.props.amIMovingInBattlefield}
                      >
                        DOWN
                      </button>
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.5em"
                      }}
                    />
                  </tr>
                </tbody>
              </table>
            </center>
            <button
              onClick={() => this.handleTurnEnding()}
              style={{ float: "right" }}
            >
              END TURN
            </button>
          </div>

          <div>
            <table style={{ width: 100 + "%" }}>
              <thead>
                <tr>
                  <th
                    colSpan="3"
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      textAlign: "center"
                    }}
                  >
                    Information
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th style={{ textAlign: "left", fontWeight: "bold" }}>
                    Name
                  </th>
                  <td style={{ textAlign: "left" }}>Ninja</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left", fontWeight: "bold" }}>
                    Health
                  </td>
                  <td style={{ textAlign: "left" }}>6 / 20</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left", fontWeight: "bold" }}>
                    Attack
                  </td>
                  <td style={{ textAlign: "left" }}>12</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left", fontWeight: "bold" }}>
                    Defence
                  </td>
                  <td style={{ textAlign: "left" }}>8</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left", fontWeight: "bold" }}>
                    Position
                  </td>
                  <td style={{ textAlign: "left" }}>[ 5:8 ]</td>
                </tr>
              </tbody>
            </table>
            <button>ATTACK</button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.signIn.userId,
    loading: state.party.loading,
    error: state.party.error,
    message: state.party.message,
    socket: state.signIn.socket,
    field: state.battlefield.field,
    amIMovingInBattlefield: state.battlefield.amIMovingInBattlefield,
    redirectToBattlefield: state.battlefield.redirectToBattlefield,
    battlefieldData: state.battlefield.battlefieldData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRedirectedToBattlefield: () =>
      dispatch(actions.redirectedToBattlefield()),
    onMovedInBattlefield: data => dispatch(actions.movedInBattlefield(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Battlefield);
