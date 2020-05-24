import React, { Component } from "react";
import Backdrop from "../components/Backdrop/Backdrop";
import EventList from "../components/Events/EventList/EventList";
import Modal from "../components/Modal/Modal";
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";
import "./Events.css";

class EventsPage extends Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null
  };

  isActive = true;

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleEl = React.createRef();
    this.priceEl = React.createRef();
    this.dateEl = React.createRef();
    this.descriptionEl = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.titleEl.current.value;
    const price = +this.priceEl.current.value;
    const date = this.dateEl.current.value;
    const description = this.descriptionEl.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      console.log("ERROR!!");
      return;
    }

    const event = { title, price, date, description };
    console.log(event);

    const requestBody = {
      query: `
        mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!) {
          createEvent(eventInput: {title: $title, description: $desc, price: $price, date: $date}) {
            _id
            title
            price
            description
            date
          }
        }
      `,
      variables: {
        title: title,
        desc: description,
        price: price,
        date: date
      }
    };

    const token = this.context.token;

    fetch("/graphql", {
      method: "post",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(res);
        }
        return res.json();
      })
      .then(resData => {
        console.log(resData);
        this.setState(prevState => {
          const updatedEvents = [
            ...prevState.events,
            {
              _id: resData.data.createEvent._id,
              title: resData.data.createEvent.title,
              price: resData.data.createEvent.price,
              description: resData.data.createEvent.description,
              date: resData.data.createEvent.date,
              creator: {
                _id: this.context.userId
              }
            }
          ];
          return { events: updatedEvents };
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  fetchEvents = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            price
            description
            date
            creator {
              _id
              email
            }
          }
        }
      `
    };

    fetch("/graphql", {
      method: "post",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(res);
        }
        return res.json();
      })
      .then(resData => {
        const events = resData.data.events;
        if(this.isActive)
        this.setState({ events: events, isLoading: false });
        console.log(resData);
      })
      .catch(err => {
        if(this.isActive)
        this.setState({ isLoading: false });
        console.log(err);
      });
  };

  showDetailsHandler = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return { selectedEvent: selectedEvent };
    });
  };

  bookEventHandler = () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }
    const requestBody = {
      query: `
        mutation BookEvent($id: ID!) {
          bookEvent(eventId: $id) {
            _id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        id: this.state.selectedEvent._id
      }
    };

    fetch("/graphql", {
      method: "post",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.context.token}`
      }
    })
      .then(res => {
        // console.log(res);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(res.type);
        }
        return res.json();
      })
      .then(resData => {
        this.setState({ selectedEvent: null });
        console.log(resData);
      })
      .catch(err => {
        this.setState({ selectedEvent: null });
        console.log(err);
      });
  };

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    return (
      <React.Fragment>
        {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canConfirm={true}
            canCancel={true}
            confirmText="Confirm"
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleEl} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceEl} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.dateEl} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  rows="4"
                  id="description"
                  ref={this.descriptionEl}
                ></textarea>
              </div>
            </form>
          </Modal>
        )}
        {this.state.selectedEvent ? (
          <Modal
            title={this.state.selectedEvent.title}
            canConfirm={true}
            canCancel={true}
            confirmText={this.context.token ? "Book Event" : "Confirm"}
            onCancel={this.modalCancelHandler}
            onConfirm={this.bookEventHandler}
          >
            <div>
              <h1>{this.state.selectedEvent.title}</h1>
              <h2>{`$${this.state.selectedEvent.price} - ${new Date(
                this.state.selectedEvent.date
              ).toLocaleDateString()}`}</h2>
            </div>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        ) : null}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EventList
            authUserId={this.context.userId}
            events={this.state.events}
            onViewDetail={this.showDetailsHandler}
          />
        )}
      </React.Fragment>
    );
  }
}

export default EventsPage;
