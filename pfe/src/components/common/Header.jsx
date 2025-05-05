import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AddModelModal from './AddModelModal';
import MobileNav from './MobileNav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faChevronDown,
  faUser,
  faGear,
  faSignOut,
  faPlus,
  faBell,
  faFolder,
  faCreditCard,
  faShieldAlt,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';

const Header = ({ user, onLogout }) => {
  const [showAddModel, setShowAddModel] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toolsDropdownRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target)) {
        setIsToolsDropdownOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="header-default header-transparent header-sticky shadow-sm" style={{ backgroundColor: 'var(--color-blackest)' }}>
        {/* Premium notification bar with gradient */}
        <div style={{ background: 'var(--dark-gradient-3)', color: 'var(--dark-bg-2)' }} className="py-2 d-none d-lg-block">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <span className="badge me-2 fw-bold" style={{ backgroundColor: 'var(--color-dark)', color: 'var(--color-primary)' }}>NEW</span>
                <small>Enhanced AI models available now with improved accuracy!</small>
              </div>
              <div>
                <a href="#" className="text-decoration-none small me-4" style={{ color: 'var(--color-lighter)' }}>
                  <FontAwesomeIcon icon={faShieldAlt} className="me-1" /> API Docs
                </a>
                <a href="#" className="text-decoration-none small" style={{ color: 'var(--color-lighter)' }}>
                  <FontAwesomeIcon icon={faQuestionCircle} className="me-1" /> Help Center
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="container position-relative">
          <div className="row align-items-center py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
            {/* Logo Section */}
            <div className="col-lg-2 col-md-6 col-6">
              <div className="logo">
                <Link to="/" className="d-inline-block">
                  <img
                    className="logo-light img-fluid"
                    src="/src/assets/images/logo/logo5.png"
                    alt="ChatBot Logo"
                    style={{ maxHeight: "100px" }}
                  />
                  <img
                    className="logo-dark img-fluid"
                    src="/src/assets/images/light/logo/logoo2.png"
                    alt="ChatBot Logo"
                    style={{ maxHeight: "130px" }}
                  />
                </Link>
              </div>
            </div>

            {/* Main Navigation */}
            <div className="col-lg-8 d-none d-lg-block">
              <nav className="mainmenu-nav d-flex justify-content-center">
                <ul className="mainmenu d-flex list-unstyled m-0">
                  <li className="nav-item px-3">
                    <Link to="/" className="nav-link d-flex align-items-center position-relative fw-medium text-decoration-none py-2" style={{ color: 'var(--color-heading)' }}>
                      Home
                      <span className="nav-indicator position-absolute rounded-pill"
                        style={{ height: "3px", width: "70%", bottom: "0", left: "15%", transition: "all 0.3s ease", backgroundColor: 'var(--color-primary)' }}>
                      </span>
                    </Link>
                  </li>

                  <li className="nav-item px-3">
                    <Link to="/blog" className="nav-link fw-medium text-decoration-none py-2" style={{ color: 'var(--color-body)' }}>AI Models</Link>
                  </li>
                  {/*<li className="nav-item px-3">
                    <Link to="/how-to-use" className="nav-link fw-medium text-decoration-none py-2" style={{ color: 'var(--color-body)' }}>How to use</Link>
                  </li>*/}
                  <li className="nav-item px-3">
                    <Link to="/contact" className="nav-link fw-medium text-decoration-none py-2" style={{ color: 'var(--color-body)' }}>
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            {/* User Actions Section */}
            <div className="col-lg-2 col-md-6 col-6">
              <div className="header-right d-flex justify-content-end align-items-center">
                {user ? (
                  <div className="user-menu d-flex align-items-center">
                    {/* Add Model Button with hover effect */}
                    <button
                      className="btn btn-sm rounded-circle me-3 d-flex justify-content-center align-items-center"
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: '#00BFFF',
                        color: 'white',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => setShowAddModel(true)}
                      title="Add New Model"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>

                    {/* Notifications Button with Indicator */}
                    <button
                      className="btn btn-sm rounded-circle me-3 d-none d-md-flex justify-content-center align-items-center position-relative"
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: 'var(--color-lessdark)',
                        color: 'var(--color-body)',
                        boxShadow: 'var(--shadow-light)',
                        transition: 'var(--transition)'
                      }}
                      title="Notifications"
                    >
                      <FontAwesomeIcon icon={faBell} />
                      <span className="position-absolute d-flex align-items-center justify-content-center animate__animated animate__pulse animate__infinite"
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          fontSize: "10px",
                          top: "-5px",
                          right: "-5px",
                          border: "2px solid var(--color-blackest)",
                          backgroundColor: 'var(--color-danger)',
                          color: 'var(--color-white)'
                        }}
                      >3</span>
                    </button>

                    {/* User Profile Menu */}
                    <div className="profile-menu position-relative" ref={profileMenuRef}>
                      <div
                        className="profile-image-wrapper cursor-pointer"
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      >
                        <img
                          src={user.avatar || "/src/assets/images/team/team-04sm.png"}
                          alt={user.name}
                          className="rounded-circle profile-image"
                          width="45"
                          height="45"
                          style={{
                            objectFit: "cover",
                            border: "2px solid var(--color-lessdark)",
                            boxShadow: 'var(--shadow-light)',
                            cursor: "pointer",
                            transition: "transform 0.2s ease",
                            transform: isProfileMenuOpen ? "scale(1.05)" : "scale(1)"
                          }}
                        />
                      </div>

                      {isProfileMenuOpen && (
                        <div className="profile-dropdown border-0 rounded-lg py-0 mt-2 animate__animated animate__fadeIn"
                          style={{
                            position: "absolute",
                            right: 0,
                            top: "100%",
                            width: "360px",
                            zIndex: 1000,
                            backgroundColor: 'var(--color-dark)',
                            boxShadow: 'var(--dark-shadow-1)',
                            overflow: "hidden"
                          }}
                        >
                          {/* Profile Header Section */}
                          <div className="p-4 border-bottom"
                            style={{
                              background: 'var(--dark-gradient-2)',
                              borderColor: 'var(--color-border)'
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <img
                                src={user.avatar || "/src/assets/images/team/team-04sm.png"}
                                alt={user.name}
                                className="rounded-circle me-3"
                                width="70"
                                height="70"
                                style={{
                                  objectFit: "cover",
                                  border: "3px solid var(--color-dark)",
                                  boxShadow: 'var(--shadow-light)'
                                }}
                              />
                              <div>
                                <h6 className="mb-1 fw-bold" style={{ color: 'var(--color-heading)', fontSize: '18px' }}>{user.name}</h6>
                                <p className="mb-1" style={{ color: 'var(--color-body)', fontSize: '14px' }}>{user.email || "user@example.com"}</p>
                                <span className="badge px-3 py-1 rounded-pill"
                                  style={{
                                    background: 'var(--color-dark)',
                                    color: 'var(--color-primary)',
                                    fontSize: '12px'
                                  }}
                                >Premium</span>
                              </div>
                            </div>
                          </div>

                          {/* Credits Section */}
                          <div className="px-4 py-3">
                            <div className="d-flex justify-content-between mb-2 align-items-center">
                              <span style={{ color: 'var(--color-body)', fontSize: '15px' }}>Your AI credits</span>
                              <span className="fw-bold" style={{ color: 'var(--color-heading)', fontSize: '15px' }}>750 / 1,000</span>
                            </div>
                            <div className="progress mb-2" style={{ height: "10px", borderRadius: "5px", overflow: "hidden", backgroundColor: 'var(--color-lessdark)' }}>
                              <div className="progress-bar" role="progressbar"
                                style={{
                                  width: "75%",
                                  background: 'var(--dark-gradient-2)'
                                }}
                                aria-valuenow="75"
                                aria-valuemin="0"
                                aria-valuemax="100">
                              </div>
                            </div>
                            <div className="text-end">
                              <a href="#" className="text-decoration-none" style={{ color: 'var(--color-primary)', fontSize: '14px' }}>Buy more credits</a>
                            </div>
                          </div>

                          <div className="dropdown-divider my-0" style={{ borderColor: 'var(--color-border)' }}></div>

                          {/* Menu Options */}
                          <div className="p-3">
                            <Link className="dropdown-item py-3 px-3 rounded-md d-flex align-items-center transition-all"
                              to="/profile"
                              style={{
                                color: 'var(--color-body)',
                                transition: 'var(--transition)'
                              }}
                            >
                              <div className="icon-wrapper rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  backgroundColor: 'rgba(74, 144, 226, 0.1)'
                                }}
                              >
                                <FontAwesomeIcon icon={faUser} style={{ color: 'var(--color-primary)', fontSize: '16px' }} />
                              </div>
                              <div>
                                <span className="fw-medium" style={{ color: 'var(--color-heading)', fontSize: '16px' }}>My Profile</span>
                                <small className="d-block" style={{ color: 'var(--color-body)', fontSize: '14px' }}>Manage your account</small>
                              </div>
                            </Link>

                            <Link className="dropdown-item py-3 px-3 rounded-md d-flex align-items-center transition-all"
                              to="/projects"
                              style={{
                                color: 'var(--color-body)',
                                transition: 'var(--transition)'
                              }}
                            >
                              <div className="icon-wrapper rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  backgroundColor: 'rgba(153, 194, 255, 0.1)'
                                }}
                              >
                                <FontAwesomeIcon icon={faFolder} style={{ color: 'var(--color-secondary)', fontSize: '16px' }} />
                              </div>
                              <div>
                                <span className="fw-medium" style={{ color: 'var(--color-heading)', fontSize: '16px' }}>My Projects</span>
                                <small className="d-block" style={{ color: 'var(--color-body)', fontSize: '14px' }}>Manage your AI projects</small>
                              </div>
                            </Link>

                            <Link className="dropdown-item py-3 px-3 rounded-md d-flex align-items-center transition-all"
                              to="/billing"
                              style={{
                                color: 'var(--color-body)',
                                transition: 'var(--transition)'
                              }}
                            >
                              <div className="icon-wrapper rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  backgroundColor: 'rgba(255, 200, 118, 0.1)'
                                }}
                              >
                                <FontAwesomeIcon icon={faCreditCard} style={{ color: 'var(--color-warning)', fontSize: '16px' }} />
                              </div>
                              <div>
                                <span className="fw-medium" style={{ color: 'var(--color-heading)', fontSize: '16px' }}>Billing</span>
                                <small className="d-block" style={{ color: 'var(--color-body)', fontSize: '14px' }}>Manage your subscription</small>
                              </div>
                            </Link>

                            <Link className="dropdown-item py-3 px-3 rounded-md d-flex align-items-center transition-all"
                              to="/settings"
                              style={{
                                color: 'var(--color-body)',
                                transition: 'var(--transition)'
                              }}
                            >
                              <div className="icon-wrapper rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  backgroundColor: 'rgba(27, 162, 219, 0.1)'
                                }}
                              >
                                <FontAwesomeIcon icon={faGear} style={{ color: 'var(--color-info)', fontSize: '16px' }} />
                              </div>
                              <div>
                                <span className="fw-medium" style={{ color: 'var(--color-heading)', fontSize: '16px' }}>Settings</span>
                                <small className="d-block" style={{ color: 'var(--color-body)', fontSize: '14px' }}>Configure your preferences</small>
                              </div>
                            </Link>
                          </div>

                          <div className="dropdown-divider my-0" style={{ borderColor: 'var(--color-border)' }}></div>

                          {/* Sign Out Button */}
                                // In the Header component, update the sign out button in the dropdown menu:
                          <button
                            className="btn w-100 d-flex align-items-center justify-content-center py-2 rounded-md"
                            onClick={() => {
                              onLogout(); // Call the logout handler
                              setIsProfileMenuOpen(false); // Close the dropdown
                            }}
                            style={{
                              backgroundColor: 'var(--color-lessdark)',
                              color: 'var(--color-danger)',
                              fontSize: '15px',
                              transition: 'var(--transition)'
                            }}
                          >
                            <FontAwesomeIcon icon={faSignOut} className="me-2" /> Sign out
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="header-btn">
                    <Link
                      className="btn btn-md fw-medium"
                      to="/signin"
                      style={{
                        borderRadius: "30px",
                        padding: "10px 24px",
                        background: "var(--dark-gradient-2)",
                        color: "var(--color-white)",
                        boxShadow: "var(--shadow-light)",
                        transition: "var(--transition)"
                      }}
                    >
                      Get Started
                    </Link>
                  </div>
                )}

                {/* Mobile Menu Toggle */}
                <div className="mobile-menu-bar ms-3 d-lg-none">
                  <button
                    className="btn rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: 'var(--color-lessdark)',
                      color: 'var(--color-body)',
                      boxShadow: 'var(--shadow-light)',
                      transition: 'var(--transition)'
                    }}
                    onClick={() => setIsMobileMenuOpen(true)}
                  >
                    <FontAwesomeIcon icon={faBars} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showAddModel && (
          <AddModelModal
            show={showAddModel}
            onHide={() => setShowAddModel(false)}
          />
        )}
      </header>

      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        onLogout={onLogout}
      />
    </>
  );
};

export default Header;