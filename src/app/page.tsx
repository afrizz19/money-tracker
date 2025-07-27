'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiDollarSign, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { Transaction, Settings, MoneyTracker } from '@/types';

import DarkVeil from './background';
// Helper function to get current Jakarta time in datetime-local format
const getJakartaTime = () => {
  const now = new Date();
  const jakartaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  const year = jakartaTime.getFullYear();
  const month = String(jakartaTime.getMonth() + 1).padStart(2, '0');
  const day = String(jakartaTime.getDate()).padStart(2, '0');
  const hours = String(jakartaTime.getHours()).padStart(2, '0');
  const minutes = String(jakartaTime.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Helper function to format date for display in Jakarta timezone
const formatJakartaDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<Settings>({ initial_balance: 0, currency: 'IDR' });
  const [moneyTracker, setMoneyTracker] = useState<MoneyTracker>({
    total_income: 0,
    total_expenses: 0,
    current_balance: 0,
    initial_balance: 0
  });

  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInitialBalanceModal, setShowInitialBalanceModal] = useState(false);
  const [isInitialBalanceSet, setIsInitialBalanceSet] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    usage: '',
    date_time: getJakartaTime()
  });

  useEffect(() => {
    fetchTransactions();
    fetchSettings();
  }, []);

  const calculateMoneyTracker = useCallback(() => {
    const total_income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const total_expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const initial_balance = Number(settings.initial_balance) || 0;
    const current_balance = initial_balance + total_income - total_expenses;

    setMoneyTracker({
      total_income,
      total_expenses,
      current_balance,
      initial_balance
    });
  }, [transactions, settings]);

  useEffect(() => {
    calculateMoneyTracker();
  }, [calculateMoneyTracker]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(Array.isArray(data) ? data : []);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);

        // Check if initial balance is set (not 0 or null)
        if (data.initial_balance && data.initial_balance > 0) {
          setIsInitialBalanceSet(true);
        } else {
          // Show initial balance modal if not set
          setShowInitialBalanceModal(true);
        }
      } else {
        setSettings({ initial_balance: 0, currency: 'IDR' });
        setShowInitialBalanceModal(true);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSettings({ initial_balance: 0, currency: 'IDR' });
      setShowInitialBalanceModal(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({
          type: 'expense',
          amount: '',
          description: '',
          usage: '',
          date_time: getJakartaTime()
        });
        setShowForm(false);
        fetchTransactions();
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleInitialBalanceSetup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setShowInitialBalanceModal(false);
        setIsInitialBalanceSet(true);
        fetchSettings();
      }
    } catch (error) {
      console.error('Error setting initial balance:', error);
    }
  };

  const handleSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setShowSettings(false);
        fetchSettings();
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (transactionToDelete) {
      try {
        const response = await fetch(`/api/transactions/${transactionToDelete}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchTransactions();
        }
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
      setShowDeleteConfirm(false);
      setTransactionToDelete(null);
    }
  };

  const deleteTransaction = (id: number) => {
    setTransactionToDelete(id);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="absolute inset-0 -z-10">
        <DarkVeil />
      </div>
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <FiDollarSign className="text-green-500" />
            Money Tracker
          </h1>
          <button
            onClick={() => setShowSettings(true)}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            disabled={!isInitialBalanceSet}
          >
            <FiEdit />
            Settings
          </button>
        </div>

        {/* Money Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-2">Total Income</h3>
            <p className="text-2xl font-bold text-green-500">Rp {(moneyTracker.total_income || 0).toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-2">Total Expenses</h3>
            <p className="text-2xl font-bold text-red-500">Rp {(moneyTracker.total_expenses || 0).toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <h3 className="text-gray-400 text-sm mb-2">Current Balance</h3>
            <p className={`text-2xl font-bold ${(moneyTracker.current_balance || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              Rp {(moneyTracker.current_balance || 0).toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Add Transaction Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(true)}
            className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${isInitialBalanceSet
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-600 cursor-not-allowed'
              }`}
            disabled={!isInitialBalanceSet}
          >
            <FiPlus />
            Add Transaction
          </button>
          {!isInitialBalanceSet && (
            <p className="text-gray-400 text-sm mt-2">Please set your initial balance first</p>
          )}
        </div>

        {/* Transaction Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Amount (IDR)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={formData.amount}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          setFormData({ ...formData, amount: value });
                        }
                      }}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-12 py-2 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      required
                      placeholder="0"
                    />
                    <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col">
                      <button
                        type="button"
                        onClick={() => {
                          const currentValue = Number(formData.amount) || 0;
                          setFormData({ ...formData, amount: String(currentValue + 1000) });
                        }}
                        className="w-6 h-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-xs flex items-center justify-center border-b border-gray-600"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const currentValue = Number(formData.amount) || 0;
                          if (currentValue >= 1000) {
                            setFormData({ ...formData, amount: String(currentValue - 1000) });
                          }
                        }}
                        className="w-6 h-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-xs flex items-center justify-center"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                  {formData.amount && (
                    <p className="text-sm text-gray-400 mt-1">
                      {Number(formData.amount).toLocaleString('id-ID')} Rupiah
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Usage</label>
                  <input
                    type="text"
                    value={formData.usage}
                    onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={formData.date_time}
                    onChange={(e) => setFormData({ ...formData, date_time: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Settings</h2>
              <form onSubmit={handleSettingsUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="IDR">IDR (Rp)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Initial Balance Setup Modal */}
        {showInitialBalanceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Set Initial Balance</h2>
              <p className="text-gray-400 mb-4">Please set your initial balance. This can only be set once and cannot be changed later.</p>
              <form onSubmit={handleInitialBalanceSetup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Initial Balance (IDR)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">Rp</span>
                    <input
                      type="number"
                      step="1000"
                      min="0"
                      value={settings.initial_balance}
                      onChange={(e) => setSettings({ ...settings, initial_balance: Number(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-12 py-2 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      required
                      placeholder="0"
                    />
                    <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex flex-col">
                      <button
                        type="button"
                        onClick={() => {
                          const currentValue = Number(settings.initial_balance) || 0;
                          setSettings({ ...settings, initial_balance: currentValue + 1000 });
                        }}
                        className="w-6 h-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-xs flex items-center justify-center border-b border-gray-600"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const currentValue = Number(settings.initial_balance) || 0;
                          if (currentValue >= 1000) {
                            setSettings({ ...settings, initial_balance: currentValue - 1000 });
                          }
                        }}
                        className="w-6 h-3 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-xs flex items-center justify-center"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                  {settings.initial_balance > 0 && (
                    <p className="text-sm text-gray-400 mt-1">
                      {Number(settings.initial_balance).toLocaleString('id-ID')} Rupiah
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    Set Balance
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete this transaction?</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.type === 'income'
                        ? 'bg-green-900 text-green-300'
                        : 'bg-red-900 text-red-300'
                        }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-medium ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                        }`}>
                        Rp {Number(transaction.amount).toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.usage}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatJakartaDate(transaction.date_time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => deleteTransaction(transaction.id!)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Delete transaction"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
