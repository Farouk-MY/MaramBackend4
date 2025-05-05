import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const ProfileDetails = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    email: '',
    full_name: '',
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [deletePassword, setDeletePassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch current user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view your profile');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfileData({
          email: response.data.email,
          full_name: response.data.full_name || '',
        });
      } catch (err) {
        console.error('Profile fetch error:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          setError('Your session has expired. Please log in again.');
        } else {
          setError(err.response?.data?.detail || 'Failed to fetch profile');
        }
      }
    };

    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to update your profile');
        setLoading(false);
        return;
      }

      const updateData = {
        email: profileData.email,
        full_name: profileData.full_name,
      };

      const response = await axios.put(
          `${API_BASE_URL}/auth/update-profile`,
          updateData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
      );

      setSuccess('Profile updated successfully');
      setProfileData({
        email: response.data.email,
        full_name: response.data.full_name || '',
      });
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (passwords.new !== passwords.confirm) {
      setError('New password and confirm password do not match');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to update your password');
        setLoading(false);
        return;
      }

      const updateData = {
        current_password: passwords.current,
        new_password: passwords.new,
      };

      await axios.put(`${API_BASE_URL}/auth/update-profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Password updated successfully');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      console.error('Password update error:', err);
      if (err.response?.status === 400 && err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to update password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to delete your account');
        setLoading(false);
        return;
      }

      await axios.delete(`${API_BASE_URL}/auth/delete-account`, {
        data: { password: deletePassword },
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Account deleted successfully');
      localStorage.removeItem('token');
      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      console.error('Account deletion error:', err);
      if (err.response?.status === 400 && err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to delete account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="rbt-main-content mb--0">
        <div className="rbt-daynamic-page-content center-width">
          <div className="rbt-dashboard-content">
            <div className="banner-area">
              <div className="settings-area">
                <h3 className="title">Profile Details</h3>
                <ul className="user-nav">
                  <li>
                    <Link to="/profile">
                      <span>Profile Details</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/notifications">
                      <span>Notifications</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/chat-export">
                      <span>Chat Export</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/appearance">
                      <span>Appearance</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/plans">
                      <span>Plans and Billing</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/sessions">
                      <span>Sessions</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="content-page pb--50">
              <div className="chat-box-list">
                <div className="single-settings-box profile-details-box overflow-hidden">
                  {error && <div className="alert alert-danger">{error}</div>}
                  {success && <div className="alert alert-success">{success}</div>}
                  <div className="profile-details-tab">
                    <div className="advance-tab-button mb--30">
                      <ul className="nav nav-tabs tab-button-style-2 justify-content-start">
                        <li>
                          <button
                              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                              onClick={() => setActiveTab('profile')}
                          >
                            <span className="title">Profile</span>
                          </button>
                        </li>
                        <li>
                          <button
                              className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
                              onClick={() => setActiveTab('password')}
                          >
                            <span className="title">Password</span>
                          </button>
                        </li>
                        <li>
                          <button
                              className={`tab-button ${activeTab === 'delete' ? 'active' : ''}`}
                              onClick={() => setActiveTab('delete')}
                          >
                            <span className="title">Delete Account</span>
                          </button>
                        </li>
                      </ul>
                    </div>

                    <div className="tab-content">
                      {activeTab === 'profile' && (
                          <div className="tab-pane fade show active">
                            <form
                                onSubmit={handleProfileUpdate}
                                className="rbt-profile-row rbt-default-form row row--15"
                            >
                              <div className="col-12">
                                <div className="form-group">
                                  <label htmlFor="email">Email</label>
                                  <input
                                      id="email"
                                      type="email"
                                      value={profileData.email}
                                      onChange={(e) =>
                                          setProfileData({ ...profileData, email: e.target.value })
                                      }
                                      required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-group">
                                  <label htmlFor="full_name">Full Name</label>
                                  <input
                                      id="full_name"
                                      type="text"
                                      value={profileData.full_name}
                                      onChange={(e) =>
                                          setProfileData({ ...profileData, full_name: e.target.value })
                                      }
                                  />
                                </div>
                              </div>
                              <div className="col-12 mt--20">
                                <div className="form-group mb--0">
                                  <button
                                      type="submit"
                                      className="btn-default"
                                      disabled={loading}
                                  >
                                    {loading ? 'Updating...' : 'Update Info'}
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                      )}

                      {activeTab === 'password' && (
                          <div className="tab-pane fade show active">
                            <form
                                onSubmit={handlePasswordUpdate}
                                className="rbt-profile-row rbt-default-form row row--15"
                            >
                              <div className="col-12">
                                <div className="form-group">
                                  <label htmlFor="currentpassword">Current Password</label>
                                  <input
                                      id="currentpassword"
                                      type="password"
                                      value={passwords.current}
                                      onChange={(e) =>
                                          setPasswords({ ...passwords, current: e.target.value })
                                      }
                                      required
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-group">
                                  <label htmlFor="newpassword">New Password</label>
                                  <input
                                      id="newpassword"
                                      type="password"
                                      value={passwords.new}
                                      onChange={(e) =>
                                          setPasswords({ ...passwords, new: e.target.value })
                                      }
                                      required
                                  />
                                  <small className="text-muted">
                                    Password must be at least 8 characters and include uppercase,
                                    lowercase letters and numbers
                                  </small>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-group">
                                  <label htmlFor="confirmpassword">Confirm New Password</label>
                                  <input
                                      id="confirmpassword"
                                      type="password"
                                      value={passwords.confirm}
                                      onChange={(e) =>
                                          setPasswords({ ...passwords, confirm: e.target.value })
                                      }
                                      required
                                  />
                                </div>
                              </div>
                              <div className="col-12 mt--20">
                                <div className="form-group mb--0">
                                  <button
                                      type="submit"
                                      className="btn-default"
                                      disabled={loading}
                                  >
                                    {loading ? 'Updating...' : 'Update Password'}
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                      )}

                      {activeTab === 'delete' && (
                          <div className="tab-pane fade show active">
                            <form
                                onSubmit={handleDeleteAccount}
                                className="rbt-profile-row rbt-default-form row row--15"
                            >
                              <div className="col-12 text-center">
                                <p className="mb--20">
                                  <strong>Warning: </strong>
                                  Deleting your account will permanently erase all your data and cannot be reversed.
                                  This includes your profile, conversations, comments, and any other info linked to
                                  your account. Are you sure you want to go ahead with deleting your account?
                                  Enter your password to confirm.
                                </p>
                              </div>
                              <div className="col-12">
                                <div className="form-group">
                                  <label htmlFor="deletepassword">Your Password</label>
                                  <input
                                      id="deletepassword"
                                      type="password"
                                      value={deletePassword}
                                      onChange={(e) => setDeletePassword(e.target.value)}
                                      required
                                  />
                                </div>
                              </div>
                              <div className="col-12 mt--20">
                                <div className="form-group mb--0">
                                  <button
                                      type="submit"
                                      className="btn-default btn-danger"
                                      disabled={loading}
                                  >
                                    <i className="fa-solid fa-trash-can"></i>{' '}
                                    {loading ? 'Deleting...' : 'Delete Account'}
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProfileDetails;