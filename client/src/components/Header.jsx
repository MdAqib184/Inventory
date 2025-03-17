import React from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const Header = () => {
  const { user, logout } = React.useContext(AuthContext);
  
  return (
    <header className="dashboard-header">
      <h1>Mama Inventory Management</h1>
      <div className="user-info">
        {user && (
          <>
            <img src={user.picture} alt={user.name} className="user-avatar" />
            <span>{user.name}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </>
        )}
      </div>
    </header>
  );
};