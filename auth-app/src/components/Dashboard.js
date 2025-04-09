import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard({ setAuth }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [profileImage, setProfileImage] = useState(
    user.profileImage || 'https://via.placeholder.com/150'
  );
  const [uploadStatus, setUploadStatus] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(false);
    navigate('/login');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Accept all image types (jpg, png, gif, webp, etc.)
    if (!file.type.startsWith('image/')) {
      setUploadStatus('File harus berupa gambar (JPG, PNG, GIF, WEBP, dll)');
      return;
    }

    // Increased size limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('Ukuran file maksimal 5MB');
      return;
    }

    setUploadStatus('Mengunggah...');
    const formData = new FormData();
    formData.append('profileImage', file);
    formData.append('userId', user.id);

    axios.post('http://localhost:5001/api/auth/upload', formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      const updatedUser = {...user, profileImage: response.data.imageUrl};
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setProfileImage(response.data.imageUrl);
      setUploadStatus('Foto profil berhasil diubah!');
      setTimeout(() => setUploadStatus(''), 3000);
    })
    .catch(err => {
      console.error('Upload error:', err);
      setUploadStatus(`Gagal mengunggah: ${err.response?.data?.error || err.message}`);
    });
  };

  return (
    <div className="dashboard">
      <h2>Selamat datang, {user.username}!</h2>
      <div className="profile">
        <img 
          src={profileImage} 
          alt="Profil" 
          className="profile-img"
        />
        <div className="upload-container">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{display: 'none'}}
            id="profile-upload"
          />
          <label htmlFor="profile-upload" className="upload-btn">
            Ganti Foto Profil
          </label>
          {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
        </div>
        <p>Anda telah berhasil login</p>
      </div>
      <button onClick={handleLogout} className="logout-btn">Keluar</button>
    </div>
  );
}

export default Dashboard;
