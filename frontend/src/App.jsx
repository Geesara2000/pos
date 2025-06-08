import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { POSProvider } from './context/POSContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductList from './pages/admin/ProductList';
import UserManagement from './pages/admin/UserManagement';
import Inventory from './pages/admin/Inventory';
import Reports from './pages/admin/Reports';
import Settings from './pages/admin/Settings';

// Cashier Pages
import CashierDashboard from './pages/cashier/CashierDashboard';
import Billing from './pages/cashier/Billing';
import SalesHistory from './pages/cashier/SalesHistory';

function App() {
  return (
    <AuthProvider>
      <POSProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<ProductList />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Cashier Routes */}
            <Route path="/cashier" element={
              <ProtectedRoute requiredRole="cashier">
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<CashierDashboard />} />
              <Route path="billing" element={<Billing />} />
              <Route path="history" element={<SalesHistory />} />
            </Route>

            {/* Default redirect based on role */}
            <Route path="/" element={<Navigate to="/login\" replace />} />
          </Routes>
        </Router>
      </POSProvider>
    </AuthProvider>
  );
}

export default App;