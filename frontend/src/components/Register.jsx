import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
    <div className="auth-wrapper">
      <div className="form-card auth-card">
        <form onSubmit={handleSubmit}>
          <h2 className="mb-2">Create Account</h2>
          <div className="input-group">
            <label className="input-label">Username</label>
            <input 
              type="text" 
              placeholder="Your name" 
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
              required 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              required 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full">Sign up</button>
          <p className="mt-1" style={{ textAlign: 'center', fontSize: '0.9rem' }}>
            Already have an account? <Link to="/login" className="text-link">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;