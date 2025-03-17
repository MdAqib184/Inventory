// client/src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/Auth.css';

const Login = () => {
  const { isAuthenticated, loading, login } = React.useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for success message from registration
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleGoogleLogin = () => {
    window.location.href = 'https://inventory-eef5.onrender.com/auth/google';
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/auth/login', formData);
      
      // Call login function from context
      login(response.data.user);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Mama Inventory Login</h2>
        
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="primary-btn">Login</button>
        </form>
        
        <div className="divider">
          <span>OR</span>
        </div>
        
        <button className="google-btn" onClick={handleGoogleLogin}>
          Login with Google
        </button>
        
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;