import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await axios.get('http://localhost:5001/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAuth(true);
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              auth ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              auth ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <div className="auth-container">
                  <Login setAuth={setAuth} />
                </div>
              )
            }
          />
          <Route
            path="/register"
            element={
              auth ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <div className="auth-container">
                  <Register />
                </div>
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              auth ? (
                <Dashboard setAuth={setAuth} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
