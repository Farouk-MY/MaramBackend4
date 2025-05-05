import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCube,
    faUserShield,
    faTachometerAlt,
    faUsers,
    faDatabase,
    faCog,
    faSignOutAlt,
    faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function Sidebar({ collapsed, onNavigate, activeView }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className={`sidebar bg-dark text-white ${collapsed ? 'sidebar-collapsed' : ''}`}
             style={{
                 width: collapsed ? '80px' : '250px',
                 transition: 'width 0.3s ease',
                 height: '100vh',
                 position: 'sticky',
                 top: 0,
                 display: 'flex',
                 flexDirection: 'column'
             }}>
            <div className="logo-container p-3 d-flex align-items-center">
                <div className="bg-primary rounded-circle p-2 d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={faCube} className="text-white" />
                </div>
                {!collapsed && <span className="logo-text ms-3 fw-bold fs-5">ModelAdmin</span>}
            </div>

            <div className="user-profile p-3 d-flex align-items-center">
                <div className="bg-primary bg-opacity-25 rounded-circle p-2 d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={faUserShield} className="text-primary" />
                </div>
                {!collapsed && (
                    <div className="ms-3">
                        <div className="sidebar-text fw-medium">Admin User</div>
                        <div className="sidebar-text text-white-50 small">Super Admin</div>
                    </div>
                )}
            </div>

            <nav className="p-2 flex-grow-1">
                <div
                    className={`nav-item d-flex align-items-center p-3 rounded mb-1 ${activeView === 'dashboard' ? 'active bg-primary bg-opacity-25' : ''}`}
                    onClick={() => onNavigate('dashboard')}
                    style={{ cursor: 'pointer' }}
                >
                    <FontAwesomeIcon icon={faTachometerAlt} />
                    {!collapsed && <span className="sidebar-text ms-3">Dashboard</span>}
                </div>
                <div
                    className={`nav-item d-flex align-items-center p-3 rounded mb-1 ${activeView === 'user-dashboard' ? 'active bg-primary bg-opacity-25' : ''}`}
                    onClick={() => onNavigate('user-dashboard')}
                    style={{ cursor: 'pointer' }}
                >
                    <FontAwesomeIcon icon={faUsers} />
                    {!collapsed && <span className="sidebar-text ms-3">Users</span>}
                </div>
                <div
                    className={`nav-item d-flex align-items-center p-3 rounded mb-1 ${activeView === 'models-dashboard' ? 'active bg-primary bg-opacity-25' : ''}`}
                    onClick={() => onNavigate('models-dashboard')}
                    style={{ cursor: 'pointer' }}
                >
                    <FontAwesomeIcon icon={faDatabase} />
                    {!collapsed && <span className="sidebar-text ms-3">Models</span>}
                </div>
                <div
                    className={`nav-item d-flex align-items-center p-3 rounded mb-1 ${activeView === 'reports' ? 'active bg-primary bg-opacity-25' : ''}`}
                    onClick={() => onNavigate('reports')}
                    style={{ cursor: 'pointer' }}
                >
                    <FontAwesomeIcon icon={faEnvelope} />
                    {!collapsed && <span className="sidebar-text ms-3">Reports</span>}
                </div>
                <div
                    className={`nav-item d-flex align-items-center p-3 rounded mb-1 ${activeView === 'settings' ? 'active bg-primary bg-opacity-25' : ''}`}
                    onClick={() => onNavigate('settings')}
                    style={{ cursor: 'pointer' }}
                >
                    <FontAwesomeIcon icon={faCog} />
                    {!collapsed && <span className="sidebar-text ms-3">Settings</span>}
                </div>
                <div
                    className="nav-item d-flex align-items-center p-3 rounded mb-1"
                    onClick={handleLogout}
                    style={{ cursor: 'pointer', color: '#ff6b6b' }}
                >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    {!collapsed && <span className="sidebar-text ms-3">Logout</span>}
                </div>
            </nav>
        </div>
    );
}

export default Sidebar;