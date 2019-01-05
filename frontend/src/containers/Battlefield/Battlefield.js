import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import "../../assets/css/battlefield.css";
import spinner from "../../assets/images/spinner.svg";

import skill0 from "../../assets/images/skill0.png";
import skill1 from "../../assets/images/skill1.png";
import skill2 from "../../assets/images/skill2.png";
import skill3 from "../../assets/images/skill3.png";
import skill4 from "../../assets/images/skill4.png";
import skill5 from "../../assets/images/skill5.png";

const skillPatterns = require("../../utils/skillPatterns");
const helpers = require("../../utils/helpers");

class Battlefield extends Component {
  constructor(props) {
    super(props);
    this.chatboxRef = React.createRef();
  }

  state = {
    windowHeight: 0,
    allLoadedImages: null,
    chat: ["Welcome and Thank You for playing!"],
    turnNo: 1,
    playersMultiplier: "0%",
    enemiesMultiplier: "0%",
    showSpinner: false,
    skillInRange: false,
    skillSelected: 0,
    skillDirection: null,
    skillDistance: null,
    skillRange: null,
    mousePos: {
      x: null,
      y: null
    },
    info: {
      name: "",
      hpLeft: 0,
      hpFull: 0,
      attack: "",
      defence: "",
      positionX: 0,
      positionY: 0,
      actionPoints: 0
    }
  };
  // requestAnimationFrame();
  drawField(fieldArr) {
    const componentTHIS = this;

    // const windowWidth = window.innerWidth - 300;
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
    const ground = ["0.png", "1.png", "player.png", "enemy.png"];
    // 0 => grass, 1 => rock
    var tiles = ground; // getUniqueArray(ground) ["0", "1", "3"]

    var promiseOfAllImages = function(tiles) {
      // Wait until ALL images are loaded
      return Promise.all(
        tiles.map(function(t) {
          // Load each tile, and "resolve" when done
          return new Promise(function(resolve) {
            var img = new Image();
            img.src = require(`../../assets/images/${t}`);
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
    const self = this;

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
      for (let playerId in self.props.battlefieldData.actors.players) {
        if (
          self.props.battlefieldData.actors.players[playerId].isConnected ===
          true
        ) {
          ctx2.drawImage(
            self.state.allLoadedImages[2],
            self.props.battlefieldData.actors.players[playerId].x * tileW,
            self.props.battlefieldData.actors.players[playerId].y * tileH
          );
        }
      }

      // draw enemies
      for (let enemyId in self.props.battlefieldData.actors.enemies) {
        ctx2.drawImage(
          self.state.allLoadedImages[3],
          self.props.battlefieldData.actors.enemies[enemyId].x * tileW,
          self.props.battlefieldData.actors.enemies[enemyId].y * tileH
        );
      }

      // if i have selected a skill and hover over canvas
      if (
        self.state.skillSelected !== 0 &&
        self.state.mousePos.x !== 0 &&
        self.state.mousePos.y !== 0
      ) {
        if (self.state.skillDistance === "far" && self.state.skillInRange) {
          const patterns = skillPatterns[self.state.skillSelected].pattern;

          for (let pattern of patterns) {
            ctx2.fillStyle = "rgba(225,225,225,0.5)";
            ctx2.fillRect(
              (pattern[0] + self.state.mousePos.x) * tileW,
              (pattern[1] + self.state.mousePos.y) * tileH,
              tileW,
              tileH
            );
          }
        } else if (
          self.state.skillDistance === "close" &&
          self.state.skillDirection !== null
        ) {
          const myX =
            self.props.battlefieldData.actors.players[self.props.userId].x;
          const myY =
            self.props.battlefieldData.actors.players[self.props.userId].y;

          if (self.state.skillSelected !== 0) {
            const rotatedPatterns = helpers.rotate(
              skillPatterns[self.state.skillSelected].pattern,
              self.state.skillDirection,
              myX,
              myY
            );

            for (let pattern of rotatedPatterns) {
              ctx2.fillStyle = "rgba(225,225,225,0.5)";
              ctx2.fillRect(
                pattern[0] * tileW,
                pattern[1] * tileH,
                tileW,
                tileH
              );
            }
          }
        }
      }

      /////////////////////////////////////////////////
    }, 200);
  }

  componentDidMount() {
    console.log(` Battlefield.js componentDidMount`);

    this.props.socket.on("onPlayerEndedTurn", data => {
      this.props.onEndedTurn(data);

      let addedToChat = [
        ...this.state.chat,
        "Actor " + data.actorId + " ended turn"
      ];

      this.setState(() => ({
        chat: addedToChat
      }));

      // make chat scroll
      this.chatboxRef.current.scrollTop = 999999;
    });

    this.props.socket.on("turnEnded", data => {
      console.log("TURN ENDED");
      console.log(data);

      this.setState(() => ({
        showSpinner: true
      }));

      let formattedPlayerMultipl, formattedEnemyMultipl;
      if (data.playersMultiplier > 0) {
        formattedPlayerMultipl = "+" + data.playersMultiplier + "%";
      } else if (data.playersMultiplier < 0) {
        formattedPlayerMultipl = data.playersMultiplier + "%";
      } else {
        formattedPlayerMultipl = data.playersMultiplier + "%";
      }

      if (data.enemiesMultiplier > 0) {
        formattedEnemyMultipl = "+" + data.enemiesMultiplier + "%";
      } else if (data.enemiesMultiplier < 0) {
        formattedEnemyMultipl = data.enemiesMultiplier + "%";
      } else {
        formattedEnemyMultipl = data.enemiesMultiplier + "%";
      }

      // after turn starts show spinner for 750 ms then display new multipliers and turn
      setTimeout(
        function() {
          this.setState(() => ({
            turnNo: data.newTurn,
            playersMultiplier: formattedPlayerMultipl,
            enemiesMultiplier: formattedEnemyMultipl,
            showSpinner: false
          }));
        }.bind(this),
        650
      );
    });

    this.props.socket.on("onPlayerAttackedEnemy", data => {
      console.log("onPlayerAttackedEnemy:");
      console.log(data);
      this.props.onPlayerAttackedEnemy(data);

      for (let logEntry in data.combatLog) {
        let addedToChat = [
          ...this.state.chat,
          "Actor " +
            data.combatLog[logEntry].attackingActor +
            " did " +
            data.combatLog[logEntry].damage +
            " damage to " +
            data.combatLog[logEntry].attackedActor +
            " with " +
            skillPatterns[data.combatLog[logEntry].skillId].name +
            " " +
            data.combatLog[logEntry].attackPts +
            " atk vs " +
            data.combatLog[logEntry].defencePts +
            " def " +
            "!"
        ];

        this.setState(() => ({
          chat: addedToChat
        }));
      }

      // make chat scroll
      this.chatboxRef.current.scrollTop = 9999999;
    });

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
    this.props.socket.off("onPlayerAttackedEnemy");
    this.props.socket.off("onPlayerEndedTurn");
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

  handleSkillUnselecting = () => {
    this.setState(() => ({
      skillInRange: false,
      skillSelected: 0,
      skillDirection: null,
      skillDistance: null,
      skillRange: null
    }));

    console.log(`Skills unselected`);
  };

  handleSkillPress = skillId => {
    this.setState(() => ({
      skillSelected: skillId,
      skillDistance: skillPatterns[skillId].distance,
      skillRange: skillPatterns[skillId].range
    }));

    console.log(`Selected skill id: ${skillId}`);
  };

  handleTurnEnding = () => {
    console.log(`pressed end turn`);

    this.props.socket.emit("endedTurn");
  };

  handleCanvas2Click = e => {
    let x, y;
    const canvas2 = this.refs.canvas2;

    let canvas2_rect = canvas2.getBoundingClientRect();
    x =
      (e.clientX - canvas2_rect.left) /
      (canvas2_rect.right - canvas2_rect.left) *
      canvas2.width;
    y =
      (e.clientY - canvas2_rect.top) /
      (canvas2_rect.bottom - canvas2_rect.top) *
      canvas2.height;

    // return tile x,y that we clicked
    var cell = [Math.floor(x / 32), Math.floor(y / 32)];

    // if no skill selected then display tile information else attack
    if (this.state.skillSelected === 0) {
      let updateInfoState = {
        name: "",
        hpLeft: 0,
        hpFull: 0,
        attack: "",
        defence: "",
        positionX: cell[0],
        positionY: cell[1],
        actionPoints: 0
      };

      for (let player in this.props.battlefieldData.actors.players) {
        if (
          this.props.battlefieldData.actors.players[player].x === cell[0] &&
          this.props.battlefieldData.actors.players[player].y === cell[1]
        ) {
          updateInfoState = {
            name: player,
            hpLeft: this.props.battlefieldData.actors.players[player].hpLeft,
            hpFull: this.props.battlefieldData.actors.players[player].hpFull,
            attack: this.props.battlefieldData.actors.players[player].attack,
            defence: this.props.battlefieldData.actors.players[player].defence,
            positionX: this.props.battlefieldData.actors.players[player].x,
            positionY: this.props.battlefieldData.actors.players[player].y,
            actionPoints: this.props.battlefieldData.actors.players[player]
              .actionPoints
          };
        }
      }

      for (let enemy in this.props.battlefieldData.actors.enemies) {
        if (
          this.props.battlefieldData.actors.enemies[enemy].x === cell[0] &&
          this.props.battlefieldData.actors.enemies[enemy].y === cell[1]
        ) {
          updateInfoState = {
            name: enemy,
            hpLeft: this.props.battlefieldData.actors.enemies[enemy].hpLeft,
            hpFull: this.props.battlefieldData.actors.enemies[enemy].hpFull,
            attack: this.props.battlefieldData.actors.enemies[enemy].attack,
            defence: this.props.battlefieldData.actors.enemies[enemy].defence,
            positionX: this.props.battlefieldData.actors.enemies[enemy].x,
            positionY: this.props.battlefieldData.actors.enemies[enemy].y,
            actionPoints: this.props.battlefieldData.actors.enemies[enemy]
              .actionPoints
          };
        }
      }

      this.setState(() => ({
        info: updateInfoState
      }));
    } else {
      // if skill is selected and in range then perform skill on selected tile
      if (this.state.skillInRange || this.state.skillDirection) {
        console.log(
          `Attacked position x: ${cell[0]} y: ${cell[1]} skillId: ${
            this.state.skillSelected
          }`
        );
        this.props.socket.emit("playerAttackedEnemy", {
          // enemyId: this.state.info.name,
          x: cell[0],
          y: cell[1],
          skillId: this.state.skillSelected,
          skillDirection: this.state.skillDirection
        });

        this.handleSkillUnselecting();
      }
    }
  };

  handleCanvas2MouseLeave = e => {
    console.log("mouse left canvas");
    this.setState(() => ({
      mousePos: { ...this.state.mousePos, x: null, y: null }
    }));
  };

  handleCanvas2MouseMove = e => {
    if (this.state.skillSelected !== 0) {
      let x, y;
      const canvas2 = this.refs.canvas2;

      let canvas2_rect = canvas2.getBoundingClientRect();
      x =
        (e.clientX - canvas2_rect.left) /
        (canvas2_rect.right - canvas2_rect.left) *
        canvas2.width;
      y =
        (e.clientY - canvas2_rect.top) /
        (canvas2_rect.bottom - canvas2_rect.top) *
        canvas2.height;

      const myX = this.props.battlefieldData.actors.players[this.props.userId]
        .x;
      const myY = this.props.battlefieldData.actors.players[this.props.userId]
        .y;

      // return tile x,y that user mouseover
      var cell = [Math.floor(x / 32), Math.floor(y / 32)];

      if (cell[0] !== this.state.mousePos.x) {
        // console.log(`updated mousePos.x=${cell[0]}`);
        // Math.hypot(x2-x1, y2-y1) calculates distance between two points
        const distance = Math.floor(Math.hypot(cell[0] - myX, cell[1] - myY));
        let inRange = false;
        console.log(`Distance: ${distance}`);

        if (this.state.skillRange >= distance) {
          inRange = true;
        }

        this.setState(() => ({
          skillInRange: inRange,
          mousePos: { ...this.state.mousePos, x: cell[0] }
        }));
      }
      if (cell[1] !== this.state.mousePos.y) {
        // console.log(`updated mousePos.y=${cell[1]}`);
        const distance = Math.floor(Math.hypot(cell[0] - myX, cell[1] - myY));
        let inRange = false;
        console.log(`Distance: ${distance}`);

        if (this.state.skillRange >= distance) {
          inRange = true;
        }
        this.setState(() => ({
          skillInRange: inRange,
          mousePos: { ...this.state.mousePos, y: cell[1] }
        }));
      }

      if (myX + 1 === cell[0] && myY === cell[1]) {
        if (this.state.skillDirection !== "E") {
          console.log("E");
          this.setState(() => ({
            skillDirection: "E"
          }));
        }
      } else if (myX - 1 === cell[0] && myY === cell[1]) {
        if (this.state.skillDirection !== "W") {
          console.log("W");
          this.setState(() => ({
            skillDirection: "W"
          }));
        }
      } else if (myY + 1 === cell[1] && myX === cell[0]) {
        if (this.state.skillDirection !== "S") {
          console.log("S");
          this.setState(() => ({
            skillDirection: "S"
          }));
        }
      } else if (myY - 1 === cell[1] && myX === cell[0]) {
        if (this.state.skillDirection !== "N") {
          console.log("N");
          this.setState(() => ({
            skillDirection: "N"
          }));
        }
      } else {
        if (this.state.skillDirection !== null) {
          console.log("skillDirection: null");
          this.setState(() => ({
            skillDirection: null
          }));
        }
      }
    }
  };

  render() {
    let playerMultiplierOrSpinner = this.state.playersMultiplier;
    let enemyMultiplierOrSpinner = this.state.enemiesMultiplier;
    if (this.state.showSpinner) {
      playerMultiplierOrSpinner = <img src={spinner} alt="" />;
      enemyMultiplierOrSpinner = <img src={spinner} alt="" />;
    }

    return (
      <div className="my-flex-row">
        <div className="field_side">
          <div className="canvas_wrapper" style={{ height: 520 + "px" }}>
            <canvas ref="canvas1" style={{ width: "640", height: "360" }} />
            <canvas
              ref="canvas2"
              onMouseMove={e => this.handleCanvas2MouseMove(e)}
              onMouseLeave={e => this.handleCanvas2MouseLeave(e)}
              onClick={e => this.handleCanvas2Click(e)}
              style={{ width: "640", height: "360" }}
            />
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
                    Turn {this.state.turnNo} Multipliers
                  </th>
                </tr>
                <tr>
                  <th style={{ textAlign: "center", backgroundColor: "#eee" }}>
                    Players
                  </th>
                  <th style={{ textAlign: "center", backgroundColor: "#eee" }}>
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
                  >
                    {playerMultiplierOrSpinner}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "1.5em"
                    }}
                  >
                    {enemyMultiplierOrSpinner}
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
                  <td style={{ textAlign: "left" }}>{this.state.info.name}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left", fontWeight: "bold" }}>
                    Health
                  </td>
                  <td style={{ textAlign: "left" }}>
                    {this.state.info.hpLeft} / {this.state.info.hpFull}
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left", fontWeight: "bold" }}>
                    Attack
                  </td>
                  <td style={{ textAlign: "left" }}>
                    {this.state.info.attack}
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left", fontWeight: "bold" }}>
                    Defence
                  </td>
                  <td style={{ textAlign: "left" }}>
                    {this.state.info.defence}
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left", fontWeight: "bold" }}>
                    Position
                  </td>
                  <td style={{ textAlign: "left" }}>
                    [ {this.state.info.positionX}:{this.state.info.positionY} ]
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left", fontWeight: "bold" }}>
                    Action Points
                  </td>
                  <td style={{ textAlign: "left" }}>
                    {this.state.info.actionPoints}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          style={{
            right: 5 + "px",
            bottom: 0 + "px",
            position: "fixed"
          }}
        >
          <img
            onClick={() => this.handleSkillUnselecting()}
            alt=""
            src={skill0}
            style={{
              cursor: "pointer",
              height: 60 + "px",
              width: 60 + "px",
              marginLeft: 5 + "px"
            }}
          />
          <img
            onClick={() => this.handleSkillPress(1)}
            alt=""
            src={skill1}
            style={{
              cursor: "pointer",
              height: 60 + "px",
              width: 60 + "px",
              marginLeft: 5 + "px"
            }}
          />
          <img
            onClick={() => this.handleSkillPress(2)}
            alt=""
            src={skill2}
            style={{
              cursor: "pointer",
              height: 60 + "px",
              width: 60 + "px",
              marginLeft: 5 + "px"
            }}
          />
          <img
            onClick={() => this.handleSkillPress(3)}
            alt=""
            src={skill3}
            style={{
              cursor: "pointer",
              height: 60 + "px",
              width: 60 + "px",
              marginLeft: 5 + "px"
            }}
          />
          <img
            onClick={() => this.handleSkillPress(4)}
            alt=""
            src={skill4}
            style={{
              cursor: "pointer",
              height: 60 + "px",
              width: 60 + "px",
              marginLeft: 5 + "px"
            }}
          />
          <img
            onClick={() => this.handleSkillPress(5)}
            alt=""
            src={skill5}
            style={{
              cursor: "pointer",
              height: 60 + "px",
              width: 60 + "px",
              marginLeft: 5 + "px"
            }}
          />
          <img
            onClick={() => this.handleSkillPress(6)}
            alt=""
            src={skill2}
            style={{
              cursor: "pointer",
              height: 60 + "px",
              width: 60 + "px",
              marginLeft: 5 + "px"
            }}
          />
          <img
            onClick={() => this.handleSkillPress(7)}
            alt=""
            src={skill3}
            style={{
              cursor: "pointer",
              height: 60 + "px",
              width: 60 + "px",
              marginLeft: 5 + "px"
            }}
          />
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
    onMovedInBattlefield: data => dispatch(actions.movedInBattlefield(data)),
    onEndedTurn: data => dispatch(actions.endedTurn(data)),
    onPlayerAttackedEnemy: data => dispatch(actions.playerAttackedEnemy(data))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Battlefield);
