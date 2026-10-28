import React, { useState } from 'react';
import { 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle, 
  Clock, 
  DollarSign 
} from 'lucide-react';
import { BudgetCategory, ExpenseItem, PaymentStatus } from '../../types/budget';
import { CurrencyCode } from '../../types/event';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../../utils/budgetCalculations';
import { formatCurrency } from '../../utils/formatters';

interface ExpenseTableProps {
  expenses: ExpenseItem[];
  currency: CurrencyCode;
  onEdit: (item: ExpenseItem) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  currency,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filtered = expenses.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.paymentStatus === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'paid_in_full':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Paid in Full
          </span>
        );
      case 'deposit_paid':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Deposit Paid
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            <Clock className="w-3 h-3 text-slate-400" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-purple-100 shadow-soft-purple p-6 space-y-5">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Expense Item Ledger</h3>
          <p className="text-xs text-slate-500">
            {expenses.length} total entries • Real-time synchronization
          </p>
        </div>

        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white gradient-brand hover:opacity-95 shadow-md shadow-brand-500/20 transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Expense Item</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search items or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter expenses by category"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="all">All Categories</option>
            {(Object.keys(CATEGORY_LABELS) as BudgetCategory[]).map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            aria-label="Filter expenses by payment status"
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="all">All Payment Statuses</option>
            <option value="pending">Pending</option>
            <option value="deposit_paid">Deposit Paid</option>
            <option value="paid_in_full">Paid in Full</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-purple-100">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-lavender/60 text-slate-700 font-bold border-b border-purple-100 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Item & Category</th>
              <th className="py-3 px-4 text-right">Estimated</th>
              <th className="py-3 px-4 text-right">Actual</th>
              <th className="py-3 px-4 text-right">Variance</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Notes</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No matching expense items found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const variance = item.actualCost > 0 ? item.actualCost - item.estimatedCost : 0;
                const isOver = variance > 0;
                return (
                  <tr key={item.id} className="hover:bg-purple-50/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: CATEGORY_COLORS[item.category] || '#7c3aed' }}
                        />
                        <span className="text-[11px] text-slate-500">
                          {CATEGORY_LABELS[item.category]}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                      {formatCurrency(item.estimatedCost, currency)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(item.actualCost, currency)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-[11px]">
                      {item.actualCost === 0 ? (
                        <span className="text-slate-400">—</span>
                      ) : isOver ? (
                        <span className="text-rose-600 font-bold">
                          +{formatCurrency(variance, currency)}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold">
                          -{formatCurrency(Math.abs(variance), currency)}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">{getStatusBadge(item.paymentStatus)}</td>

                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                      {item.notes || '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1 shrink-0">
                      <button
                        onClick={() => onEdit(item)}
                        aria-label={`Edit ${item.name}`}
                        className="p-1 rounded-lg text-slate-400 hover:text-brand-700 hover:bg-purple-50 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        aria-label={`Delete ${item.name}`}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

