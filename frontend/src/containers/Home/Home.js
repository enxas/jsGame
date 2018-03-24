import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class Home extends Component {
  componentDidMount() {
    console.log("[Home.js] componentDidMount()");
  }

  componentWillReceiveProps(nextProps) {
    console.log("[Home.js] componentWillReceiveProps()");
    // if (nextProps.partyInfo.id === null && this.props.partyInfo.id) {
    // }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log("[Home.js] shouldComponentUpdate()");
  // }

  render() {
    let partyTile = null;
    if (this.props.partyInfo.id) {
      partyTile = (
        <div className="tile is-ancestor">
          <div className="tile is-parent">
            <div className="tile is-child box">
              ID: {this.props.partyInfo.id}
              <br /> Floor: {this.props.partyInfo.floor}
              <br /> Members:
              <br />
              {this.props.partyInfo.members.map((member, index) => {
                return <div key={index}>{member}</div>;
              })}
              <br />
              <button className={["button", "is-link"].join(" ")}>Join</button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="columns is-mobile">
        <div className="column is-6 is-offset-one-quarter">
          You can:
          <Link to="/logout">Logout</Link>
          <br />
          <Link to="/party/create">Create Party</Link>
          <br />
          <Link to="/party/leave">Leave Party</Link>
          <br />
          <Link to="/party/list">Browse Parties</Link>
          <br />
          <hr />
          My Party:
          {partyTile}
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
    socket: state.signIn.socket,
    partyInfo: state.party.partyInfo
  };
};

export default connect(mapStateToProps, null)(Home);
