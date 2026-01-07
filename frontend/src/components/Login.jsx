import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
    <div className="auth-wrapper">
      <div className="form-card auth-card">
        <form onSubmit={handleSubmit}>
          <h2 className="mb-2">Log in</h2>
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
          <button type="submit" className="btn btn-primary btn-full">Sign in</button>
          <p className="mt-1" style={{ textAlign: 'center', fontSize: '0.9rem' }}>
            Don't have an account? <Link to="/register" className="text-link">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;