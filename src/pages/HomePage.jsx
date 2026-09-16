import { Link } from 'react-router-dom';
import { useRecentExpenses } from '../hooks/useExpenses';
import { formatCurrency, formatDate } from '../utils/formatters';

const HomePage = () => {
  const { data: expenses, isLoading } = useRecentExpenses();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Brand Header */}
      <div className="bg-white px-6 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900">MoneyLog</h1>
        <p className="text-gray-500 mt-2">Track every penny</p>
      </div>

      {/* Add Expense Button */}
      <div className="px-6 -mt-6">
        <Link
          to="/add"
          className="block bg-emerald-500 text-white text-center py-4 rounded-2xl font-medium text-lg shadow-lg hover:bg-emerald-600 transition"
        >
          + Add Expense
        </Link>
      </div>

      {/* Recent Expenses */}
      <div className="px-6 mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent</h2>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
              </div>
            ))}
          </div>
        ) : expenses && expenses.length > 0 ? (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <Link
                key={expense.id}
                to={`/expense/${expense.id}`}
                className="block bg-white rounded-xl p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {expense.category?.name || 'Uncategorized'}
                      {expense.subcategory && ` → ${expense.subcategory.name}`}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {expense.paymentApp?.name || expense.paymentMethod || 'Payment'}
                      {expense.paymentAccount && ` • ${expense.paymentAccount.name}`}
                    </p>
                    {expense.notes && (
                      <p className="text-sm text-gray-400 mt-1">"{expense.notes}"</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(expense.expenseDate)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>No expenses yet</p>
            <p className="text-sm mt-1">Tap "+ Add Expense" to start tracking</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
