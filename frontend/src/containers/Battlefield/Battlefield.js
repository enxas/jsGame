import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

class Battlefield extends Component {
  state = {
    windowHeight: 0,
    allLoadedImages: null
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
    this.props.onRedirectedToBattlefield();
    this.drawField(this.props.field);
    this.layer2Loop();
  }

  componentWillUnmount() {
    this.props.socket.emit("disconnectedFromBattlefield");
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
      <div>
        <div className="container_row" style={{ position: "relative" }}>
          <div className="layer1" style={{ position: "absolute" }}>
            <canvas
              ref="canvas1"
              width={640}
              height={360}
              style={{ left: "0", top: "0", zIndex: "1" }}
            />
          </div>
          <div className="layer2" style={{ position: "absolute" }}>
            <canvas
              ref="canvas2"
              width={640}
              height={360}
              style={{ left: "0", top: "0", zIndex: "2" }}
            />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 570 + "px",
            left: 1 + "px"
          }}
        >
          <button
            onClick={() => this.handleMoveButtonPress("left")}
            disabled={this.props.amIMovingInBattlefield}
          >
            Left
          </button>
          <button
            onClick={() => this.handleMoveButtonPress("right")}
            disabled={this.props.amIMovingInBattlefield}
          >
            Right
          </button>
          <button
            onClick={() => this.handleMoveButtonPress("up")}
            disabled={this.props.amIMovingInBattlefield}
          >
            Up
          </button>
          <button
            onClick={() => this.handleMoveButtonPress("down")}
            disabled={this.props.amIMovingInBattlefield}
          >
            Down
          </button>
          <button onClick={() => this.handleTurnEnding()}>END TURN</button>
        </div>

        <div
          style={{
            position: "absolute",
            top: 600 + "px",
            left: 1 + "px"
          }}
        >
          <div
            id="chat-text"
            style={{
              width: 500 + "px",
              height: 100 + "px",
              overflowY: "scroll"
            }}
          >
            <div>Hello!</div>
          </div>

          <form id="chat-form">
            <input id="chat-input" type="text" style={{ width: 500 + "px" }} />
          </form>

          <div id="dialog" title="Basic dialog" />
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
    socket: state.signIn.socket,
    field: state.battlefield.field,
    amIMovingInBattlefield: state.battlefield.amIMovingInBattlefield,
    redirectToBattlefield: state.battlefield.redirectToBattlefield,
    battlefieldData: state.battlefield.battlefieldData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRedirectedToBattlefield: () => dispatch(actions.redirectedToBattlefield())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Battlefield);
