import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Container, Button } from 'react-bootstrap';

function MainContent({ toggleSidebar, sidebarCollapsed, children }) {
  return (
    <div className="main-content flex-grow-1 bg-light" style={{ minHeight: '100vh', transition: 'margin-left 0.3s ease' }}>
      <header className="bg-white shadow-sm p-3 d-flex align-items-center">
        <Button 
          variant="light" 
          className="border-0 me-3"
          onClick={toggleSidebar}
        >
          <FontAwesomeIcon icon={faBars} />
        </Button>
        <div className="d-flex justify-content-between align-items-center w-100">
          <h5 className="mb-0">Model Administration System</h5>
          <div className="d-flex align-items-center">
            <span className="text-muted me-3">{new Date().toLocaleDateString()}</span>
            <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 d-flex align-items-center justify-content-center">
              <FontAwesomeIcon icon={faUserCircle} />
            </div>
          </div>
        </div>
      </header>

      <div className="content-area">
        {children}
      </div>
    </div>
  );
}

export default MainContent;