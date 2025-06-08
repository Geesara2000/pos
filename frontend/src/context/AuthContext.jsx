import { createContext, useContext, useState, useEffect } from 'react';

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

  // Mock users for demo
  const mockUsers = [
    { id: 1, email: 'admin@pos.com', password: 'admin123', role: 'admin', name: 'Admin User' },
    { id: 2, email: 'cashier@pos.com', password: 'cashier123', role: 'cashier', name: 'Cashier One' },
    { id: 3, email: 'cashier2@pos.com', password: 'cashier123', role: 'cashier', name: 'Cashier Two' }
  ];

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = sessionStorage.getItem('posUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = { ...foundUser };
      delete userData.password;
      setUser(userData);
      sessionStorage.setItem('posUser', JSON.stringify(userData));
      return { success: true };
    }
    
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('posUser');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAdmin: user?.role === 'admin',
    isCashier: user?.role === 'cashier'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};