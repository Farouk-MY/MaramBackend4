import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const TryModel = () => {
  const { id } = useParams();
  const [input, setInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [modelName, setModelName] = useState('AiWave');
  const [theme, setTheme] = useState('dark');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Set model name based on ID
    setModelName(id ? `AiWave ${id}` : 'AiWave');
    
    // Check if mobile view
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    // Initialize with welcome message
    setChatMessages([
      {
        type: 'bot',
        text: "Welcome to AiWave! I'm an advanced AI assistant ready to help with your questions, tasks, or creative projects. How can I assist you today?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage = {
      type: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, userMessage]);
    setProcessing(true);
    setInput('');
    setShowEmojiPicker(false);
    
    setTimeout(() => {
      const botResponse = {
        type: 'bot',
        text: `I'm processing your request: "${userMessage.text}". Here's what I found for you...`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prev => [...prev, botResponse]);
      setProcessing(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const regenerateResponse = () => {
    if (chatMessages.length > 0) {
      const lastBotMessage = [...chatMessages].reverse().find(msg => msg.type === 'bot');
      if (lastBotMessage) {
        setProcessing(true);
        setTimeout(() => {
          setChatMessages(chatMessages.map(msg => 
            msg === lastBotMessage ? 
            {...msg, text: "This is a regenerated response with improved information based on your query."} : 
            msg
          ));
          setProcessing(false);
        }, 1500);
      }
    }
  };

  // Example emoji list
  const emojis = ['😀', '👍', '🙏', '❤️', '👋', '🤔', '👏', '🎉', '🔍', '📝'];

  const addEmoji = (emoji) => {
    setInput(input + emoji);
  };

  return (
    <div className={`app-container ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      {/* Theme toggle button - floating */}
      <button 
        className="theme-toggle-btn" 
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'}`}></i>
      </button>

      {/* Main content */}
      <div className="container py-5 mt-4 mb-5">
        <div className="chat-card">
          {/* Chat header */}
          <div className="chat-header">
            <div className="d-flex align-items-center">
              <div className="avatar-container">
                <div className="avatar-icon-pulse"></div>
                <i className="bi bi-braces-asterisk fs-4"></i>
              </div>
              <div>
                <h5 className="mb-0 fw-bold fs-4">
                  {modelName} 
                  <span className="model-badge">Pro</span>
                </h5>
                <div className="status-indicator">
                  <i className="bi bi-circle-fill fs-6 me-1"></i>
                  <span>Online • Ready to assist</span>
                </div>
              </div>
            </div>
            
            <div className="header-actions">
              <button className="btn-icon" title="Save conversation">
                <i className="bi bi-bookmark"></i>
              </button>
              <button className="btn-icon" title="Share conversation">
                <i className="bi bi-share"></i>
              </button>
              <div className="dropdown">
                <button className="btn-icon" data-bs-toggle="dropdown" title="More options">
                  <i className="bi bi-three-dots"></i>
                </button>
                <div className="dropdown-menu dropdown-menu-end custom-dropdown">
                  <a className="dropdown-item" href="#"><i className="bi bi-file-earmark-text me-2"></i>Export chat</a>
                  <a className="dropdown-item" href="#"><i className="bi bi-trash me-2"></i>Clear conversation</a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item" href="#"><i className="bi bi-question-circle me-2"></i>Help</a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat messages */}
          <div className="messages-container" style={{ height: isMobile ? 'calc(100vh - 260px)' : '600px' }}>
            {chatMessages.map((message, index) => (
              <div 
                key={index} 
                className={`message-wrapper ${message.type === 'user' ? 'user-message' : 'bot-message'} animate__animated animate__fadeIn`}
              >
                {message.type === 'bot' && (
                  <div className="bot-avatar">
                    <div className="avatar-inner">
                      <i className="bi bi-robot"></i>
                    </div>
                  </div>
                )}
                
                <div className={`message ${message.type === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                  <div className="message-text">{message.text}</div>
                  <div className="message-footer">
                    <span className="message-time">{message.time}</span>
                    {message.type === 'bot' && (
                      <div className="message-actions">
                        <button className="action-btn" title="Copy to clipboard">
                          <i className="bi bi-clipboard"></i>
                        </button>
                        <button className="action-btn" title="Like">
                          <i className="bi bi-hand-thumbs-up"></i>
                        </button>
                        <button className="action-btn" title="Dislike">
                          <i className="bi bi-hand-thumbs-down"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {message.type === 'user' && (
                  <div className="user-avatar">
                    <div className="avatar-inner">
                      <span>AM</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {processing && (
              <div className="message-wrapper bot-message">
                <div className="bot-avatar">
                  <div className="avatar-inner">
                    <i className="bi bi-robot"></i>
                  </div>
                </div>
                
                <div className="message bot-bubble typing-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="input-container">
            <div className="input-wrapper">
              <textarea
                className="message-input"
                rows="3"
                placeholder="Type your message here..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
              ></textarea>
              
              <div className="input-actions">
                <button 
                  className="action-btn emoji-btn"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  title="Add emoji"
                >
                  <i className="bi bi-emoji-smile"></i>
                </button>
                <button 
                  className="action-btn"
                  title="Attach file"
                >
                  <i className="bi bi-paperclip"></i>
                </button>
                <button 
                  className={`send-btn ${!input.trim() || processing ? 'disabled' : ''}`}
                  onClick={sendMessage}
                  disabled={!input.trim() || processing}
                >
                  <i className="bi bi-send"></i>
                </button>
              </div>
              
              {showEmojiPicker && (
                <div className="emoji-picker">
                  {emojis.map((emoji, index) => (
                    <button 
                      key={index} 
                      className="emoji-item"
                      onClick={() => addEmoji(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {!isMobile && (
              <div className="input-footer">
                <div className="keyboard-hint">
                  <i className="bi bi-keyboard me-1"></i> Press Enter to send, Shift+Enter for new line
                </div>
                
                <div className="input-footer-actions">
                  <button 
                    className="secondary-btn"
                    onClick={() => setInput('')}
                  >
                    Clear
                  </button>
                  <button 
                    className="primary-btn"
                    onClick={regenerateResponse}
                  >
                    <i className="bi bi-arrow-repeat me-2"></i> Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>      
      
      {/* Bootstrap Icons CSS */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css" />
      
      {/* Animate.css for animations */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
      
      {/* Custom CSS */}
      <style>
        {`
          :root {
            --color-move: #CE99FF;
            --color-primary: #007BFF;
            --color-primary-alt: #0056b3;
            --color-secondary: #66B2FF;
            --color-primary-gradient-start: #007BFF;
            --color-primary-gradient-end: #66B2FF;
            --color-heading: #ffffff;
            --color-body: #BCC3D7;
            --color-link: #BCC3D7;
            --color-text-off: #565e78;
            --color-dark: #6b7aa5;
            --color-darker: rgba(6, 6, 6, 0.7);
            --color-darkest: rgba(0, 0, 0, 0.3);
            --color-lessdark: #2E313D;
            --color-black: #000000;
            --color-blackest: #16181E;
            --color-border: rgba(255, 255, 255, 0.05);
            --color-border-light: #e5e7eb;
            --color-border-dark: #1E1E1E;
            --dark-bg-1:#16181E;
            --dark-bg-2: #444f92;
            --dark-bg-3: #DDE7FF;
            --dark-bg-4: #EBEFFF;
            --dark-color-link: #55595C;
            --color-border-2: #C2D4FF;
            --color-strock: #EFEFFF;
            --dark-gradient-1: linear-gradient(180deg, rgba(19, 41, 123, 0.19) 0%, rgba(248, 248, 255, 0.19) 100%);
            --dark-gradient-2: linear-gradient(90deg, #007BFF 0%, #66B2FF 68.75%);
            --dark-gradient-3: linear-gradient(93deg, #D3E0FF 0.78%, rgba(221, 231, 255, 0.00) 97.43%);
            --dark-shadow-1: 0px 14px 36.7px 0px rgba(14, 12, 21, 0.06);
            --dark-shadow-2: 0px 26px 45.4px 0px rgba(186, 193, 225, 0.72);
            --color-bg-1: #0E0C15;
            --color-gray: #3E414B;
            --color-midgray: #878787;
            --color-light: #E4E6EA;
            --color-lighter: #CED0D4;
            --color-lightest: #F0F2F5;
            --color-white: #ffffff;
            --color-white-off: rgba(255, 255, 255, 0.05);
            --color-success: #3EB75E;
            --color-danger: #FF0003;
            --color-warning: #FFC876;
            --color-info: #1BA2DB;
            --transition: 0.3s;
            --radius: 12px;
            --radius-big: 16px;
            --radius-bigger: 50px;

            /* Theme variables */
            --theme-bg: var(--dark-bg-1);
            --theme-card-bg: var(--color-white);
            --theme-text: var(--color-lessdark);
            --theme-border: var(--color-border-light);
            --theme-input-bg: var(--color-lightest);
            --theme-input-text: var(--color-lessdark);
            --theme-shadow: var(--dark-shadow-2);
            --theme-secondary-text: var(--color-dark);
            --theme-hover: var(--dark-bg-3);
            --theme-scrollbar-track: var(--dark-bg-4);
            --theme-scrollbar-thumb: var(--color-border-2);
          }
          
          .theme-dark {
            --theme-bg: var(--color-bg-1);
            --theme-card-bg: var(--color-blackest);
            --theme-text: var(--color-body);
            --theme-border: var(--color-border-dark);
            --theme-input-bg: var(--color-lessdark);
            --theme-input-text: var(--color-light);
            --theme-shadow: 0px 10px 30px rgba(0, 0, 0, 0.25);
            --theme-secondary-text: var(--color-light);
            --theme-hover: var(--color-lessdark);
            --theme-scrollbar-track: var(--color-lessdark);
            --theme-scrollbar-thumb: var(--color-gray);
          }

          body {
            overflow-x: hidden;
            min-height: 100vh;
            font-size: 16px;
            background-color: var(--theme-bg);
            transition: background-color 0.5s ease;
            font-family: "Sora", sans-serif;
          }
          
          .app-container {
            min-height: 100vh;
            background: var(--theme-bg);
            background-image: 
              radial-gradient(circle at 10% 20%, rgba(var(--color-primary-rgb), 0.05) 0%, transparent 20%),
              radial-gradient(circle at 90% 80%, rgba(var(--color-secondary-rgb), 0.07) 0%, transparent 25%);
            transition: background-color 0.5s ease;
            padding-top: 12rem;
            position: relative;
          }
          
          .theme-dark .app-container {
            background-image: 
              radial-gradient(circle at 10% 20%, rgba(206, 153, 255, 0.1) 0%, transparent 20%),
              radial-gradient(circle at 90% 80%, rgba(0, 123, 255, 0.1) 0%, transparent 25%);
          }
          
          .chat-card {
            background: var(--theme-card-bg);
            border-radius: var(--radius-big);
            overflow: hidden;
            box-shadow: var(--theme-shadow);
            transition: all 0.4s ease;
            max-width: 1000px;
            min-height: 600px;
            margin: 0 auto;
            border: 1px solid var(--theme-border);
            display: flex;
            flex-direction: column;
          }
          
          .chat-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--theme-shadow), 0 15px 30px rgba(var(--color-primary-rgb), 0.1);
          }
          
          .chat-header {
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--theme-border);
            background: var(--theme-card-bg);
            color: var(--theme-text);
            position: relative;
            z-index: 1;
          }
          
          .avatar-container {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            margin-right: 16px;
            background: var(--dark-gradient-2);
            color: var(--color-white);
          }

          .avatar-icon-pulse {
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            background: transparent;
            border: 2px solid var(--color-primary);
            opacity: 0.7;
            animation: pulse-ring 2s ease infinite;
          }
          
          @keyframes pulse-ring {
            0% {
              transform: scale(0.95);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.3;
            }
            100% {
              transform: scale(0.95);
              opacity: 0.7;
            }
          }
          
          .status-indicator {
            display: flex;
            align-items: center;
            color: var(--theme-secondary-text);
            font-size: 0.9rem;
            margin-top: 4px;
          }
          
          .status-indicator i {
            color: var(--color-success);
            font-size: 10px;
          }
          
          .header-actions {
            display: flex;
            gap: 8px;
          }
          
          .btn-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--theme-border);
            background: transparent;
            color: var(--theme-text);
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .btn-icon:hover {
            background: var(--theme-hover);
            transform: translateY(-2px);
          }
          
          .messages-container {
            flex: 1;
            overflow-y: auto;
            padding: 25px;
            background: var(--theme-bg);
            position: relative;
          }
          
          .theme-dark .messages-container {
            background: rgba(0, 0, 0, 0.2);
          }
          
          .message-wrapper {
            display: flex;
            margin-bottom: 24px;
            animation-duration: 0.5s;
          }
          
          .user-message {
            justify-content: flex-end;
          }
          
          .bot-message {
            justify-content: flex-start;
          }
          
          .bot-avatar, .user-avatar {
            min-width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .bot-avatar {
            margin-right: 12px;
          }
          
          .user-avatar {
            margin-left: 12px;
          }
          
          .avatar-inner {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            color: var(--color-white);
          }
          
          .bot-avatar .avatar-inner {
            background: var(--dark-gradient-2);
          }
          
          .user-avatar .avatar-inner {
            background: linear-gradient(45deg, #CE99FF, #8E44AD);
          }
          
          .message {
            padding: 16px;
            border-radius: 18px;
            max-width: 75%;
            position: relative;
            font-size: 1.05rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          }
          
          .user-bubble {
            background: var(--dark-gradient-2);
            color: var(--color-white);
            border-bottom-right-radius: 4px;
          }
          
          .bot-bubble {
            background: var(--theme-card-bg);
            color: var(--theme-text);
            border-bottom-left-radius: 4px;
            border: 1px solid var(--theme-border);
          }
          
          .message-text {
            margin-bottom: 8px;
            line-height: 1.5;
          }
          
          .message-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.85rem;
          }
          
          .message-time {
            color: inherit;
            opacity: 0.8;
          }
          
          .message-actions {
            display: flex;
            gap: 8px;
          }
          
          .action-btn {
            background: transparent;
            border: none;
            color: inherit;
            opacity: 0.7;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            font-size: 1rem;
          }
          
          .action-btn:hover {
            opacity: 1;
            transform: translateY(-2px);
          }
          
          .typing-bubble {
            padding: 12px 16px;
          }
          
          .typing-indicator {
            display: flex;
            align-items: center;
            gap: 4px;
          }
          
          .typing-indicator span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--theme-text);
            opacity: 0.4;
            display: inline-block;
          }
          
          .typing-indicator span:nth-of-type(1) {
            animation: bounce 1.2s infinite 0.1s;
          }
          
          .typing-indicator span:nth-of-type(2) {
            animation: bounce 1.2s infinite 0.3s;
          }
          
          .typing-indicator span:nth-of-type(3) {
            animation: bounce 1.2s infinite 0.5s;
          }
          
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
              opacity: 0.4;
            }
            50% {
              transform: translateY(-5px);
              opacity: 1;
            }
          }
          
          .input-container {
            padding: 20px;
            background: var(--theme-card-bg);
            border-top: 1px solid var(--theme-border);
            position: relative;
            z-index: 1;
          }
          
          .input-wrapper {
            position: relative;
          }
          
          .message-input {
            width: 100%;
            min-height: 80px;
            padding: 16px;
            padding-right: 140px;
            border-radius: var(--radius);
            border: 1px solid var(--theme-border);
            background: var(--theme-input-bg);
            color: var(--theme-input-text);
            resize: none;
            font-size: 1.05rem;
            transition: all 0.3s ease;
            outline: none;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          }
          
          .message-input:focus {
            border-color: var(--color-primary);
            box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
          }
          
          .message-input::placeholder {
            color: var(--theme-secondary-text);
            opacity: 0.7;
          }
          
          .input-actions {
            position: absolute;
            bottom: 12px;
            right: 12px;
            display: flex;
            gap: 8px;
          }
          
          .action-btn.emoji-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid var(--theme-border);
          }
          
          .send-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--dark-gradient-2);
            color: var(--color-white);
            border: none;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .send-btn:hover {
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 5px 15px rgba(var(--color-primary-rgb), 0.3);
          }
          
          .send-btn.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }
          
          .emoji-picker {
            position: absolute;
            bottom: 100%;
            right: 0;
            background: var(--theme-card-bg);
            border: 1px solid var(--theme-border);
            border-radius: var(--radius);
            padding: 10px;
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-bottom: 8px;
            box-shadow: var(--theme-shadow);
            width: 250px;
            z-index: 100;
          }
          
          .emoji-item {
            font-size: 1.5rem;
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 5px;
            border-radius: var(--radius-small);
            transition: all 0.2s;
          }
          
          .emoji-item:hover {
            background: var(--theme-hover);
            transform: scale(1.1);
          }
          
          .input-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 16px;
            color: var(--theme-secondary-text);
          }
          
          .keyboard-hint {
            font-size: 0.9rem;
          }
          
          .input-footer-actions {
            display: flex;
            gap: 12px;
          }
          
          .secondary-btn {
            padding: 8px 16px;
            border-radius: var(--radius);
            border: 1px solid var(--theme-border);
            background: transparent;
            color: var(--theme-text);
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .secondary-btn:hover {
            background: var(--theme-hover);
          }
          
          .primary-btn {
            padding: 8px 16px;
            border-radius: var(--radius);
            border: none;
            background: var(--dark-gradient-2);
            color: var(--color-white);
            font-size: 0.95rem;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
          }
          
          .primary-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(var(--color-primary-rgb), 0.2);
          }
          
          .model-badge {
            display: inline-block;
            background: linear-gradient(45deg, #CE99FF, #9966FF);
            color: white;
            font-size: 0.65rem;
            padding: 2px 8px;
            border-radius: 10px;
            margin-left: 8px;
            vertical-align: middle;
            font-weight: bold;
            text-transform: uppercase;
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: ${theme === 'dark' ? '#212529' : '#f8f9fa'};
            border-radius: 8px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: ${theme === 'dark' ? '#495057' : '#ced4da'};
            border-radius: 8px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${theme === 'dark' ? '#6c757d' : '#adb5bd'};
          }
          
          /* Icon circle hover effect */
          .icon-circle {
            transition: all 0.3s ease;
          }
          
          .card:hover .icon-circle {
            transform: scale(1.1);
          }
          
          /* Button hover effects */
          .btn {
            transition: all 0.2s ease-in-out;
          }
          
          /* Message animations */
          .animate__fadeIn {
            animation-duration: 0.5s;
          }
          
          /* Dark mode transitions */
          .form-control, .card, .btn, .navbar {
            transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
          }
          
          .form-control:focus {
            box-shadow: 0 0 0 0.25rem ${theme === 'dark' ? 'rgba(13, 110, 253, 0.25)' : 'rgba(13, 110, 253, 0.25)'};
          }
          
          /* Increase font size globally */
          .form-control, .btn, p, span, div {
            font-size: 1.05rem;
          }
        `}
      </style>
    </div>
  );
};

export default TryModel;