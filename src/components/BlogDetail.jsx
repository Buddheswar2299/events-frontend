import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            const { data } = await axios.get(`https://events-backend-data.onrender.com/events/${id}`);
            setBlog(data);
        };
        fetchBlog();
    }, [id]);

    if (!blog) return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <h1>{blog.title}</h1>
            <p>{blog.description}</p>
            <p className="text-muted">Date: {blog.date}</p>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
    );
};

export default BlogDetail;
