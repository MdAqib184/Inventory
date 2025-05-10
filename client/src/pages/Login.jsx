// client/src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";

const Login = () => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Check for success message from registration
  //   if (location.state?.message) {
  //     setMessage(location.state.message);
  //   }
  // }, [location]);

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setPin(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/auth/login", { pin });

      if (response.status === 200) {
        setMessage("Login successful! Redirecting to dashboard...");
        //set local storage with user data
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // navigate("/dashboard", {
        //   state: { message: "Login successful! Redirecting to dashboard..." },
        // });

        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      // setError(error.response?.data?.message || "Login failed");
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
            <label htmlFor="email">Pin</label>
            <input
              // type="email"
              id="pin"
              name="pin"
              value={pin}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="primary-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
