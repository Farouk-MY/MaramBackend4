import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Card, Button } from 'react-bootstrap';
import Sidebar from '../components/common/Sidebar';
import MainContent from '../components/common/MainContent';
import ModelsDashboard from '../components/common/ModelsDashboard';
import Dashboard from '../components/common/Dashboard';
import UserDashboard from '../components/common/UserDashboard';
import ReportsDashboard from '../components/common/ReportsDashboard';

function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedUser, setSelectedUser] = useState(null);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const showModelsDashboard = (userName) => {
    setSelectedUser(userName);
    setActiveView('models-dashboard');
  };

  const showUserDashboard = () => {
    setActiveView('user-dashboard');
  };

  const handleNavigation = (view) => {
    setActiveView(view);
    if (view === 'models-dashboard' && !selectedUser) {
      setSelectedUser('All Users');
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'user-dashboard':
        return <UserDashboard showModelsDashboard={showModelsDashboard} />;
      case 'models-dashboard':
        return (
            <ModelsDashboard
                showUserDashboard={showUserDashboard}
                selectedUser={selectedUser}
            />
        );
      case 'reports':
        return <ReportsDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
      <div className="d-flex h-100">
        <Sidebar
            collapsed={sidebarCollapsed}
            onNavigate={handleNavigation}
            activeView={activeView}
        />

        <MainContent
            toggleSidebar={toggleSidebar}
            sidebarCollapsed={sidebarCollapsed}
        >
          {renderActiveView()}
        </MainContent>
      </div>
  );
}

export default AdminDashboard;