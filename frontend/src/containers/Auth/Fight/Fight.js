import React, { Component } from "react";
import { connect } from "react-redux";
// import * as actions from "../../../store/actions/index";
import background from "../../../assets/images/background.png";
import ReadyScreen from "../../ReadyScreen/ReadyScreen";

import "./style.css";

class List extends Component {
  state = {
    chat: ["Welcome and Thank You for playing!"],
    loaded: {
      background: false,
      actors: false
    },
    actorImages: null,
    actorSpacing: 0,
    enemies: {
      enemy1: {
        atk: 50,
        def: 20,
        hpFull: 100,
        hpLeft: 100
      },
      enemy2: {
        atk: 45,
        def: 15,
        hpFull: 100,
        hpLeft: 100
      },
      enemy3: {
        atk: 40,
        def: 10,
        hpFull: 100,
        hpLeft: 100
      }
    },
    players: {
      player1: {
        atk: 35,
        def: 20,
        hpFull: 100,
        hpLeft: 100
      },
      player2: {
        atk: 40,
        def: 20,
        hpFull: 100,
        hpLeft: 100
      }
    },
    decks: [{ id: 0, name: "Default" }, { id: 1, name: "Custom" }],
    heroes: ["hero1", "hero2", "hero3"],
    showReadyScreen: false
  };
  componentDidMount() {
    this.loadImages();
  }

  handleBackgroundLoad(e) {
    const actorSpacing = e.target.offsetWidth / 8;
    console.log(`spacing: ${actorSpacing}`);
    console.log(e.target.offsetHeight);
    console.log(e.target.offsetWidth);

    this.setState(() => ({
      actorSpacing: actorSpacing,
      loaded: { ...this.state.loaded, background: true }
    }));
  }

  loadImages() {
    const that = this;
    const tiles = ["player2.png", "player2.png", "player2.png"]; // getUniqueArray(ground) ["0", "1", "3"]

    var promiseOfAllImages = function(tiles) {
      // Wait until ALL images are loaded
      return Promise.all(
        tiles.map(function(t) {
          // Load each tile, and "resolve" when done
          return new Promise(function(resolve) {
            var img = new Image();
            img.src = require(`../../../assets/images/${t}`);

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
      that.setState(() => ({
        actorImages: allImages,
        loaded: { ...that.state.loaded, actors: true }
      }));
    });
  }

  drawActors() {
    // there are 8 slots on the map: 3 for players, 4 for enemies, 1 between players and enemies to sepparate them
    const actors = [];
    // draw player in spot 3, then spot 2, then spot 1
    let playerSpots = 2;
    for (let player in this.state.players) {
      actors.push(
        <img
          key={player}
          className="zoom"
          alt=""
          width={this.state.actorSpacing}
          src={this.state.actorImages[0].src}
          style={{
            position: "absolute",
            top: "30px",
            left: playerSpots * this.state.actorSpacing + "px"
          }}
        />
      );
      playerSpots -= 1;
    }

    // draw enemies in spot 5, then spot 6, then spot 7, then spot 8
    let enemySpots = 4;
    for (let enemy in this.state.enemies) {
      actors.push(
        <img
          key={enemy}
          className="zoom"
          alt=""
          width={this.state.actorSpacing}
          src={this.state.actorImages[0].src}
          style={{
            position: "absolute",
            top: "30px",
            left: enemySpots * this.state.actorSpacing + "px"
          }}
        />
      );
      enemySpots += 1;
    }

    console.log("was here");

    return actors;
  }

  render() {
    let actors = null;

    if (
      this.state.loaded.background === true &&
      this.state.loaded.actors === true
    ) {
      actors = this.drawActors();
    }
    return (
      <React.Fragment>
        <ReadyScreen
          show={this.state.showReadyScreen}
          decks={this.state.decks}
          heroes={this.state.heroes}
        />
        <div className="my-flex-row">
          <div className="field_side">
            <div
              className="canvas_wrapper"
              style={{ position: "relative", top: 0, left: 0 }}
            >
              <img
                alt=""
                src={background}
                style={{
                  position: "relative",
                  top: 0,
                  left: 0,
                  height: "350px",
                  width: "100%"
                }}
                onLoad={e => this.handleBackgroundLoad(e)}
              />
              {actors}
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
                <input
                  id="chat-input"
                  type="text"
                  style={{ width: 60 + "%" }}
                />
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
                      Turn {this.state.turnNo} Multipliers
                    </th>
                  </tr>
                  <tr>
                    <th
                      style={{ textAlign: "center", backgroundColor: "#eee" }}
                    >
                      Players
                    </th>
                    <th
                      style={{ textAlign: "center", backgroundColor: "#eee" }}
                    >
                      Enemies
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
                    />
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
                onClick={() =>
                  this.setState(prevState => ({
                    showReadyScreen: true
                  }))
                }
                style={{ float: "right" }}
              >
                SHOW MODAL
              </button>
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
                    <td style={{ textAlign: "left" }}>Name</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "left", fontWeight: "bold" }}>
                      Health
                    </td>
                    <td style={{ textAlign: "left" }}>100 / 100</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "left", fontWeight: "bold" }}>
                      Attack
                    </td>
                    <td style={{ textAlign: "left" }}>50</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "left", fontWeight: "bold" }}>
                      Defence
                    </td>
                    <td style={{ textAlign: "left" }}>30</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "left", fontWeight: "bold" }}>
                      Position
                    </td>
                    <td style={{ textAlign: "left" }}>[ 5:2 ]</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "left", fontWeight: "bold" }}>
                      Action Points
                    </td>
                    <td style={{ textAlign: "left" }}>10</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
