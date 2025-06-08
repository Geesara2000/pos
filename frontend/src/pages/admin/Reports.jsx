import { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import Card from '../../components/Card';
import Table from '../../components/Table';
import { 
  Download, 
  Calendar,
  DollarSign,
  TrendingUp,
  Package,
  Users
} from 'lucide-react';

const Reports = () => {
  const { transactions, products } = usePOS();
  const [dateRange, setDateRange] = useState('today');

  const getDateFilter = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (dateRange) {
      case 'today':
        return (date) => new Date(date) >= today;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return (date) => new Date(date) >= weekAgo;
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return (date) => new Date(date) >= monthAgo;
      default:
        return () => true;
    }
  };

  const filteredTransactions = transactions.filter(t => getDateFilter()(t.date));
  
  const salesStats = {
    totalSales: filteredTransactions.reduce((sum, t) => sum + t.total, 0),
    totalTransactions: filteredTransactions.length,
    averageTransaction: filteredTransactions.length > 0 
      ? filteredTransactions.reduce((sum, t) => sum + t.total, 0) / filteredTransactions.length 
      : 0,
    totalTax: filteredTransactions.reduce((sum, t) => sum + (t.tax || 0), 0)
  };

  // Calculate top selling products
  const productSales = {};
  filteredTransactions.forEach(transaction => {
    transaction.items.forEach(item => {
      if (productSales[item.id]) {
        productSales[item.id].quantity += item.quantity;
        productSales[item.id].revenue += item.price * item.quantity;
      } else {
        productSales[item.id] = {
          name: item.name,
          quantity: item.quantity,
          revenue: item.price * item.quantity
        };
      }
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  const handleExport = (type) => {
    // This would typically make an API call to generate and download the report
    alert(`Exporting ${type} report for ${dateRange}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Sales Reports</h1>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field w-40"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
          <button
            onClick={() => handleExport('PDF')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => handleExport('Excel')}
            className="btn-primary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Sales Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">${salesStats.totalSales.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{salesStats.totalTransactions}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Transaction</p>
              <p className="text-2xl font-bold text-gray-900">${salesStats.averageTransaction.toFixed(2)}</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tax</p>
              <p className="text-2xl font-bold text-gray-900">${salesStats.totalTax.toFixed(2)}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <Card title="Top Selling Products">
          {topProducts.length > 0 ? (
            <Table headers={['Product', 'Qty Sold', 'Revenue']}>
              {topProducts.map((product, index) => (
                <tr key={index} className="table-row">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-primary-100 text-primary-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </Table>
          ) : (
            <p className="text-gray-500 text-center py-8">No sales data available</p>
          )}
        </Card>

        {/* Recent Transactions */}
        <Card title="Recent Transactions">
          {filteredTransactions.length > 0 ? (
            <Table headers={['Transaction ID', 'Cashier', 'Total', 'Date']}>
              {filteredTransactions.slice(0, 10).map((transaction) => (
                <tr key={transaction.id} className="table-row">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.cashierName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${transaction.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </Table>
          ) : (
            <p className="text-gray-500 text-center py-8">No transactions found</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Reports;