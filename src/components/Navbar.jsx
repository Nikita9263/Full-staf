import React from 'react';
import './Navbar.css';

const Navbar = ({ onAddIdeaClick, onLoginClick, onSignupClick, user, onLogout }) => {
  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <div className='navbar-logo'>
          <span className='logo-text'>StudentHub</span>
        </div>
        <div className='navbar-menu'>
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <a href='#home' className='nav-link'>Home</a>
            </li>
            <li className='nav-item'>
              <a href='#explore' className='nav-link'>Explore</a>
            </li>
            <li className='nav-item'>
              <button className='add-idea-btn' onClick={onAddIdeaClick}>Add Task/Idea</button>
            </li>
            {user ? (
              <>
                <li className='nav-item'>
                  <span className='nav-link welcome-text'>Welcome, {user.name}!</span>
                </li>
                <li className='nav-item'>
                  <button className='nav-link logout-btn' onClick={onLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className='nav-item'>
                  <button className='nav-link login-link' onClick={onLoginClick}>Login</button>
                </li>
                <li className='nav-item'>
                  <button className='nav-link signup-link' onClick={onSignupClick}>Signup</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
