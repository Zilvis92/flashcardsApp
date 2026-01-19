import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Modal from './Modal/Modal';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [modalConfig, setModalConfig] = useState({ 
    isOpen: false, 
    title: '', 
    message: '',
    isSuccess: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.username, formData.email, formData.password);
      setModalConfig({
        isOpen: true,
        title: "Welcome!",
        message: "Registration successful! You can now log in to your account.",
        isSuccess: true
      });
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Something went wrong during registration.';
      setModalConfig({
        isOpen: true,
        title: "Registration Error",
        message: errorMsg,
        isSuccess: false
      });
    }
  };

  const handleModalClose = () => {
    const wasSuccess = modalConfig.isSuccess;
    setModalConfig({ ...modalConfig, isOpen: false });
    if (wasSuccess) {
      navigate('/login');
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
      <Modal 
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={handleModalClose}
        showCancel={false}
        confirmText={modalConfig.isSuccess ? "Go to Login" : "Fix it"}
      />
    </div>
  );
};

export default Register;