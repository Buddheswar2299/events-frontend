import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Pagination from 'react-bootstrap/Pagination';

const BlogsPage = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [blogsPerPage] = useState(6);
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchBlogs = async () => {
            const { data } = await axios.get("https://events-backend-data.onrender.com/events");
            setBlogs(data);
            setLoading(false); // Set loading to false after fetching data
        };
        fetchBlogs();
    }, []);

    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#1a237e' }}>
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <a className="navbar-brand" href="#">BlogSpace</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/signup">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/signup">About</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/signup">Contact</Link>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-outline-light" onClick={() => navigate('/login')} style={{ marginLeft: '10px' }}>Sign In</button>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-light" onClick={() => navigate('/signup')} style={{ marginLeft: '10px' }}>Sign Up</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <div className="hero-section text-center">
                    <h1>Share Your Ideas With The World</h1>
                    <p>Create and share your thoughts, stories, and insights on our modern blogging platform.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/signup')}>Get Started</button>
                </div>
                <h2 className="mt-5">Featured Blogs</h2>
                {loading ? ( // Show loading message while fetching
                    <div className="text-center">Loading...</div>
                ) : (
                    <div className="row">
                        {currentBlogs.map((blog) => (
                            <div className="col-md-4" key={blog.id}>
                                <div className="card mb-4" style={{ height: '200px' }}>
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{blog.title}</h5>
                                        <p className="card-text" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{blog.description}</p>
                                        <Link to='/signup' className="btn btn-primary mt-auto">Read More</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <Pagination>
                    {[...Array(Math.ceil(blogs.length / blogsPerPage)).keys()].map(number => (
                        <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                            {number + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>
            <footer className="bg-dark text-white text-center py-3">
                © 2025 BlogSpace. All rights reserved.
            </footer>
        </div>
    );
};

export default BlogsPage;