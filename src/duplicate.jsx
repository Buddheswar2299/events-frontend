import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5009");

const App = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchEvents();
    socket.on("eventCreated", (newEvent) => {
      setEvents((prev) => [...prev, newEvent]);
    });

    return () => socket.off("eventCreated");
  }, []);

  const fetchEvents = async () => {
    const { data } = await axios.get("http://localhost:5009/events");
    setEvents(data);
  };

  const createEvent = async () => {
    const newEvent = { title, description, date, createdBy: "Admin" };
    await axios.post("http://localhost:5009/events", newEvent);
    setTitle("");
    setDescription("");
    setDate("");
  };

  return (
    <div className="container">
      <h2>Event Management</h2>
      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <button onClick={createEvent}>Create Event</button>

      <h3>Upcoming Events</h3>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <strong>{event.title}</strong> - {event.description} ({event.date})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
