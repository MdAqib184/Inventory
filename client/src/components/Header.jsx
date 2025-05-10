import React from "react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();

  // Fetch user data from local storage
  const user = JSON.parse(localStorage.getItem("user"));
  const logout = () => {
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <header className="dashboard-header">
      <h1>Variety Collection</h1>
      <div className="user-info">
        {user && (
          <>
            <img
              src={`${process.env.PUBLIC_URL}/umair.jpg`}
              alt={user.name}
              className="user-avatar"
            />
            <span>{user.name}</span>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};
