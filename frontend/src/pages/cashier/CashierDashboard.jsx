import { useAuth } from '../../context/AuthContext';
import { usePOS } from '../../context/POSContext';
import Card from '../../components/Card';
import { DollarSign, Receipt, TrendingUp, Clock } from 'lucide-react';

const CashierDashboard = () => {
  const { user } = useAuth();
  const { transactions } = usePOS();

  // Filter transactions for current cashier and today
  const today = new Date().toDateString();
  const myTransactions = transactions.filter(t => 
    t.cashierId === user.id && new Date(t.date).toDateString() === today
  );

  const todaySales = myTransactions.reduce((sum, t) => sum + t.total, 0);
  const transactionCount = myTransactions.length;
  const averageTransaction = transactionCount > 0 ? todaySales / transactionCount : 0;

  const recentTransactions = myTransactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Current Time</div>
          <div className="text-lg font-semibold text-gray-900">
            {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Sales</p>
              <p className="text-2xl font-bold text-gray-900">${todaySales.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{transactionCount}</p>
            </div>
            <Receipt className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Transaction</p>
              <p className="text-2xl font-bold text-gray-900">${averageTransaction.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/cashier/billing"
            className="flex items-center p-4 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors duration-200"
          >
            <Receipt className="h-8 w-8 text-primary-600 mr-4" />
            <div>
              <h3 className="font-semibold text-primary-900">Start New Sale</h3>
              <p className="text-sm text-primary-700">Process customer transactions</p>
            </div>
          </a>

          <a
            href="/cashier/history"
            className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <Clock className="h-8 w-8 text-gray-600 mr-4" />
            <div>
              <h3 className="font-semibold text-gray-900">View Sales History</h3>
              <p className="text-sm text-gray-700">Check past transactions</p>
            </div>
          </a>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card title="Recent Transactions">
        {recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Transaction #{transaction.id}</p>
                  <p className="text-sm text-gray-600">
                    {transaction.items.length} item(s) • {transaction.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${transaction.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No transactions today yet</p>
            <a href="/cashier/billing" className="text-primary-600 hover:text-primary-800 font-medium">
              Start your first sale →
            </a>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CashierDashboard;