import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faDatabase,
  faArrowUp,
  faArrowDown,
  faChartLine,
  faUserCheck,
  faServer,
  faCode,
  faCalendarAlt,
  faEllipsisV
} from '@fortawesome/free-solid-svg-icons';

// Base URL for API
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

function Dashboard() {
  // State management
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalModels: 0,
    activeModels: 0,
    recentUsers: [],
    recentModels: [],
    userGrowth: 0,
    modelGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get auth token
  const getToken = () => localStorage.getItem('token');

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      
      // Fetch users
      const usersResponse = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Fetch models
      const modelsResponse = await fetch(`${API_BASE_URL}/models/admin/models`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!usersResponse.ok || !modelsResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const usersData = await usersResponse.json();
      const modelsData = await modelsResponse.json();
      
      // Calculate statistics
      const users = usersData.users || [];
      const models = modelsData.models || [];
      
      const activeUsers = users.filter(user => user.is_active).length;
      const activeModels = models.filter(model => model.active).length;
      
      // Get recent users and models (last 5)
      const recentUsers = [...users].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      ).slice(0, 5);
      
      const recentModels = [...models].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      ).slice(0, 5);
      
      // Mock growth data (in a real application, this would come from the API)
      const userGrowth = users.length > 0 ? 12.5 : 0; // Placeholder growth percentage
      const modelGrowth = models.length > 0 ? 8.3 : 0; // Placeholder growth percentage

      setStats({
        totalUsers: users.length,
        activeUsers,
        totalModels: models.length,
        activeModels,
        recentUsers,
        recentModels,
        userGrowth,
        modelGrowth
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load dashboard data on component mount
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Custom card color schemes
  const cardStyles = [
    { 
      bg: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', 
      text: 'white',
      iconBg: 'rgba(255, 255, 255, 0.2)'
    },
    { 
      bg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', 
      text: 'white',
      iconBg: 'rgba(255, 255, 255, 0.2)'
    },
    { 
      bg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', 
      text: 'white',
      iconBg: 'rgba(255, 255, 255, 0.2)'
    },
    { 
      bg: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', 
      text: 'white',
      iconBg: 'rgba(255, 255, 255, 0.2)'
    }
  ];

  if (loading) {
    return (
      <Container fluid className="py-5">
        <div className="text-center py-5">
          <div className="spinner-container p-5 rounded shadow-sm bg-white">
            <Spinner animation="border" role="status" variant="primary" style={{width: '3rem', height: '3rem'}}>
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-4 text-muted mb-0 fw-medium">Loading dashboard data...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger" className="shadow-sm border-0">
          <div className="d-flex align-items-center">
            <div className="fw-bold me-2">Error:</div>
            {error}
          </div>
          <Button variant="outline-danger" size="sm" className="mt-2" onClick={fetchDashboardStats}>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 fade-in bg-light">
      <div className="mb-4 px-2">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="display-6 fw-bold mb-1">Dashboard Overview</h2>
            <p className="text-muted mb-0">Welcome to your model administration dashboard</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="primary" className="d-flex align-items-center shadow-sm">
              <FontAwesomeIcon icon={faChartLine} className="me-2" />
              <span>Analytics</span>
            </Button>
            <Button variant="light" className="d-flex align-items-center border shadow-sm">
              <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
              <span>Last 30 Days</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={6} xl={3}>
          <Card className="border-0 rounded-3 shadow-sm overflow-hidden h-100" style={{background: cardStyles[0].bg}}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="icon-bg rounded-circle me-3 d-flex align-items-center justify-content-center" 
                     style={{background: cardStyles[0].iconBg, width: '48px', height: '48px'}}>
                  <FontAwesomeIcon icon={faUsers} className="text-white fa-lg" />
                </div>
                <div>
                  <h6 className="text-white-50 mb-1 fs-6">Total Users</h6>
                  <h3 className="mb-0 fw-bold text-white display-6">{stats.totalUsers}</h3>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <span className={`me-2 ${stats.userGrowth >= 0 ? 'text-white' : 'text-danger'} fw-bold`}>
                  <FontAwesomeIcon 
                    icon={stats.userGrowth >= 0 ? faArrowUp : faArrowDown} 
                    className="me-1" 
                  />
                  {Math.abs(stats.userGrowth)}%
                </span>
                <span className="text-white-50">vs. last month</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={3}>
          <Card className="border-0 rounded-3 shadow-sm overflow-hidden h-100" style={{background: cardStyles[1].bg}}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="icon-bg rounded-circle me-3 d-flex align-items-center justify-content-center" 
                     style={{background: cardStyles[1].iconBg, width: '48px', height: '48px'}}>
                  <FontAwesomeIcon icon={faUserCheck} className="text-white fa-lg" />
                </div>
                <div>
                  <h6 className="text-white-50 mb-1 fs-6">Active Users</h6>
                  <h3 className="mb-0 fw-bold text-white display-6">{stats.activeUsers}</h3>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <span className="text-white-50">
                  {stats.totalUsers > 0 
                    ? `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total users`
                    : 'No users available'}
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={3}>
          <Card className="border-0 rounded-3 shadow-sm overflow-hidden h-100" style={{background: cardStyles[2].bg}}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="icon-bg rounded-circle me-3 d-flex align-items-center justify-content-center" 
                     style={{background: cardStyles[2].iconBg, width: '48px', height: '48px'}}>
                  <FontAwesomeIcon icon={faDatabase} className="text-white fa-lg" />
                </div>
                <div>
                  <h6 className="text-white-50 mb-1 fs-6">Total Models</h6>
                  <h3 className="mb-0 fw-bold text-white display-6">{stats.totalModels}</h3>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <span className={`me-2 ${stats.modelGrowth >= 0 ? 'text-white' : 'text-danger'} fw-bold`}>
                  <FontAwesomeIcon 
                    icon={stats.modelGrowth >= 0 ? faArrowUp : faArrowDown} 
                    className="me-1" 
                  />
                  {Math.abs(stats.modelGrowth)}%
                </span>
                <span className="text-white-50">vs. last month</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={3}>
          <Card className="border-0 rounded-3 shadow-sm overflow-hidden h-100" style={{background: cardStyles[3].bg}}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="icon-bg rounded-circle me-3 d-flex align-items-center justify-content-center" 
                     style={{background: cardStyles[3].iconBg, width: '48px', height: '48px'}}>
                  <FontAwesomeIcon icon={faServer} className="text-white fa-lg" />
                </div>
                <div>
                  <h6 className="text-white-50 mb-1 fs-6">Active Models</h6>
                  <h3 className="mb-0 fw-bold text-white display-6">{stats.activeModels}</h3>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <span className="text-white-50">
                  {stats.totalModels > 0 
                    ? `${Math.round((stats.activeModels / stats.totalModels) * 100)}% of total models`
                    : 'No models available'}
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Section */}
      <Row className="g-4">
        {/* Recent Users */}
        <Col lg={6}>
          <Card className="border-0 rounded-3 shadow-sm">
            <Card.Header className="bg-white p-4 border-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Recent Users</h5>
              <div>
                <Button variant="outline-primary" size="sm" className="rounded-pill me-2">View All</Button>
                <Button variant="light" size="sm" className="rounded-circle p-2">
                  <FontAwesomeIcon icon={faEllipsisV} />
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover className="mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4 py-3">Name</th>
                    <th className="py-3">Email</th>
                    <th className="pe-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsers.length > 0 ? (
                    stats.recentUsers.map((user, index) => (
                      <tr key={user._id || index} className="highlight-row">
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center">
                            <div className="avatar-circle bg-primary bg-opacity-10 text-primary rounded-circle p-3 d-flex align-items-center justify-content-center">
                              {user.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ms-3">
                              <div className="fw-medium">{user.full_name}</div>
                              <div className="text-muted small">{user.is_admin ? 'Admin' : 'User'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">{user.email}</td>
                        <td className="pe-4 py-3">
                          <div className="d-flex align-items-center">
                            <div className="me-2 small rounded-pill bg-light px-2 py-1">
                              {formatDate(user.created_at)}
                            </div>
                            <div className={`status-indicator rounded-circle ${user.is_active ? 'bg-success' : 'bg-secondary'}`} 
                                 style={{width: '8px', height: '8px'}}>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-5">
                        <div className="d-flex flex-column align-items-center">
                          <FontAwesomeIcon icon={faUsers} size="2x" className="text-muted mb-3" />
                          <p className="mb-0">No users found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Models */}
        <Col lg={6}>
          <Card className="border-0 rounded-3 shadow-sm">
            <Card.Header className="bg-white p-4 border-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Recent Models</h5>
              <div>
                <Button variant="outline-primary" size="sm" className="rounded-pill me-2">View All</Button>
                <Button variant="light" size="sm" className="rounded-circle p-2">
                  <FontAwesomeIcon icon={faEllipsisV} />
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover className="mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4 py-3">Name</th>
                    <th className="py-3">Type</th>
                    <th className="pe-4 py-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentModels.length > 0 ? (
                    stats.recentModels.map((model, index) => (
                      <tr key={model.id || index} className="highlight-row">
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center">
                            <div className={`avatar-circle rounded-circle p-3 d-flex align-items-center justify-content-center text-white`}
                                 style={{backgroundColor: ['#6366F1', '#10B981', '#F59E0B', '#3B82F6'][index % 4]}}>
                              <FontAwesomeIcon icon={faDatabase} />
                            </div>
                            <div className="ms-3">
                              <div className="fw-medium">{model.name}</div>
                              <div className="text-muted small">{model.active ? 'Active' : 'Inactive'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                            {model.type || "Unknown"}
                          </span>
                        </td>
                        <td className="pe-4 py-3">
                          <div className="small rounded-pill bg-light px-2 py-1 d-inline-block">
                            {formatDate(model.created_at)}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-5">
                        <div className="d-flex flex-column align-items-center">
                          <FontAwesomeIcon icon={faDatabase} size="2x" className="text-muted mb-3" />
                          <p className="mb-0">No models found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Additional styling */}
      <style jsx>{`
        .avatar-circle {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .highlight-row:hover {
          background-color: rgba(0, 0, 0, 0.02);
          cursor: pointer;
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </Container>
  );
}

export default Dashboard;