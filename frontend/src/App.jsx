import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import axios from 'axios';

export default function App() {
  const [authUser, setAuthUser] = useState(null);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      setAuthUser(null);
    } catch (err) {
      setAuthUser(null);
    }
  };

  return authUser ? <Dashboard onLogout={handleLogout} /> : <Login setAuthUser={setAuthUser} />;
}