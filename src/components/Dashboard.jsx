import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Pagination from 'react-bootstrap/Pagination';
import { FaEdit, FaTrash } from 'react-icons/fa';

const socket = io("https://events-backend-data.onrender.com");

const Dashboard = ({setIsAuthenticated}) => {
    const navigate =   useNavigate()
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);

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
    setLoading(false);
  };

  const createEvent = async () => {
    const newEvent = { title, description, date, createdBy: "Admin" };
    await axios.post("https://events-backend-data.onrender.com/events", newEvent);
    setTitle("");
    setDescription("");
    setDate("");
  };

  const updateEvent = async (id) => {
    const updatedData = { title, description, date };
    await axios.put(`https://events-backend-data.onrender.com/events/${id}`, updatedData);
    fetchEvents();
    setIsEditing(false);
    setTitle("");
    setDescription("");
    setDate("");
  };

  const deleteEvent = async (id) => {
    await axios.delete(`https://events-backend-data.onrender.com/events/${id}`);
    setEvents(events.filter(event => event._id !== id));
  };

  const handleLogout = async () => {
    try {
      // Send logout request to backend
      await axios.post('https://events-backend-data.onrender.com/logout', {}, { withCredentials: true });
  
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

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to limit description to 20 words
  const limitDescription = (text) => {
    const words = text.split(" ");
    return words.length > 20 ? words.slice(0, 20).join(" ") + "..." : text;
  };

  return (
    <div className="container mt-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-center flex-grow-1">Blogs Management</h2>
        <span className="badge bg-secondary mr-4">No of Blogs - {events.length}</span>
        <button className="btn btn-primary" onClick={handleLogout} >Logout</button>
    </div>
    <div className="card p-4 shadow-lg">
      <input className="form-control mb-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="form-control mb-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input className="form-control mb-2" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <button className="btn btn-primary w-100" onClick={isEditing ? () => updateEvent(currentEventId) : createEvent}>
        {isEditing ? "Update Blog" : "Create Blog"}
      </button>
    </div>

    <h2 className="mt-4 text-center">Blogs</h2>
   
    <div className="row mt-3 justify-content-center">
  {loading ? (
    <div className="text-center">Loading...</div>
  ) : (
    currentEvents.map((event) => (
      <div key={event._id} className="col-md-6 col-lg-4 mb-3 d-flex justify-content-center">
        <div
          className="card p-3 shadow-sm d-flex flex-column"
          style={{
            minWidth: "300px",
            maxWidth: "500px",
            height: "300px",
            width: "100%",
            background: "linear-gradient(to right, #cfd9df, #e2ebf0)",
          }}
        >
          <div className="d-flex justify-content-between">
            <div>
              <h5 className="card-title">{event.title}</h5>
              <p className="text-muted">Date: {event.date}</p>
            </div>
            <div>
              <FaEdit
                className="text-warning me-2"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setIsEditing(true);
                  setCurrentEventId(event._id);
                  setTitle(event.title);
                  setDescription(event.description);
                  setDate(event.date);
                }}
                style={{ cursor: "pointer" }}
              />
              <FaTrash
                className="text-danger"
                onClick={() => deleteEvent(event._id)}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>

          <p className="card-text">{limitDescription(event.description)}</p>

          <div className="mt-auto">
            <button
              className="btn btn-primary w-100"
              onClick={() => navigate(`/blogs/${event._id}`)}
            >
              Read More
            </button>
          </div>
        </div>
      </div>
    ))
  )}
</div>

    <Pagination>
      {[...Array(Math.ceil(events.length / eventsPerPage)).keys()].map(number => (
        <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
          {number + 1}
        </Pagination.Item>
      ))}
    </Pagination>
  </div>
  );
};

export default Dashboard;
