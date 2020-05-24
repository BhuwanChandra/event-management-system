import React, { Component } from "react";
import BookingList from "../components/Bookings/BookingList/BookingList";
import BookingsChart from "../components/Bookings/BookingsChart/BookingsChart";
import BookingsControls from "../components/Bookings/BookingsControls/BookingsControls";
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";

class BookingsPage extends Component {
  state = {
    isLoading: false,
    bookings: [],
    outputType: "List"
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              _id
              title
              date
              price
            }
          }
        }
      `
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
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(res);
        }
        return res.json();
      })
      .then(resData => {
        const bookings = resData.data.bookings;
        this.setState({ bookings: bookings, isLoading: false });
        console.log(resData);
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  };

  deleteBookingHandler = bookingId => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `,
      variables: {
        id: bookingId
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
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(res);
        }
        return res.json();
      })
      .then(resData => {
        this.setState(prevState => {
          const updatedBookings = prevState.bookings.filter(
            booking => booking._id !== bookingId
          );
          return { bookings: updatedBookings, isLoading: false };
        });
        console.log(resData);
      })
      .catch(err => {
        this.setState({ isLoading: false });
        console.log(err);
      });
  };

  changeOutputTypeHandler = outputType => {
    if (outputType === "List") {
      this.setState({ outputType: "List" });
    } else {
      this.setState({ outputType: "Chart" });
    }
  };

  render() {
    let content = <Spinner />;

    if (!this.state.isLoading) {
      content = (
        <React.Fragment>
          <BookingsControls onChange={this.changeOutputTypeHandler} activeOutputType={this.state.outputType} />
          <div>
            {this.state.outputType === "List" ? (
              <BookingList
                onDelete={this.deleteBookingHandler}
                bookings={this.state.bookings}
              />
            ) : (
              <BookingsChart bookings={this.state.bookings} />
            )}
          </div>
        </React.Fragment>
      );
    }

    return <React.Fragment>{content}</React.Fragment>;
  }
}

export default BookingsPage;
