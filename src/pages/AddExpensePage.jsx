import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { usePaymentApps, usePaymentAccounts } from '../hooks/usePayment';
import { useCreateExpense } from '../hooks/useExpenses';

const AddExpensePage = () => {
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const { data: paymentApps } = usePaymentApps();
  const { data: paymentAccounts } = usePaymentAccounts();
  const createExpense = useCreateExpense();

  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentAppId, setPaymentAppId] = useState('');
  const [paymentAccountId, setPaymentAccountId] = useState('');
  const [notes, setNotes] = useState('');
  const [purpose, setPurpose] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const selectedCategory = categories?.find(c => c.id === categoryId);
  const subcategories = selectedCategory?.subcategories || [];
  const filteredApps = paymentMethod === 'UPI' ? paymentApps : null;
  const filteredAccounts = paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD' ? paymentAccounts : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const expenseData = {
      amount: parseFloat(amount),
      expenseDate,
      categoryId: categoryId || null,
      subcategoryId: subcategoryId || null,
      paymentMethod: paymentMethod || null,
      paymentAppId: paymentAppId || null,
      paymentAccountId: paymentAccountId || null,
      notes: notes || null,
      purpose: purpose || null,
    };

    createExpense.mutate(expenseData, {
      onSuccess: () => navigate('/'),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b">
        <button onClick={() => navigate(-1)} className="text-gray-500">Cancel</button>
        <h1 className="font-semibold text-gray-900">New Expense</h1>
        <div className="w-12"></div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
        {/* Amount */}
        <div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-4 text-3xl font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="0"
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <div className="flex gap-2 flex-wrap">
            {['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'WALLET'].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => {
                  setPaymentMethod(method);
                  setPaymentAppId('');
                  setPaymentAccountId('');
                }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  paymentMethod === method
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-700'
                }`}
              >
                {method.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Payment App (shown for UPI) */}
        {paymentMethod === 'UPI' && filteredApps && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment App</label>
            <select
              value={paymentAppId}
              onChange={(e) => setPaymentAppId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select app</option>
              {filteredApps.map((app) => (
                <option key={app.id} value={app.id}>{app.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Payment Account (shown for Card) */}
        {(paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') && filteredAccounts && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account/Card</label>
            <select
              value={paymentAccountId}
              onChange={(e) => setPaymentAccountId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select account</option>
              {filteredAccounts.map((account) => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setSubcategoryId('');
            }}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select category</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        {categoryId && subcategories.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
            <select
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Notes Toggle */}
        <button
          type="button"
          onClick={() => setShowNotes(!showNotes)}
          className="text-emerald-500 text-sm font-medium"
        >
          {showNotes ? '- Hide Notes' : '+ Add Note'}
        </button>

        {/* Notes (hidden by default) */}
        {showNotes && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., metro, office, tea"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g., office, interview, dinner with friends"
              />
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={createExpense.isPending}
          className="w-full bg-emerald-500 text-white py-4 rounded-xl font-medium text-lg hover:bg-emerald-600 transition disabled:opacity-50"
        >
          {createExpense.isPending ? 'Saving...' : 'Save Expense'}
        </button>
      </form>
    </div>
  );
};

export default AddExpensePage;
