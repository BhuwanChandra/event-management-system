import React from "react";
import "./EventItem.css";

const EventItem = props => {
  return (
    <li key={props.eventId} className="events__list-item">
      <div>
        <h1>{props.title}</h1>
        <h2>$13.33</h2>
      </div>
      <div>
        {!(props.userId === props.creatorId) ? (
          <button className="btn">View Details</button>
        ) : (
          <p>Your the owner of this event</p>
        )}
      </div>
    </li>
  );
};

export default EventItem;
