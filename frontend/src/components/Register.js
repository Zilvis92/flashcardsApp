import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.username, formData.email, formData.password);
      alert('Registration successful! Please log in now.');
      navigate('/login');
    } catch (err) {
      alert('Error when registering');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registration</h2>
      <input type="text" placeholder="First name" onChange={(e) => setFormData({...formData, username: e.target.value})} required />
      <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
      <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
      <button type="submit">Sign up</button>
    </form>
  );
};

export default Register;