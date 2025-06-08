import { createContext, useContext, useState, useEffect } from 'react';

const POSContext = createContext();

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};

export const POSProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [cart, setCart] = useState([]);
  const [settings, setSettings] = useState({
    tax: 10,
    globalDiscount: 0
  });

  // Initialize with mock data
  useEffect(() => {
    const mockProducts = [
      { id: 1, name: 'iPhone 14', price: 999, quantity: 50, barcode: '123456789', category: 'Electronics', description: 'Latest iPhone model' },
      { id: 2, name: 'Samsung Galaxy S23', price: 899, quantity: 30, barcode: '123456790', category: 'Electronics', description: 'Android flagship phone' },
      { id: 3, name: 'MacBook Pro', price: 1999, quantity: 20, barcode: '123456791', category: 'Electronics', description: 'Professional laptop' },
      { id: 4, name: 'AirPods Pro', price: 249, quantity: 100, barcode: '123456792', category: 'Electronics', description: 'Wireless earbuds' },
      { id: 5, name: 'iPad Air', price: 599, quantity: 40, barcode: '123456793', category: 'Electronics', description: 'Tablet for work and play' }
    ];

    const mockUsers = [
      { id: 2, name: 'Cashier One', email: 'cashier@pos.com', role: 'cashier', active: true },
      { id: 3, name: 'Cashier Two', email: 'cashier2@pos.com', role: 'cashier', active: true }
    ];

    const mockTransactions = [
      {
        id: 1,
        items: [{ id: 1, name: 'iPhone 14', price: 999, quantity: 1 }],
        total: 1098.9,
        tax: 99.9,
        discount: 0,
        cashierId: 2,
        cashierName: 'Cashier One',
        date: new Date().toISOString(),
        paymentMethod: 'Cash'
      }
    ];

    setProducts(mockProducts);
    setUsers(mockUsers);
    setTransactions(mockTransactions);
  }, []);

  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...updatedProduct, id } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addUser = (user) => {
    const newUser = { ...user, id: Date.now(), active: true };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id, updatedUser) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...updatedUser, id } : u));
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const processTransaction = (transactionData) => {
    const transaction = {
      id: Date.now(),
      ...transactionData,
      date: new Date().toISOString()
    };
    
    setTransactions(prev => [transaction, ...prev]);
    
    // Update product quantities
    transactionData.items.forEach(item => {
      setProducts(prev =>
        prev.map(p =>
          p.id === item.id
            ? { ...p, quantity: p.quantity - item.quantity }
            : p
        )
      );
    });
    
    clearCart();
    return transaction;
  };

  const value = {
    products,
    users,
    transactions,
    cart,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
    addUser,
    updateUser,
    deleteUser,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    processTransaction,
    setSettings
  };

  return (
    <POSContext.Provider value={value}>
      {children}
    </POSContext.Provider>
  );
};