import { usePOS } from '../../context/POSContext';
import Card from '../../components/Card';
import {
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const AdminDashboard = () => {
  const { products, users, transactions } = usePOS();

  const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
  const todaySales = transactions.filter(t => 
    new Date(t.date).toDateString() === new Date().toDateString()
  ).reduce((sum, t) => sum + t.total, 0);
  
  const lowStockProducts = products.filter(p => p.quantity < 10);
  const totalProducts = products.length;
  const activeUsers = users.filter(u => u.active).length;

  const statsCards = [
    {
      title: 'Total Sales',
      value: `$${totalSales.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: "Today's Sales",
      value: `$${todaySales.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Active Users',
      value: activeUsers,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <Card title="Low Stock Alert">
          {lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {lowStockProducts.slice(0, 5).map(product => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">Only {product.quantity} left</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-yellow-800 bg-yellow-200 px-2 py-1 rounded">
                    Low Stock
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">All products are well stocked!</p>
          )}
        </Card>

        {/* Recent Transactions */}
        <Card title="Recent Transactions">
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 5).map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">#{transaction.id}</p>
                    <p className="text-sm text-gray-600">{transaction.cashierName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${transaction.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No transactions yet</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;