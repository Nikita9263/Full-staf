import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = ({ onLogin, onSwitchToSignup }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isLoginMode && !formData.name) {
      setError('Please enter your name');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isLoginMode) {
        // Login
        await onLogin({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Signup
        await onLogin({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setFormData({ email: '', password: '', name: '' });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Background decoration */}
        <div className="background-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>

        {/* Login Card */}
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="logo-section">
              <div className="logo-icon">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="white"/>
                </svg>
              </div>
              <h1 className="logo-title">StudentHub</h1>
              <p className="logo-subtitle">Task & Idea Sharing Platform for Students</p>
            </div>
          </div>

          {/* Form */}
          <div className="login-form-container">
            <div className="form-header">
              <h2>{isLoginMode ? 'Welcome Back!' : 'Join StudentHub'}</h2>
              <p>{isLoginMode ? 'Sign in to your account' : 'Create your account to get started'}</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              {!isLoginMode && (
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required={!isLoginMode}
                    disabled={loading}
                    className="form-input"
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  minLength="6"
                  className="form-input"
                />
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    {isLoginMode ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  isLoginMode ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            <div className="form-footer">
              <p>
                {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                <button 
                  type="button" 
                  className="switch-btn" 
                  onClick={switchMode}
                  disabled={loading}
                >
                  {isLoginMode ? 'Sign up here' : 'Sign in here'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;