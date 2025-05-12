import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import ThemeSwitcher from './components/common/ThemeSwitcher';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';
import TryModel from './pages/TryModel';
import HowToUse from './pages/HowToUse';
import ProfileDetails from './pages/ProfileDetails';
import Contact from './pages/Contact'; // Import the new Contact component
import ChatBot from './pages/ChatBot'; // Import the ChatBot page
import BackToTop from './components/common/BackToTop';
import FloatingChatIcon from './components/common/FloatingChatIcon'; // Import the FloatingChatIcon component
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from "./components/common/AdminRoute";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminDashboard = location.pathname.startsWith('/admin');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.classList.toggle('active-dark-mode', savedTheme === 'dark');
    document.body.classList.toggle('active-light-mode', savedTheme === 'light');

    const checkAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const userData = await response.json();

        setUser({
          id: userData._id,
          name: userData.full_name,
          email: userData.email,
          isVerified: userData.is_verified,
          isAdmin: userData.is_admin || false,
        });

        // Rediriger vers /admin si l'utilisateur est admin et sur la page d'accueil
        if (userData.isAdmin && location.pathname === '/') {
          navigate('/admin');
        }

      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
        if (location.pathname.startsWith('/admin')) {
          navigate('/signin');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname, navigate]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.classList.toggle('active-dark-mode', newTheme === 'dark');
    document.body.classList.toggle('active-light-mode', newTheme === 'light');
  };

  const handleLogin = async (token, userData) => {
    localStorage.setItem('token', token);

    const userInfo = {
      id: userData._id,
      name: userData.full_name,
      email: userData.email,
      isVerified: userData.is_verified,
      isAdmin: userData.is_admin || false,
    };

    setUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
    
    // Dispatch custom event for auth change
    window.dispatchEvent(new Event('authChange'));

    // Use userData.is_admin directly for the redirection decision
    if (userData.is_admin === true) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        await fetch('http://127.0.0.1:8000/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    
    // Dispatch custom event for auth change
    window.dispatchEvent(new Event('authChange'));
    
    navigate('/signin');
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <main className="page-wrapper">
      <ToastContainer />
      <ThemeSwitcher currentTheme={theme} toggleTheme={toggleTheme} />
      {!isAdminDashboard && <Header user={user} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route 
          path="/signin" 
          element={user ? <Navigate to={user.isAdmin ? "/admin" : "/"} /> : <SignIn onLogin={handleLogin} />} 
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to={user.isAdmin ? "/admin" : "/"} /> : <SignUp />} 
        />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/try-model/:id" element={<TryModel />} />
        <Route path="/how-to-use" element={<HowToUse />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute user={user}>
              <ProfileDetails user={user} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            user?.isAdmin ? 
              <AdminDashboard /> : 
              <Navigate to="/" />
          } 
        />
      </Routes>
      {!isAdminDashboard && <Footer />}
      {/* Replaced BackToTop with FloatingChatIcon as requested */}
      <FloatingChatIcon />
    </main>
  );
}

export default App;