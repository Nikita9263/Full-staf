import React, { useState } from 'react';
import './ModernAuth.css';

const SignupModal = ({ isOpen, onClose, onSignup, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await onSignup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      // Reset form on successful signup
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      onClose();
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modern-modal-overlay" onClick={handleClose}>
      <div className="modern-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* User Icon */}
        <div className="user-icon-container">
          <div className="user-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="white"/>
              <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="white"/>
            </svg>
          </div>
        </div>
        
        {/* Signup Title */}
        <h2 className="modal-title">SIGN UP</h2>
        
        <form onSubmit={handleSubmit} className="modern-auth-form">
          {error && (
            <div className="modern-error-message">
              {error}
            </div>
          )}

          <div className="modern-form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              className="modern-input"
            />
          </div>

          <div className="modern-form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="modern-input"
            />
          </div>

          <div className="modern-form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength="6"
              className="modern-input"
            />
          </div>

          <div className="modern-form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              minLength="6"
              className="modern-input"
            />
          </div>

          <div className="modern-form-actions">
            <button 
              type="submit" 
              className={`modern-login-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </div>

          <div className="modern-auth-footer">
            <p>
              Already have an account? 
              <button 
                type="button" 
                className="modern-link-btn" 
                onClick={onSwitchToLogin}
                disabled={loading}
              >
                Login here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;