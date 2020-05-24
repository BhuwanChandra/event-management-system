import React from "react";
import "./BookingsControls.css";

const BookingsControls = props => {
  return (
    <div className="booking-controls">
      <button
        className={props.activeOutputType === "List" ? "active" : ""}
        onClick={props.onChange.bind(this, "List")}
      >
        List
      </button>
      <button
        className={props.activeOutputType === "Chart" ? "active" : ""}
        onClick={props.onChange.bind(this, "Chart")}
      >
        Chart
      </button>
    </div>
  );
};

export default BookingsControls;
