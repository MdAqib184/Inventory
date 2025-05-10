// client/src/App.js
import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Set axios defaults
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

// Protected route component
// function ProtectedRoute({ children }) {
//   const { isAuthenticated, loading } = React.useContext(AuthContext);
//   if (loading) {
//     return <div>Loading...</div>;
//   }
//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }
//   return children;
// }

export default App;
