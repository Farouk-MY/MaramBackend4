import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
const MobileNav = ({ isOpen, onClose, user }) => {
  return (
    <div className={`popup-mobile-menu ${isOpen ? 'active' : ''}`}>
      <div className="inner-popup">
        <div className="header-top d-flex justify-content-between align-items-center">
          <div className="logo">
            <Link to="/" onClick={onClose}>
              <img className="logo-light" src="./src/assets/images/logo/logo.png" alt="ChatBot Logo" />
            </Link>
          </div>
          <div className="close-menu">
            <button className="close-button" onClick={onClose}>
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
        </div>
        <div className="content">
          <ul className="mainmenu list-unstyled">
            <li><Link to="/" onClick={onClose}>Home</Link></li>
            <li><Link to="/blog" onClick={onClose}>Blog</Link></li>
            <li><a href="#">Roadmap</a></li>
            <li><a href="#">How to use</a></li>
          </ul>
          {!user ? (
            <div className="header-btn d-block d-md-none">
              <Link className="btn btn-primary w-100" to="/signin" onClick={onClose}>Get Started Free</Link>
            </div>
          ) : (
            <div className="user-info mt-3">
              <div className="d-flex align-items-center">
                <img src={user.avatar || "/src/assets/images/team/team-01sm.jpg"} alt={user.name} className="rounded-circle me-2" width="40" height="40" />
                <div>
                  <div className="fw-bold">{user.name}</div>
                  <div className="text-muted small">{user.email}</div>
                </div>
              </div>
              <ul className="list-unstyled mt-3">
                <li><Link to="/profile" onClick={onClose} className="d-block py-2">Profile Settings</Link></li>
                <li>
                  <button className="btn btn-danger w-100" onClick={onClose}>
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNav;