import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePOS } from '../../context/POSContext';
import Card from '../../components/Card';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Scan,
  Receipt,
  CreditCard,
  DollarSign
} from 'lucide-react';

const Billing = () => {
  const { user } = useAuth();
  const { products, cart, addToCart, updateCartQuantity, removeFromCart, processTransaction, settings } = usePOS();
  const [searchTerm, setSearchTerm] = useState('');
  const [discount, setDiscount] = useState(settings.globalDiscount || 0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm)
  );

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxAmount = ((subtotal - discountAmount) * settings.tax) / 100;
  const total = subtotal - discountAmount + taxAmount;

  const handleProcessPayment = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    const transactionData = {
      items: cart,
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total,
      paymentMethod,
      cashierId: user.id,
      cashierName: user.name
    };

    const transaction = processTransaction(transactionData);
    alert(`Transaction completed! Receipt #${transaction.id}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Product Search & List */}
      <div className="lg:col-span-2 space-y-6">
        <Card title="Products">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name or scan barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <Scan className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.quantity > 10 
                      ? 'bg-green-100 text-green-800' 
                      : product.quantity > 0 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.quantity} left
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-primary-600">${product.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.quantity === 0}
                    className="btn-primary text-xs py-1 px-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No products found matching your search.
            </div>
          )}
        </Card>
      </div>

      {/* Cart & Checkout */}
      <div className="space-y-6">
        {/* Cart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Cart</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ShoppingCart className="h-4 w-4" />
              <span>{cart.length} items</span>
            </div>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                  <p className="text-xs text-gray-600">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="p-1 text-gray-600 hover:text-red-600"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="p-1 text-gray-600 hover:text-green-600"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 text-gray-600 hover:text-red-600 ml-2"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {cart.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Cart is empty
            </div>
          )}
        </Card>

        {/* Billing Summary */}
        {cart.length > 0 && (
          <Card title="Billing Summary">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span>Discount:</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
                  />
                  <span>%</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span>Tax ({settings.tax}%):</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>

              <hr className="border-gray-200" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Credit/Debit Card</option>
                  <option value="Digital">Digital Payment</option>
                </select>
              </div>

              <button
                onClick={handleProcessPayment}
                className="w-full btn-primary py-3 text-base flex items-center justify-center space-x-2"
              >
                {paymentMethod === 'Cash' ? (
                  <DollarSign className="h-5 w-5" />
                ) : (
                  <CreditCard className="h-5 w-5" />
                )}
                <span>Process Payment</span>
              </button>

              <button className="w-full btn-secondary text-sm flex items-center justify-center space-x-2">
                <Receipt className="h-4 w-4" />
                <span>Print Receipt</span>
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Billing;