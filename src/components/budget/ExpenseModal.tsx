import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { BudgetCategory, ExpenseItem, PaymentStatus } from '../../types/budget';
import { CATEGORY_LABELS } from '../../utils/budgetCalculations';
import { CurrencyCode } from '../../types/event';
import { CURRENCY_SYMBOLS } from '../../utils/formatters';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: ExpenseItem) => void;
  eventId: string;
  currency: CurrencyCode;
  initialData?: ExpenseItem | null;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  eventId,
  currency,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<BudgetCategory>('venue');
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [actualCost, setActualCost] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setEstimatedCost(initialData.estimatedCost);
      setActualCost(initialData.actualCost);
      setPaymentStatus(initialData.paymentStatus);
      setNotes(initialData.notes || '');
    } else {
      setName('');
      setCategory('venue');
      setEstimatedCost(0);
      setActualCost(0);
      setPaymentStatus('pending');
      setNotes('');
    }
    setError('');
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Expense name or description is required.');
      return;
    }
    if (estimatedCost < 0 || actualCost < 0) {
      setError('Amounts cannot be negative.');
      return;
    }

    const item: ExpenseItem = {
      id: initialData?.id || `exp-${Date.now()}`,
      eventId,
      category,
      name: name.trim(),
      estimatedCost: Number(estimatedCost) || 0,
      actualCost: Number(actualCost) || 0,
      paymentStatus,
      notes: notes.trim(),
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    onSave(item);
    onClose();
  };

  const symbol = CURRENCY_SYMBOLS[currency] || '$';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Expense Item' : 'Add New Expense Item'}
      subtitle="Track estimated vs actual vendor and milestone costs"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="expense-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Expense Item Name *
          </label>
          <input
            id="expense-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Lawn Lighting & Fairy Canopy, or Tasting Deposit"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label htmlFor="expense-category" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Category *
          </label>
          <select
            id="expense-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as BudgetCategory)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            {(Object.keys(CATEGORY_LABELS) as BudgetCategory[]).map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expense-estimated" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Estimated Cost ({symbol})
            </label>
            <input
              id="expense-estimated"
              type="number"
              min="0"
              step="10"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label htmlFor="expense-actual" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Actual Cost ({symbol})
            </label>
            <input
              id="expense-actual"
              type="number"
              min="0"
              step="10"
              value={actualCost}
              onChange={(e) => setActualCost(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="expense-payment-status" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Payment Status
          </label>
          <select
            id="expense-payment-status"
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="pending">Pending</option>
            <option value="deposit_paid">Deposit Paid</option>
            <option value="paid_in_full">Paid in Full</option>
          </select>
        </div>

        <div>
          <label htmlFor="expense-notes" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Notes & Terms (Optional)
          </label>
          <textarea
            id="expense-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contract reference, receipt number, balance due date..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-purple-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-bold text-white gradient-brand hover:opacity-95 shadow-md shadow-brand-500/20 transition active:scale-95"
          >
            {initialData ? 'Update Expense' : 'Add Expense'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

