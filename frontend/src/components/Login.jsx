import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.username, formData.email, formData.password);
      alert('You have successfully logged in!');
      navigate('/login');
    } catch (err) {
      alert('Error logging in');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log in</h2>
      <input type="text" placeholder="First name" onChange={(e) => setFormData({...formData, username: e.target.value})} required />
      <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
      <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
      <button type="submit">Sign in</button>
    </form>
  );
};

export default Login;