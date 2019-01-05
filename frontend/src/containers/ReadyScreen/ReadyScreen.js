import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import "./readyscreen.css";

// These two containers are siblings in the DOM
const modalRoot = document.getElementById("modal-root");

// Let's create a Modal component that is an abstraction around
// the portal API.
class Modal extends React.Component {
  constructor(props) {
    super(props);
    // Create a div that we'll render the modal into. Because each
    // Modal component has its own element, we can render multiple
    // modal components into the modal container.
    this.el = document.createElement("div");
  }

  componentDidMount() {
    // Append the element into the DOM on mount. We'll render
    // into the modal container element (see the HTML tab).
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    // Remove the element from the DOM when we unmount
    modalRoot.removeChild(this.el);
  }

  render() {
    // Use a portal to render the children into the element
    return ReactDOM.createPortal(
      // Any valid React child: JSX, strings, arrays, etc.
      this.props.children,
      // A DOM element
      this.el
    );
  }
}

// The Modal component is a normal React component, so we can
// render it wherever we like without needing to know that it's
// implemented with portals.
class ReadyScreen extends React.Component {
  constructor(props) {
    super(props);

    this.handleHeroChange = this.handleHeroChange.bind(this);
    this.handleDeckChange = this.handleDeckChange.bind(this);
    this.handleReadyClick = this.handleReadyClick.bind(this);

    this.handleNotReadyClick = this.handleNotReadyClick.bind(this);
    this.state = {
      showModal: false,
      hero: "coconut",
      heroes: [],
      deck: "default",
      decks: [],
      disableButton: false
    };

    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);
  }

  handleShow() {
    this.setState({ showModal: true });
  }

  handleHide() {
    this.setState({ showModal: false });
  }

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.show === true && this.state.showModal === false) {
      this.setState(
        {
          heroes: this.props.heroes,
          hero: this.props.heroes[0],
          decks: this.props.decks,
          deck: this.props.decks[0].name
        },
        () => {
          this.handleShow();
        }
      );
    } else if (nextProps.show === false && this.state.showModal === true) {
      this.handleHide();
    }
  }

  /*
  componentDidUpdate(prevProps) {
    if (this.state.clicks === 1) {
      this.setState({
        clicks: 0
      });
      this.handleHide();
    }
  }
*/
  handleHeroChange(event) {
    this.setState({ hero: event.target.value });
  }
  handleDeckChange(event) {
    this.setState({ deck: event.target.value });
  }

  handleReadyClick() {
    console.log(
      "Your hero is: " + this.state.hero + " deck is: " + this.state.deck
    );
    this.setState(() => ({
      disableButton: true
    }));
    this.props.socket.emit("memberReady");
  }

  handleNotReadyClick() {
    // This will fire when the button in Child is clicked,
    // updating Parent's state, even though button
    // is not direct descendant in the DOM.

    this.props.socket.emit("memberNotReady");
  }

  render() {
    // Show a Modal on click.
    // (In a real app, don't forget to use ARIA attributes
    // for accessibility!)
    const modal = this.state.showModal ? (
      <Modal>
        <div className="modal">
          <div className="new-modal-content">
            <div className="modal-header">
              <center>
                <h2>
                  <b>Enter Dungeon?</b>
                </h2>
              </center>
            </div>
            <div className="modal-body">
              <center>
                Party members ready: {this.props.readyPlayers}/{
                  this.props.playerCount
                }
                <br />
                Floor: {this.props.floor}
                <br />
                Select your hero:<br />
                <div className="select">
                  <select
                    value={this.state.hero}
                    onChange={this.handleHeroChange}
                  >
                    {this.state.heroes.map(function(object, i) {
                      return (
                        <option value={object} key={i}>
                          {object}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <br />
                Select your deck: <br />
                <div className="select">
                  <select
                    value={this.state.deck}
                    onChange={this.handleDeckChange}
                  >
                    {this.state.decks.map(function(object, i) {
                      return (
                        <option value={object.name} key={i}>
                          {object.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </center>
            </div>
            <div className="new-modal-footer">
              <center>
                <button
                  className="button is-primary"
                  onClick={this.handleNotReadyClick}
                  id="new-close"
                >
                  Not Ready
                </button>
                OR
                <button
                  className="button is-primary"
                  onClick={this.handleReadyClick}
                  id="new-close"
                  disabled={this.state.disableButton}
                >
                  Ready
                </button>
              </center>
            </div>
          </div>
        </div>
      </Modal>
    ) : null;

    return <div>{modal}</div>;
  }
}

const mapStateToProps = state => {
  return {
    socket: state.signIn.socket
  };
};

export default connect(mapStateToProps, null)(ReadyScreen);
