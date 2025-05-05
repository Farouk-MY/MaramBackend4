import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faPlus,
  faUsers,
  faUserCheck,
  faCubes,
  faUserPlus,
  faArrowUp,
  faArrowDown,
  faEye,
  faEyeSlash,
  faChevronRight,
  faEdit,
  faTrash,
  faChevronLeft,
  faUser,
  faBan,
  faCheckCircle,
  faComment,
  faDatabase,
  faRefresh,
  faLock,
  faLockOpen,
  faFilter,
  faUserShield,
  faUserClock,
  faCircleExclamation,
  faShield
} from '@fortawesome/free-solid-svg-icons';
import {
  Table,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
  Form,
  Modal,
  Row,
  Col,
  InputGroup,
  Tooltip,
  OverlayTrigger,
  Dropdown,
  Container,
  Nav,
  ProgressBar
} from 'react-bootstrap';

function UserDashboard({ showModelsDashboard }) {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [blockAction, setBlockAction] = useState('block');
  const [sortConfig, setSortConfig] = useState({ key: 'full_name', direction: 'asc' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    is_admin: false,
    is_active: true,
    is_verified: true,
    is_blocked: false
  });

  // Stats calculation
  const stats = {
    total: users.length,
    active: users.filter(user => user.is_active).length,
    admins: users.filter(user => user.is_admin).length,
    blocked: users.filter(user => user.is_blocked).length
  };

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/v1/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
      setSuccessMessage('Users loaded successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle user creation
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const token = localStorage.getItem('token');

      const response = await fetch('http://127.0.0.1:8000/api/v1/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to create user');
      }

      const newUser = await response.json();
      setUsers([...users, newUser]);

      setSuccessMessage('User created successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowEditModal(false);
      setFormData({
        email: '',
        full_name: '',
        password: '',
        is_admin: false,
        is_active: true,
        is_verified: true,
        is_blocked: false
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle user update
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const token = localStorage.getItem('token');

      const response = await fetch(`http://127.0.0.1:8000/api/v1/admin/users/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to update user');
      }

      const updatedUser = await response.json();
      setUsers(users.map(user => user._id === updatedUser._id ? updatedUser : user));

      setSuccessMessage('User updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowEditModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/v1/admin/users/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter(user => user._id !== currentUser._id));
      setSuccessMessage('User deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle blocking/unblocking a user
  const handleBlockUser = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const endpoint = blockAction === 'block' ? 'block' : 'unblock';

      const response = await fetch(
          `http://127.0.0.1:8000/api/v1/admin/users/${currentUser._id}/${endpoint}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: blockAction === 'block' ? JSON.stringify({ reason: blockReason }) : null
          }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${blockAction} user`);
      }

      const updatedUser = await response.json();
      setUsers(users.map(user => user._id === updatedUser._id ? updatedUser : user));

      setSuccessMessage(`User ${blockAction}ed successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowBlockModal(false);
      setBlockReason('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Open edit modal
  const openEditModal = (user) => {
    setCurrentUser(user);
    setFormData({
      email: user.email,
      full_name: user.full_name,
      password: '', // Don't pre-fill password
      is_admin: user.is_admin,
      is_active: user.is_active,
      is_verified: user.is_verified,
      is_blocked: user.is_blocked || false
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (user) => {
    setCurrentUser(user);
    setShowDeleteModal(true);
  };

  // Open block/unblock modal
  const openBlockModal = (user, action) => {
    setCurrentUser(user);
    setBlockAction(action);
    setBlockReason(user.blocked_reason || '');
    setShowBlockModal(true);
  };

  // Request sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort users
  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Filter users based on search query and status filter
  const filteredUsers = sortedUsers.filter(user => {
    // First apply search filter
    const matchesSearch =
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Then apply status filter
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'active') return matchesSearch && user.is_active;
    if (statusFilter === 'inactive') return matchesSearch && !user.is_active;
    if (statusFilter === 'admins') return matchesSearch && user.is_admin;
    if (statusFilter === 'blocked') return matchesSearch && user.is_blocked;
    if (statusFilter === 'unverified') return matchesSearch && !user.is_verified;

    return matchesSearch;
  });

  // Render sort indicator
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return (
        <FontAwesomeIcon
            icon={sortConfig.direction === 'asc' ? faArrowUp : faArrowDown}
            className="ms-1"
        />
    );
  };

  // Tooltip for action buttons
  const renderTooltip = (text) => (
      <Tooltip id="button-tooltip">{text}</Tooltip>
  );

  // Generate initials for avatar
  const getInitials = (name) => {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
  };

  // Generate avatar background color based on name
  const getAvatarColor = (name) => {
    const colors = [
      'primary', 'success', 'danger', 'warning', 'info'
    ];

    const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  };

  return (
      <div className="fade-in">
        <div className="bg-white shadow-sm border-0 rounded-3 p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fs-4 fw-bold mb-1">
                <FontAwesomeIcon icon={faUsers} className="me-2 text-primary" />
                User Management
              </h2>
              <p className="text-muted mb-0">Manage user accounts, permissions and settings</p>
            </div>
            <div className="d-flex gap-2">
              <OverlayTrigger
                  placement="top"
                  overlay={renderTooltip('Toggle filters')}
              >
                <Button
                    variant={showFilters ? "primary" : "outline-primary"}
                    className="d-flex align-items-center"
                    onClick={() => setShowFilters(!showFilters)}
                >
                  <FontAwesomeIcon icon={faFilter} />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                  placement="top"
                  overlay={renderTooltip('Refresh users')}
              >
                <Button
                    variant="outline-secondary"
                    className="d-flex align-items-center"
                    onClick={fetchUsers}
                >
                  <FontAwesomeIcon icon={faRefresh} />
                </Button>
              </OverlayTrigger>
              <Button
                  variant="primary"
                  onClick={() => {
                    setCurrentUser(null);
                    setFormData({
                      email: '',
                      full_name: '',
                      password: '',
                      is_admin: false,
                      is_active: true,
                      is_verified: true,
                      is_blocked: false
                    });
                    setShowEditModal(true);
                  }}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add User
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="bg-light rounded-3 p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">Total Users</h6>
                  <div className="rounded-circle bg-primary bg-opacity-10 p-2 d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={faUsers} className="text-primary" />
                  </div>
                </div>
                <h3 className="mb-0">{stats.total}</h3>
                <div className="progress mt-2" style={{height: "4px"}}>
                  <div className="progress-bar bg-primary" style={{width: "100%"}}></div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="bg-light rounded-3 p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">Active Users</h6>
                  <div className="rounded-circle bg-success bg-opacity-10 p-2 d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={faUserCheck} className="text-success" />
                  </div>
                </div>
                <h3 className="mb-0">{stats.active}</h3>
                <div className="progress mt-2" style={{height: "4px"}}>
                  <div
                      className="progress-bar bg-success"
                      style={{width: `${stats.total ? (stats.active / stats.total) * 100 : 0}%`}}
                  ></div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="bg-light rounded-3 p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">Admin Users</h6>
                  <div className="rounded-circle bg-info bg-opacity-10 p-2 d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={faUserShield} className="text-info" />
                  </div>
                </div>
                <h3 className="mb-0">{stats.admins}</h3>
                <div className="progress mt-2" style={{height: "4px"}}>
                  <div
                      className="progress-bar bg-info"
                      style={{width: `${stats.total ? (stats.admins / stats.total) * 100 : 0}%`}}
                  ></div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="bg-light rounded-3 p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">Blocked Users</h6>
                  <div className="rounded-circle bg-danger bg-opacity-10 p-2 d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={faLock} className="text-danger" />
                  </div>
                </div>
                <h3 className="mb-0">{stats.blocked}</h3>
                <div className="progress mt-2" style={{height: "4px"}}>
                  <div
                      className="progress-bar bg-danger"
                      style={{width: `${stats.total ? (stats.blocked / stats.total) * 100 : 0}%`}}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-4">
            <div className="row g-3">
              <div className="col-lg-4">
                <div className="position-relative">
                  <Form.Control
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="ps-4 rounded-pill"
                  />
                  <FontAwesomeIcon
                      icon={faSearch}
                      className="position-absolute text-muted"
                      style={{ left: '15px', top: '13px' }}
                  />
                </div>
              </div>
              {showFilters && (
                  <>
                    <div className="col-lg-8">
                      <div className="d-flex gap-2 flex-wrap">
                        <Button
                            variant={statusFilter === 'all' ? 'primary' : 'outline-primary'}
                            size="sm"
                            onClick={() => setStatusFilter('all')}
                            className="rounded-pill"
                        >
                          All Users
                        </Button>
                        <Button
                            variant={statusFilter === 'active' ? 'success' : 'outline-success'}
                            size="sm"
                            onClick={() => setStatusFilter('active')}
                            className="rounded-pill"
                        >
                          <FontAwesomeIcon icon={faUserCheck} className="me-1" />
                          Active
                        </Button>
                        <Button
                            variant={statusFilter === 'inactive' ? 'secondary' : 'outline-secondary'}
                            size="sm"
                            onClick={() => setStatusFilter('inactive')}
                            className="rounded-pill"
                        >
                          <FontAwesomeIcon icon={faUserClock} className="me-1" />
                          Inactive
                        </Button>
                        <Button
                            variant={statusFilter === 'admins' ? 'info' : 'outline-info'}
                            size="sm"
                            onClick={() => setStatusFilter('admins')}
                            className="rounded-pill"
                        >
                          <FontAwesomeIcon icon={faUserShield} className="me-1" />
                          Admins
                        </Button>
                        <Button
                            variant={statusFilter === 'blocked' ? 'danger' : 'outline-danger'}
                            size="sm"
                            onClick={() => setStatusFilter('blocked')}
                            className="rounded-pill"
                        >
                          <FontAwesomeIcon icon={faLock} className="me-1" />
                          Blocked
                        </Button>
                        <Button
                            variant={statusFilter === 'unverified' ? 'warning' : 'outline-warning'}
                            size="sm"
                            onClick={() => setStatusFilter('unverified')}
                            className="rounded-pill"
                        >
                          <FontAwesomeIcon icon={faCircleExclamation} className="me-1" />
                          Unverified
                        </Button>
                      </div>
                    </div>
                  </>
              )}
            </div>
          </div>

          {/* Alerts */}
          {error && (
              <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-4">
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faBan} className="me-2 fs-5" />
                  <div>{error}</div>
                </div>
              </Alert>
          )}

          {successMessage && (
              <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible className="mb-4">
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2 fs-5" />
                  <div>{successMessage}</div>
                </div>
              </Alert>
          )}

          {/* Users Table */}
          {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" variant="primary" className="mb-2">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="text-muted">Loading users data...</p>
              </div>
          ) : (
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table hover className="align-middle mb-0">
                      <thead className="bg-light">
                      <tr>
                        <th
                            onClick={() => requestSort('full_name')}
                            style={{ cursor: 'pointer' }}
                            className="px-4 py-3"
                        >
                          <div className="d-flex align-items-center">
                            Name {renderSortIcon('full_name')}
                          </div>
                        </th>
                        <th
                            onClick={() => requestSort('email')}
                            style={{ cursor: 'pointer' }}
                            className="px-4 py-3"
                        >
                          <div className="d-flex align-items-center">
                            Email {renderSortIcon('email')}
                          </div>
                        </th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3 text-end">Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      {filteredUsers.length > 0 ? (
                          filteredUsers.map(user => (
                              <tr key={user._id}>
                                <td className="px-4 py-3">
                                  <div className="d-flex align-items-center">
                                    <div className={`avatar me-3 bg-${getAvatarColor(user.full_name)} bg-opacity-10 text-${getAvatarColor(user.full_name)} rounded-circle d-flex align-items-center justify-content-center`} style={{ width: '40px', height: '40px' }}>
                                      {getInitials(user.full_name)}
                                    </div>
                                    <div>
                                      <div className="fw-medium">{user.full_name}</div>
                                      <small className="text-muted">
                                        Joined: {new Date(user.created_at).toLocaleDateString()}
                                      </small>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div>{user.email}</div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="d-flex flex-wrap gap-1">
                                    <Badge
                                        bg={user.is_active ? 'success' : 'secondary'}
                                        className="rounded-pill"
                                    >
                                      <FontAwesomeIcon
                                          icon={user.is_active ? faCheckCircle : faUserClock}
                                          className="me-1"
                                      />
                                      {user.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                    <Badge
                                        bg={user.is_verified ? 'info' : 'warning'}
                                        className="rounded-pill"
                                    >
                                      <FontAwesomeIcon
                                          icon={user.is_verified ? faCheckCircle : faCircleExclamation}
                                          className="me-1"
                                      />
                                      {user.is_verified ? 'Verified' : 'Unverified'}
                                    </Badge>
                                    {user.is_blocked && (
                                        <Badge bg="danger" className="rounded-pill">
                                          <FontAwesomeIcon icon={faLock} className="me-1" />
                                          Blocked
                                        </Badge>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <Badge
                                      bg={user.is_admin ? 'primary' : 'info'}
                                      className="rounded-pill"
                                  >
                                    <FontAwesomeIcon
                                        icon={user.is_admin ? faUserShield : faUser}
                                        className="me-1"
                                    />
                                    {user.is_admin ? 'Admin' : 'User'}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 text-end">
                                  <div className="d-flex gap-2 justify-content-end">
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={renderTooltip('Edit user')}
                                    >
                                      <Button
                                          variant="light"
                                          size="sm"
                                          className="d-flex align-items-center p-2 rounded-circle"
                                          onClick={() => openEditModal(user)}
                                      >
                                        <FontAwesomeIcon icon={faEdit} className="text-primary" />
                                      </Button>
                                    </OverlayTrigger>

                                    {user.is_blocked ? (
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={renderTooltip('Unblock user')}
                                        >
                                          <Button
                                              variant="light"
                                              size="sm"
                                              className="d-flex align-items-center p-2 rounded-circle"
                                              onClick={() => openBlockModal(user, 'unblock')}
                                          >
                                            <FontAwesomeIcon icon={faLockOpen} className="text-success" />
                                          </Button>
                                        </OverlayTrigger>
                                    ) : (
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={renderTooltip('Block user')}
                                        >
                                          <Button
                                              variant="light"
                                              size="sm"
                                              className="d-flex align-items-center p-2 rounded-circle"
                                              onClick={() => openBlockModal(user, 'block')}
                                          >
                                            <FontAwesomeIcon icon={faLock} className="text-warning" />
                                          </Button>
                                        </OverlayTrigger>
                                    )}

                                    <OverlayTrigger
                                        placement="top"
                                        overlay={renderTooltip('View models')}
                                    >
                                      <Button
                                          variant="light"
                                          size="sm"
                                          className="d-flex align-items-center p-2 rounded-circle"
                                          onClick={() => showModelsDashboard(user.full_name)}
                                      >
                                        <FontAwesomeIcon icon={faDatabase} className="text-info" />
                                      </Button>
                                    </OverlayTrigger>

                                    <OverlayTrigger
                                        placement="top"
                                        overlay={renderTooltip('Delete user')}
                                    >
                                      <Button
                                          variant="light"
                                          size="sm"
                                          className="d-flex align-items-center p-2 rounded-circle"
                                          onClick={() => openDeleteModal(user)}
                                      >
                                        <FontAwesomeIcon icon={faTrash} className="text-danger" />
                                      </Button>
                                    </OverlayTrigger>
                                  </div>
                                </td>
                              </tr>
                          ))
                      ) : (
                          <tr>
                            <td colSpan="5" className="text-center py-5">
                              {searchQuery || statusFilter !== 'all' ? (
                                  <>
                                    <FontAwesomeIcon icon={faSearch} size="2x" className="text-muted mb-3" />
                                    <p className="mb-1 fw-medium">No users match your search criteria</p>
                                    <Button
                                        variant="link"
                                        onClick={() => {
                                          setSearchQuery('');
                                          setStatusFilter('all');
                                        }}
                                    >
                                      Clear filters
                                    </Button>
                                  </>
                              ) : (
                                  <>
                                    <FontAwesomeIcon icon={faUsers} size="2x" className="text-muted mb-3" />
                                    <p className="mb-1 fw-medium">No users found</p>
                                    <p className="text-muted">Create a new user to get started</p>
                                  </>
                              )}
                            </td>
                          </tr>
                      )}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>

                {filteredUsers.length > 0 && (
                    <Card.Footer className="bg-white border-0 p-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="text-muted">
                          Showing {filteredUsers.length} of {users.length} users
                        </div>
                        <div>
                          <Button variant="outline-primary" size="sm" className="rounded-pill">
                            <FontAwesomeIcon icon={faRefresh} className="me-1" />
                            Refresh Data
                          </Button>
                        </div>
                      </div>
                    </Card.Footer>
                )}
              </Card>
          )}

        </div>

        {/* Edit User Modal */}
        <Modal
            show={showEditModal}
            onHide={() => setShowEditModal(false)}
            centered
            backdrop="static"
            size="lg"
        >
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fw-bold">
              {currentUser ? (
                  <>
                    <FontAwesomeIcon icon={faEdit} className="text-primary me-2" />
                    Edit User: {currentUser.full_name}
                  </>
              ) : (
                  <>
                    <FontAwesomeIcon icon={faUserPlus} className="text-primary me-2" />
                    Add New User
                  </>
              )}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={currentUser ? handleUpdateUser : handleCreateUser}>
            <Modal.Body className="pt-0">
              <Row className="g-4">
                <Col md={6}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body>
                      <h5 className="mb-3 fs-6 fw-bold">Basic Information</h5>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">Full Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter full name"
                            className="rounded-3"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter email address"
                            className="rounded-3"
                        />
                      </Form.Group>

                      <Form.Group>
                        <Form.Label className="fw-medium">Password</Form.Label>
                        <InputGroup>
                          <Form.Control
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              required={!currentUser}
                              placeholder={currentUser ? "Leave blank to keep current" : "Enter password"}
                              className="rounded-start-3"
                          />
                          <Button
                              variant="outline-secondary"
                              onClick={() => setShowPassword(!showPassword)}
                              className="rounded-end-3"
                          >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                          </Button>
                        </InputGroup>
                        {currentUser && (
                            <Form.Text className="text-muted">
                              Leave blank to keep current password
                            </Form.Text>
                        )}
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body>
                      <h5 className="mb-3 fs-6 fw-bold">User Settings</h5>
                      <div className="mb-3 p-3 rounded-3 border">
                        <Form.Check
                            type="switch"
                            id="is_admin"
                            label="Admin Access"
                            name="is_admin"
                            checked={formData.is_admin}
                            onChange={handleInputChange}
                            className="fw-medium mb-2"
                        />
                        <p className="text-muted mb-0 small">
                          Admin users have full access to manage all users and system settings
                        </p>
                      </div>

                      <div className="mb-3 p-3 rounded-3 border">
                        <Form.Check
                            type="switch"
                            id="is_active"
                            label="Active Status"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleInputChange}
                            className="fw-medium mb-2"
                        />
                        <p className="text-muted mb-0 small">
                          Inactive users cannot log in to the system
                        </p>
                      </div>

                      <div className="p-3 rounded-3 border">
                        <Form.Check
                            type="switch"
                            id="is_verified"
                            label="Verified Status"
                            name="is_verified"
                            checked={formData.is_verified}
                            onChange={handleInputChange}
                            className="fw-medium mb-2"
                        />
                        <p className="text-muted mb-0 small">
                          Unverified users need to complete email verification process
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer className="border-0">
              <Button variant="light" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {currentUser ? 'Update User' : 'Create User'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            centered
            size="sm"
        >
          <Modal.Header closeButton className="border-0 bg-danger bg-opacity-10">
            <Modal.Title className="fw-bold text-danger">
              <FontAwesomeIcon icon={faTrash} className="me-2" />
              Delete User
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center mb-3">
              <div className="avatar mb-3 mx-auto bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                <FontAwesomeIcon icon={faTrash} size="lg" />
              </div>

              <h5>Are you sure?</h5>
              <p className="text-muted">
                This will permanently delete user <strong>{currentUser?.full_name}</strong>.
                This action cannot be undone.
              </p>
            </div>

            <div className="border rounded-3 p-3 bg-light mb-3">
              <div className="d-flex align-items-center">
                <div className={`avatar me-3 bg-${currentUser ? getAvatarColor(currentUser.full_name) : 'primary'} bg-opacity-10 text-${currentUser ? getAvatarColor(currentUser.full_name) : 'primary'} rounded-circle d-flex align-items-center justify-content-center`} style={{ width: '36px', height: '36px' }}>
                  {currentUser ? getInitials(currentUser.full_name) : ''}
                </div>
                <div>
                  <div className="fw-medium">{currentUser?.full_name}</div>
                  <small className="text-muted">{currentUser?.email}</small>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="light" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteUser}>
              <FontAwesomeIcon icon={faTrash} className="me-1" />
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Block/Unblock User Modal */}
        <Modal
            show={showBlockModal}
            onHide={() => setShowBlockModal(false)}
            centered
            size="md"
        >
          <Modal.Header
              closeButton
              className={`border-0 ${blockAction === 'block' ? 'bg-warning bg-opacity-10' : 'bg-success bg-opacity-10'}`}
          >
            <Modal.Title className="fw-bold">
              <FontAwesomeIcon
                  icon={blockAction === 'block' ? faLock : faLockOpen}
                  className={`me-2 ${blockAction === 'block' ? 'text-warning' : 'text-success'}`}
              />
              {blockAction === 'block' ? 'Block User' : 'Unblock User'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="border rounded-3 p-3 bg-light mb-4">
              <div className="d-flex align-items-center">
                <div className={`avatar me-3 bg-${currentUser ? getAvatarColor(currentUser.full_name) : 'primary'} bg-opacity-10 text-${currentUser ? getAvatarColor(currentUser.full_name) : 'primary'} rounded-circle d-flex align-items-center justify-content-center`} style={{ width: '36px', height: '36px' }}>
                  {currentUser ? getInitials(currentUser.full_name) : ''}
                </div>
                <div>
                  <div className="fw-medium">{currentUser?.full_name}</div>
                  <small className="text-muted">{currentUser?.email}</small>
                </div>
              </div>
            </div>

            {blockAction === 'block' ? (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Reason for blocking</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={blockReason}
                        onChange={(e) => setBlockReason(e.target.value)}
                        placeholder="Enter the reason for blocking this user..."
                        required
                        className="rounded-3"
                    />
                  </Form.Group>
                  <div className="alert alert-warning">
                    <FontAwesomeIcon icon={faCircleExclamation} className="me-2" />
                    <span>Blocking will immediately revoke all active sessions for this user.</span>
                  </div>
                </>
            ) : (
                <div className="alert alert-success">
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                  <span>Are you sure you want to unblock this user?</span>

                  {currentUser?.blocked_reason && (
                      <div className="mt-3 p-2 border rounded bg-white">
                        <small className="d-block fw-medium mb-1">Block reason was:</small>
                        <small className="text-muted">{currentUser.blocked_reason}</small>
                      </div>
                  )}
                </div>
            )}
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="light" onClick={() => setShowBlockModal(false)}>
              Cancel
            </Button>
            <Button
                variant={blockAction === 'block' ? 'warning' : 'success'}
                onClick={handleBlockUser}
            >
              <FontAwesomeIcon
                  icon={blockAction === 'block' ? faLock : faLockOpen}
                  className="me-1"
              />
              {blockAction === 'block' ? 'Block User' : 'Unblock User'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
  );
}

export default UserDashboard;