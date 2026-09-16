import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Admin Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      // Calls POST http://localhost:5000/api/auth/login
      const response = await API.post('/auth/login', { email, password });
      
      const receivedToken = response.data.token;
      setToken(receivedToken);
      setUser(response.data.user);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate('/dashboard'); // Send admin to dashboard on success
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const studentLogin = async (email, fullName, password) => {
    setLoading(true);
    try {
      const response = await API.post('/auth/student-login', { email, fullName, password });
      const receivedToken = response.data.token;
      setToken(receivedToken);
      setUser(response.data.user);
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/student-dashboard');
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Student login failed' };
    } finally {
      setLoading(false);
    }
  };

  const changeStudentPassword = async (newPassword) => {
    setLoading(true);
    try {
      const response = await API.put('/auth/student-password', { newPassword });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Unable to change password' };
    } finally {
      setLoading(false);
    }
  };

  // Handle Admin Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, studentLogin, changeStudentPassword, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};