import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPaperPlane, FaRobot, FaUser, FaSpinner } from 'react-icons/fa';
import '../../assets/css/chatbot.css';

const ChatBot = ({ isFloating = false }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  // Fetch chat history on component mount
  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/chatbot/chat-history`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.history && response.data.history.length > 0) {
        const formattedHistory = response.data.history.map(item => ([
          { type: 'user', content: item.message },
          { type: 'bot', content: item.response }
        ])).flat();
        setMessages(formattedHistory);
        setChatHistory(response.data.history);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages([...messages, { type: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/chatbot/chat`,
        { message: userMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(prev => [...prev, { type: 'bot', content: response.data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get response from chatbot');
      setMessages(prev => [...prev, { type: 'bot', content: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={isFloating ? "" : "container mt-4"}>
      <div className={isFloating ? "" : "row"}>
        <div className={isFloating ? "" : "col-md-12"}>
          <div className={isFloating ? "h-100" : "card"}>
            {!isFloating && (
              <div className="card-header text-white" style={{ 
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-alt))',
                borderBottom: 'none',
                borderRadius: '8px 8px 0 0',
                padding: '15px 20px'
              }}>
                <h5 className="mb-0 d-flex align-items-center">
                  <FaRobot className="me-2" style={{ filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.5))' }} /> 
                  <span style={{ fontWeight: '600', letterSpacing: '0.5px' }}>AI Assistant</span>
                </h5>
              </div>
            )}
            <div className={isFloating ? "h-100" : "card-body"}>
              <div 
                className="chat-messages p-3" 
                style={{ 
                  height: isFloating ? '380px' : '400px', 
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: isFloating ? 'var(--background-color-1)' : '',
                  backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  borderRadius: '8px'
                }}
              >
                {messages.length === 0 ? (
                  <div className="text-center text-muted my-auto p-4" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                    <div className="mb-4" style={{ color: 'var(--color-primary)' }}>
                      <FaRobot size={60} className="mb-3" style={{ filter: 'drop-shadow(0 0 8px var(--color-primary))' }} />
                    </div>
                    <h5 style={{ color: isFloating ? 'var(--color-heading)' : '#333' }}>Hello! I'm your AI Assistant</h5>
                    <p>Ask me about our AI models or how I can help with your tasks!</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`message ${msg.type === 'user' ? 'user-message text-end' : 'bot-message'} mb-3`}
                      style={{ animation: 'slideIn 0.3s ease-out' }}
                    >
                      <div 
                        className={`message-content d-inline-block p-3 rounded-lg shadow-sm ${msg.type === 'user' ? 'bg-primary text-white' : 'bg-light'}`}
                        style={{ 
                          maxWidth: '80%', 
                          textAlign: 'left',
                          borderRadius: msg.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          boxShadow: msg.type === 'user' ? '0 2px 5px rgba(0,123,255,0.2)' : '0 2px 5px rgba(0,0,0,0.05)',
                          background: msg.type === 'user' ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-alt))' : 'white'
                        }}
                      >
                        <div className="message-header mb-1" style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                          {msg.type === 'user' ? (
                            <><FaUser className="me-2" /> You</>
                          ) : (
                            <><FaRobot className="me-2" style={{ color: 'var(--color-primary)' }} /> AI Assistant</>
                          )}
                        </div>
                        <div className="message-body" style={{ fontSize: '1rem', lineHeight: '1.5' }}>
                          {typeof msg.content === 'string' ? msg.content.replace(/<\/?[a-z][^>]*>/g, '') : msg.content}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="message bot-message mb-3" style={{ animation: 'pulseIn 1.5s infinite' }}>
                    <div className="message-content d-inline-block p-3 rounded-lg shadow-sm bg-light" 
                      style={{ 
                        maxWidth: '80%',
                        borderRadius: '18px 18px 18px 4px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                      }}>
                      <div className="message-header mb-1" style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                        <FaRobot className="me-2" style={{ color: 'var(--color-primary)' }} /> AI Assistant
                      </div>
                      <div className="message-body d-flex align-items-center">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className={isFloating ? "p-3 border-top" : "card-footer"} style={{ background: 'rgba(255,255,255,0.05)' }}>
              <form onSubmit={handleSubmit}>
                <div className="input-group" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: '30px', overflow: 'hidden' }}>
                  <input
                    type="text"
                    className="form-control border-0"
                    placeholder="Ask me anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    style={{ padding: '12px 20px', fontSize: '0.95rem' }}
                  />
                  <button 
                    className="btn btn-primary" 
                    type="submit"
                    disabled={loading || !input.trim()}
                    style={{ 
                      borderRadius: '0 30px 30px 0', 
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-alt))',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? <FaSpinner className="fa-spin" /> : <FaPaperPlane />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;