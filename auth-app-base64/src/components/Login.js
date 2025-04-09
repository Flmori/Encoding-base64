import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setAuth }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', formData);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: res.data.user.id,
        username: res.data.user.username
      }));
      setAuth(true);
      alert('Login successful!');
      navigate('/dashboard', { replace: true });

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.error || 'Login failed!');
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div className="auth-actions">
          <button type="submit">Login</button>
          <button 
            type="button" 
            onClick={() => navigate('/register')}
            className="register-btn"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
