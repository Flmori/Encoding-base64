import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard({ setAuth }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(false);
    navigate('/', { replace: true });
  };

  return (
    <div className="dashboard">
      <div className="profile-header">
        <img 
          src={user?.profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} 
          alt="Profile" 
          className="profile-photo"
        />
        <div>
          <h1>Welcome, {user?.username}!</h1>
          <p>You are now logged in.</p>
        </div>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
