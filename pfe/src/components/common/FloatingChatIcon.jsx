import React, { useState, useEffect } from 'react';
import { FaComments, FaTimes } from 'react-icons/fa';
import ChatBot from './ChatBot';


const FloatingChatIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(true);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };
    
    // Check initially
    checkAuth();
    
    // Set up event listener for storage changes (login/logout)
    window.addEventListener('storage', checkAuth);
    
    // Custom event for auth changes within the same window
    window.addEventListener('authChange', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);
  
  // Close chat when logging out
  useEffect(() => {
    if (!isAuthenticated) {
      setIsOpen(false);
    } else {
      // Show notification badge when authenticated
      setHasNewMessages(true);
    }
  }, [isAuthenticated]);
  
  // Clear notification badge when chat is opened
  useEffect(() => {
    if (isOpen) {
      setHasNewMessages(false);
    }
  }, [isOpen]);

  // Don't show the floating chat if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="floating-chat-container">
      {isOpen ? (
        <div className="floating-chat-window">
          <div className="floating-chat-header">
            <h5 className="mb-0">AI Assistant</h5>
            <button 
              className="close-button" 
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <FaTimes />
            </button>
          </div>
          <div className="floating-chat-body">
            <ChatBot isFloating={true} />
          </div>
        </div>
      ) : (
        <button 
          className="floating-chat-icon" 
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
        >
          <FaComments />
          {hasNewMessages && <span className="chat-notification-badge"></span>}
        </button>
      )}

      <style jsx="true">{`
        .floating-chat-container {
          position: fixed;
          bottom: 20px;
          right: 30px;
          z-index: 1000;
        }
        
        .floating-chat-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0066cc, #0044aa);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0, 102, 204, 0.5);
          transition: all 0.3s ease;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
          }
        }
        
        .floating-chat-icon:hover {
          transform: scale(1.1);
        }
        
        .chat-notification-badge {
          position: absolute;
          top: 0;
          right: 0;
          width: 14px;
          height: 14px;
          background-color: #ff4757;
          border-radius: 50%;
          border: 2px solid var(--background-color-1, #ffffff);
          animation: pulse-badge 1.5s infinite;
        }
        
        @keyframes pulse-badge {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.7);
          }
          70% {
            transform: scale(1.1);
            box-shadow: 0 0 0 5px rgba(255, 71, 87, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 71, 87, 0);
          }
        }
        
        .floating-chat-window {
          position: fixed;
          bottom: 60px;
          right: 40px;
          width: 350px;
          height: 500px;
          background-color: var(--background-color-1, #ffffff);
          color: var(--color-body, #1d1d24);
          border-radius: 15px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          z-index: 1001;
          animation: slideUp 0.3s ease-out;
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @media (max-width: 576px) {
          .floating-chat-window {
            width: calc(100% - 40px);
            right: 20px;
            left: 20px;
            height: 450px;
          }
          
          .floating-chat-container {
            bottom: 70px;
            right: 10px;
          }
          
          .floating-chat-icon {
            width: 50px;
            height: 50px;
            font-size: 20px;
          }
        }
        
        .floating-chat-header {
          background: linear-gradient(135deg, #0066cc, #0044aa);
          color: white;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: none;
        }
        
        .floating-chat-header h5 {
          font-weight: 600;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .close-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .close-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }
        
        .floating-chat-body {
          flex: 1;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default FloatingChatIcon;