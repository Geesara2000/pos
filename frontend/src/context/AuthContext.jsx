import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../common/http';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('posUser');
    const storedToken = sessionStorage.getItem('posToken');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    let endpoint = '';

    if (email === 'admin@pos.com') {
      endpoint = apiUrl + 'admin/login';
    } else {
      endpoint = apiUrl + 'cashier/login';
    }

    try {
      const response = await axios.post(endpoint, { email, password });

      const userData = response.data.user;
      const token = response.data.token;

      // Save in session storage
      sessionStorage.setItem('posUser', JSON.stringify(userData));
      sessionStorage.setItem('posToken', token);

      // Set axios default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          'Login failed. Please check your credentials.',
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post(apiUrl + 'logout');
    } catch (e) {
      console.error('Logout failed:', e);
    }

    setUser(null);
    sessionStorage.removeItem('posUser');
    sessionStorage.removeItem('posToken');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAdmin: user?.role === 'admin',
    isCashier: user?.role === 'cashier',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
