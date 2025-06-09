import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../common/http';

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
      fetchProducts();
      setUsers([
        { id: 2, name: 'Cashier One', email: 'cashier@pos.com', role: 'cashier', active: true },
        { id: 3, name: 'Cashier Two', email: 'cashier2@pos.com', role: 'cashier', active: true },
      ]);
      setTransactions([
        {
          id: 1,
          items: [{ id: 1, name: 'iPhone 14', price: 999, quantity: 1 }],
          total: 1098.9,
          tax: 99.9,
          discount: 0,
          cashierId: 2,
          cashierName: 'Cashier One',
          date: new Date().toISOString(),
          paymentMethod: 'Cash',
        },
      ]);
  }, []);

  const fetchProducts = async () => {
    try {
      const token = sessionStorage.getItem('posToken');

      const response = await axios.get(apiUrl + 'products', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      setProducts(response.data); // ✅ correct
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };


  const addProduct = async (product) => {
    try {
      const token = sessionStorage.getItem('posToken');

      const response = await axios.post(apiUrl + 'products/store', product, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const newProduct = response.data.product;

      if (newProduct && newProduct.name && newProduct.id) {
        setProducts(prev => [...prev, newProduct]); 
      } else {
        console.warn('Invalid product data returned:', newProduct);
      }

    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      const token = sessionStorage.getItem('posToken');

      const response = await axios.post(apiUrl + `products/update/${id}`, updatedProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const updatedData = response.data.product || updatedProduct;

      setProducts(prev =>
        prev.map(p => (p.id === id ? { ...p, ...updatedData } : p))
      );
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };


  const deleteProduct = async (id) => {
    try {
      const token = sessionStorage.getItem('posToken');

      await axios.delete(apiUrl + `products/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Update local state if delete is successful
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
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