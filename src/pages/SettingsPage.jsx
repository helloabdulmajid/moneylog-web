import { useState } from 'react';
import { useCategories, useCreateCategory, useDeleteCategory, useCreateSubcategory, useDeleteSubcategory } from '../hooks/useCategories';
import { usePaymentApps, usePaymentAccounts, useCreatePaymentApp, useCreatePaymentAccount } from '../hooks/usePayment';
import useAuthStore from '../store/authStore';

const SettingsPage = () => {
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('categories');
  
  const { data: categories } = useCategories();
  const { data: paymentApps } = usePaymentApps();
  const { data: paymentAccounts } = usePaymentAccounts();
  
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const createSubcategory = useCreateSubcategory();
  const deleteSubcategory = useDeleteSubcategory();
  const createPaymentApp = useCreatePaymentApp();
  const createPaymentAccount = useCreatePaymentAccount();

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [newAppName, setNewAppName] = useState('');
  const [newAppType, setNewAppType] = useState('UPI');
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState('BANK_ACCOUNT');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    createCategory.mutate({ name: newCategoryName }, {
      onSuccess: () => setNewCategoryName(''),
    });
  };

  const handleAddSubcategory = (e) => {
    e.preventDefault();
    if (!selectedCategoryId || !newSubcategoryName.trim()) return;
    createSubcategory.mutate({ categoryId: selectedCategoryId, data: { name: newSubcategoryName } }, {
      onSuccess: () => setNewSubcategoryName(''),
    });
  };

  const handleAddPaymentApp = (e) => {
    e.preventDefault();
    if (!newAppName.trim()) return;
    createPaymentApp.mutate({ name: newAppName, type: newAppType }, {
      onSuccess: () => setNewAppName(''),
    });
  };

  const handleAddPaymentAccount = (e) => {
    e.preventDefault();
    if (!newAccountName.trim()) return;
    createPaymentAccount.mutate({ name: newAccountName, type: newAccountType }, {
      onSuccess: () => setNewAccountName(''),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b">
        <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b">
        {['categories', 'payment'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium capitalize ${
              activeTab === tab
                ? 'text-emerald-500 border-b-2 border-emerald-500'
                : 'text-gray-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="px-6 py-4 space-y-6">
          {/* Add Category */}
          <form onSubmit={handleAddCategory} className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={createCategory.isPending}
              className="bg-emerald-500 text-white px-4 py-3 rounded-xl font-medium"
            >
              Add
            </button>
          </form>

          {/* Category List */}
          <div className="space-y-3">
            {categories?.map((category) => (
              <div key={category.id} className="bg-white rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{category.name}</span>
                  <button
                    onClick={() => deleteCategory.mutate(category.id)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                </div>
                
                {/* Subcategories */}
                {category.subcategories?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {category.subcategories.map((sub) => (
                      <span
                        key={sub.id}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        {sub.name}
                        <button
                          onClick={() => deleteSubcategory.mutate(sub.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Add Subcategory */}
                <div className="mt-3 flex gap-2">
                  <select
                    value={selectedCategoryId === category.id ? category.id : ''}
                    onChange={(e) => setSelectedCategoryId(category.id)}
                    className="hidden"
                  />
                  <input
                    type="text"
                    placeholder="Add subcategory"
                    value={selectedCategoryId === category.id ? newSubcategoryName : ''}
                    onChange={(e) => {
                      setSelectedCategoryId(category.id);
                      setNewSubcategoryName(e.target.value);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcategory}
                    className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Tab */}
      {activeTab === 'payment' && (
        <div className="px-6 py-4 space-y-6">
          {/* Add Payment App */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Payment Apps</h3>
            <form onSubmit={handleAddPaymentApp} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newAppName}
                onChange={(e) => setNewAppName(e.target.value)}
                placeholder="App name"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <select
                value={newAppType}
                onChange={(e) => setNewAppType(e.target.value)}
                className="px-3 py-3 border border-gray-200 rounded-xl"
              >
                <option value="UPI">UPI</option>
                <option value="WALLET">Wallet</option>
                <option value="BANK_APP">Bank App</option>
              </select>
              <button
                type="submit"
                disabled={createPaymentApp.isPending}
                className="bg-emerald-500 text-white px-4 py-3 rounded-xl font-medium"
              >
                Add
              </button>
            </form>
            <div className="space-y-2">
              {paymentApps?.map((app) => (
                <div key={app.id} className="bg-white rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900">{app.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({app.type})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Payment Account */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Payment Accounts</h3>
            <form onSubmit={handleAddPaymentAccount} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                placeholder="Account name"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <select
                value={newAccountType}
                onChange={(e) => setNewAccountType(e.target.value)}
                className="px-3 py-3 border border-gray-200 rounded-xl"
              >
                <option value="BANK_ACCOUNT">Bank Account</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="DEBIT_CARD">Debit Card</option>
                <option value="WALLET">Wallet</option>
                <option value="CASH">Cash</option>
              </select>
              <button
                type="submit"
                disabled={createPaymentAccount.isPending}
                className="bg-emerald-500 text-white px-4 py-3 rounded-xl font-medium"
              >
                Add
              </button>
            </form>
            <div className="space-y-2">
              {paymentAccounts?.map((account) => (
                <div key={account.id} className="bg-white rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900">{account.name}</span>
                    <span className="text-sm text-gray-500 ml-2">({account.type})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="px-6 mt-8">
        <button
          onClick={logout}
          className="w-full bg-red-50 text-red-500 py-3 rounded-xl font-medium hover:bg-red-100 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
