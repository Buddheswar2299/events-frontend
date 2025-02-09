import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const socket = io("https://events-backend-data.onrender.com");

const Dashboard = ({setIsAuthenticated}) => {
    const navigate =   useNavigate()
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
    const { data } = await axios.get("https://events-backend-data.onrender.com/events");
    setEvents(data);
  };

  const createEvent = async () => {
    const newEvent = { title, description, date, createdBy: "Admin" };
    await axios.post("https://events-backend-data.onrender.com/events", newEvent);
    setTitle("");
    setDescription("");
    setDate("");
  };

  const updateEvent = async (id, updatedData) => {
    await axios.put(`https://events-backend-data.onrender.com/events/${id}`, updatedData);
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    await axios.delete(`https://events-backend-data.onrender.com/events/${id}`);
    setEvents(events.filter(event => event._id !== id));
  };

  const handleLogout = async () => {
    try {
      // Send logout request to backend
      await axios.post('https://events-backend-authenication.onrender.com/logout', {}, { withCredentials: true });
  
      // Clear any local storage or session storage if used
      localStorage.removeItem("token");  
      sessionStorage.removeItem("token");
  
      // Redirect user to login page
      navigate('/login');
      setIsAuthenticated(false)
      console.log('Logged out successfully');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="container mt-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-center flex-grow-1">Event Management</h2>
        <span className="badge bg-secondary mr-4">No of Events - {events.length}</span>
        <button className="btn btn-primary" onClick={handleLogout} >Logout</button>
    </div>
    <div className="card p-4 shadow-lg">
      <input className="form-control mb-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="form-control mb-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input className="form-control mb-2" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <button className="btn btn-primary w-100" onClick={createEvent}>Create Event</button>
    </div>

    <h3 className="mt-4 text-center">Upcoming Events</h3>
    <div className="row mt-3 justify-content-center">
      {events.map((event) => (
        <div key={event._id} className="col-md-6 col-lg-4 mb-3 d-flex justify-content-center">
          <div className="card p-3 shadow-sm" style={{ minWidth: "300px", maxWidth: "500px", width: "100%" }}>
            <h5 className="card-title">{event.title}</h5>
            <p className="card-text">{event.description}</p>
            <p className="text-muted">Date: {event.date}</p>
            <button className="btn btn-warning me-2" onClick={() => updateEvent(event._id, { title: prompt("New Title:", event.title), description: prompt("New Description:", event.description), date: prompt("New Date:", event.date) })}>Edit</button>
            <button className="btn btn-danger" onClick={() => deleteEvent(event._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default Dashboard;
