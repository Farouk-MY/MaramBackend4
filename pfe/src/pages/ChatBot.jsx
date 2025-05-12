import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ChatBot from '../components/common/ChatBot';
import ProtectedRoute from '../components/common/ProtectedRoute';

const ChatBotPage = () => {
  return (
    <ProtectedRoute>
      <div className="wrapper">
        <Header />
        <div className="rn-service-area rn-section-gap">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-title text-center">
                  <h2 className="title">AI Assistant</h2>
                  <p>Ask questions about our services, AI models, or get help with your tasks.</p>
                </div>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-lg-12">
                <ChatBot />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default ChatBotPage;