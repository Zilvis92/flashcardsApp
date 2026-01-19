import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Modal from './Modal/Modal';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/decks');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setModalConfig({
        isOpen: true,
        title: "Login Failed",
        message: errorMsg
      });
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
      <Modal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={() => setModalConfig({ ...modalConfig, isOpen: false })}
        showCancel={false}
        confirmText="Try Again"
      />
    </div>
  );
};

export default Login;