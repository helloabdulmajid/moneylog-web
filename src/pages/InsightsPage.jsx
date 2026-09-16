import { useState } from 'react';
import { useMonthlySummary } from '../hooks/useAnalytics';
import { useExpenses } from '../hooks/useExpenses';
import { formatCurrency, getMonthName } from '../utils/formatters';

const InsightsPage = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());

  const { data: summary, isLoading: summaryLoading } = useMonthlySummary(month, year);
  const { data: expensesData, isLoading: expensesLoading } = useExpenses({ month, year, size: 50 });

  const expenses = expensesData?.content || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b">
        <h1 className="text-lg font-semibold text-gray-900">Insights</h1>
        
        {/* Month Selector */}
        <div className="flex gap-2 mt-3">
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
              <option key={m} value={m}>{getMonthName(m)}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Card */}
      <div className="px-6 py-4">
        {summaryLoading ? (
          <div className="bg-white rounded-2xl p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6">
            <p className="text-sm text-gray-500">Total Expense</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {formatCurrency(summary?.totalExpense || 0)}
            </p>
            {summary?.percentChange !== 0 && (
              <p className={`text-sm mt-2 ${summary?.percentChange > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                {summary?.percentChange > 0 ? '↑' : '↓'} {Math.abs(summary?.percentChange || 0)}% vs last month
              </p>
            )}
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      <div className="px-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">By Category</h2>
        {summaryLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : summary?.categoryBreakdown?.length > 0 ? (
          <div className="space-y-2">
            {summary.categoryBreakdown.map((cat, index) => (
              <div key={index} className="bg-white rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{cat.categoryName}</p>
                    <p className="text-sm text-gray-500">{cat.percentage}%</p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatCurrency(cat.total)}</p>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">No data</div>
        )}
      </div>

      {/* Account Breakdown */}
      <div className="px-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">By Account</h2>
        {summary?.accountBreakdown?.length > 0 ? (
          <div className="space-y-2">
            {summary.accountBreakdown.map((acc, index) => (
              <div key={index} className="bg-white rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-900">{acc.accountName}</p>
                  <p className="font-semibold text-gray-900">{formatCurrency(acc.total)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">No data</div>
        )}
      </div>

      {/* All Expenses */}
      <div className="px-6 mt-6 pb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">All Expenses</h2>
        {expensesLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : expenses.length > 0 ? (
          <div className="space-y-2">
            {expenses.map((expense) => (
              <div key={expense.id} className="bg-white rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {expense.category?.name || 'Uncategorized'}
                      {expense.subcategory && ` → ${expense.subcategory.name}`}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {expense.paymentApp?.name || expense.paymentMethod || ''}
                      {expense.paymentAccount && ` • ${expense.paymentAccount.name}`}
                    </p>
                    {expense.notes && (
                      <p className="text-sm text-gray-400 mt-1">"{expense.notes}"</p>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">No expenses this month</div>
        )}
      </div>
    </div>
  );
};

export default InsightsPage;
