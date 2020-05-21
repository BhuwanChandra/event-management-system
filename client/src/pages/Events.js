import React, { Component } from "react";
import Backdrop from "../components/Backdrop/Backdrop";
import Modal from "../components/Modal/Modal";
import "./Events.css";

class EventsPage extends Component {
  state = {
    creating: false
  };

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal 
          title="Add Event" 
          canConfirm={true} 
          canCancel={true}
          onCancel={this.modalCancelHandler}
          onConfirm={this.modalConfirmHandler}
          >
            Modal Content
          </Modal>
        )}
        <div className="events-control">
          <p>Share your own Events!</p>
          <button className="btn" onClick={this.startCreateEventHandler}>
            Create Event
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default EventsPage;
