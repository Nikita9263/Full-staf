    import React, { useState } from 'react';
    import './ModernAuth.css';

    const LoginModal = ({ isOpen, onClose, onLogin, onSwitchToSignup }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
        }

        if (!formData.email.includes('@')) {
        setError('Please enter a valid email address');
        return;
        }

        setLoading(true);
        setError('');

        try {
        await onLogin(formData);
        // Reset form on successful login
        setFormData({ email: '', password: '' });
        onClose();
        } catch (err) {
        setError(err.message || 'Login failed. Please try again.');
        } finally {
        setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ email: '', password: '' });
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
            
            {/* Login Title */}
            <h2 className="modal-title">LOGIN</h2>
            
            <form onSubmit={handleSubmit} className="modern-auth-form">
            {error && (
                <div className="modern-error-message">
                {error}
                </div>
            )}

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

            <div className="modern-form-actions">
                <button 
                type="submit" 
                className={`modern-login-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
                >
                {loading ? 'LOGIN...' : 'LOGIN'}
                </button>
            </div>

            <div className="modern-auth-footer">
                <p>
                Don't have an account? 
                <button 
                    type="button" 
                    className="modern-link-btn" 
                    onClick={onSwitchToSignup}
                    disabled={loading}
                >
                    Sign up here
                </button>
                </p>
            </div>
            </form>
        </div>
        </div>
    );
    };

    export default LoginModal;