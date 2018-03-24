import React from "react";

const PartyTile = props => (
  <div className="tile is-ancestor">
    <div className="tile is-parent">
      <div className="tile is-child box">
        Creator: {props.creator}
        <br /> Floor: {props.floor}
        <br /> Members:{props.members}
        <br />
        <button
          onClick={props.clicked}
          className={["button", "is-link"].join(" ")}
        >
          Join
        </button>
      </div>
    </div>
  </div>
);

export default PartyTile;
