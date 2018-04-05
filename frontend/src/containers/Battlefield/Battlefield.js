import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";
import toastr from "toastr";
import { func1, func2 } from "../../utils/drawGrid";
import spritesheetPNG from "../../assets/images/spritesheet.png";

class Battlefield extends Component {
  state = {
    windowHeight: 0
  };

  drawField(fieldArr) {
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
    const canvas2 = this.refs.canvas2;

    canvas1.width = worldWidth * tileWidth; // windowWidth
    canvas1.height = worldHeight * tileHeight; // windowHeight

    const ctx1 = canvas1.getContext("2d");
    const ctx2 = canvas2.getContext("2d");
    ///////////////////////////////////////////
    const ground = ["0", "1"];
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
      draw(tiles, allImages, ground);
    });

    function draw(tiles, images, ground) {
      var tileW = 32;
      var tileH = 32;
      for (var x = 0; x < worldWidth; x++) {
        for (var y = 0; y < worldHeight; y++) {
          ctx1.drawImage(images[fieldArr[x][y]], x * tileW, y * tileH);
        }
      }
    }
  }

  componentDidMount() {
    console.log(` Battlefield.js componentDidMount`);
    this.props.onRedirectedToBattlefield();
    this.drawField(this.props.field);
    // this.props.onEnteredBattlefield();
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.redirectToBattlefield === true) {
  //     this.props.onRedirectedToBattlefield();
  //   }
  // }

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
            top: this.state.windowHeight + "px",
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
    redirectToBattlefield: state.battlefield.redirectToBattlefield
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRedirectedToBattlefield: () => dispatch(actions.redirectedToBattlefield())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Battlefield);
