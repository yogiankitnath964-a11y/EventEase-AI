import React, { useState } from 'react';
import { 
  PieChart as PieIcon, 
  BarChart3, 
  AlertTriangle, 
  PiggyBank, 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  Plus, 
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { EventDetails } from '../../types/event';
import { ExpenseItem } from '../../types/budget';
import { calculateBudgetSummary, generateSavingSuggestions } from '../../utils/budgetCalculations';
import { formatCurrency } from '../../utils/formatters';
import { ExpenseTable } from './ExpenseTable';
import { ExpenseModal } from './ExpenseModal';

interface BudgetDashboardProps {
  event: EventDetails;
  expenses: ExpenseItem[];
  onSaveExpense: (expense: ExpenseItem) => void;
  onDeleteExpense: (id: string) => void;
}

export const BudgetDashboard: React.FC<BudgetDashboardProps> = ({
  event,
  expenses,
  onSaveExpense,
  onDeleteExpense,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);

  const summary = calculateBudgetSummary(event.totalBudget, expenses);
  const tips = generateSavingSuggestions(summary);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: ExpenseItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  // Pie chart data: categories with spending > 0
  const pieData = summary.categorySummaries
    .filter((cat) => cat.estimated > 0 || cat.actual > 0)
    .map((cat) => ({
      name: cat.categoryLabel,
      value: Math.max(cat.actual, cat.estimated),
      color: cat.color,
    }));

  // Bar chart data: comparing estimated vs actual vs allocation
  const barData = summary.categorySummaries
    .filter((cat) => cat.estimated > 0 || cat.actual > 0 || cat.allocatedBudget > 0)
    .map((cat) => ({
      name: cat.categoryLabel.split(' ')[0], // Short name
      Estimated: cat.estimated,
      Actual: cat.actual,
      Allocated: cat.allocatedBudget,
    }));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-purple-100 shadow-soft-purple">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
            Financial Health & Allocations
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Budget Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time ledger for "{event.name}" • Total Budget: {formatCurrency(event.totalBudget, event.currency)}
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white gradient-brand hover:opacity-95 shadow-md shadow-brand-500/20 transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Expense</span>
        </button>
      </div>

      {/* OVER-BUDGET ALERT BANNER */}
      {summary.isOverBudget && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 flex items-start gap-3.5 shadow-sm animate-in slide-in-from-top-2">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold">
              Budget Overrun Detected — {formatCurrency(summary.overBudgetAmount, event.currency)} above target!
            </h4>
            <p className="text-xs text-rose-700 leading-relaxed">
              Your committed expenditure ({formatCurrency(Math.max(summary.totalActual, summary.totalEstimated), event.currency)}) exceeds your planned total of {formatCurrency(summary.totalBudget, event.currency)}. Review the category breakdowns below and apply the practical cost reduction tips.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Budget */}
        <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-soft-purple space-y-1">
          <span className="text-[11px] font-bold uppercase text-slate-400">Total Budget</span>
          <div className="text-xl font-black text-slate-900">
            {formatCurrency(summary.totalBudget, event.currency)}
          </div>
          <span className="text-[10px] text-brand-700 font-semibold block">Target Ceiling</span>
        </div>

        {/* Estimated Expenses */}
        <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-soft-purple space-y-1">
          <span className="text-[11px] font-bold uppercase text-slate-400">Total Estimated</span>
          <div className="text-xl font-black text-slate-900">
            {formatCurrency(summary.totalEstimated, event.currency)}
          </div>
          <span className="text-[10px] text-slate-500 block">Planned Commitments</span>
        </div>

        {/* Actual Expenses */}
        <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-soft-purple space-y-1">
          <span className="text-[11px] font-bold uppercase text-slate-400">Actual Spent</span>
          <div className="text-xl font-black text-slate-900">
            {formatCurrency(summary.totalActual, event.currency)}
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block">Disbursed / Paid</span>
        </div>

        {/* Remaining Budget */}
        <div className={`p-4 rounded-2xl border shadow-soft-purple space-y-1 ${
          summary.isOverBudget
            ? 'bg-rose-50/50 border-rose-200 text-rose-900'
            : 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
        }`}>
          <span className="text-[11px] font-bold uppercase opacity-80">Remaining Balance</span>
          <div className="text-xl font-black">
            {summary.isOverBudget ? '-' : ''}{formatCurrency(Math.abs(summary.remainingBudget), event.currency)}
          </div>
          <span className="text-[10px] font-semibold block">
            {summary.isOverBudget ? 'Over Budget' : 'Safe Runway'}
          </span>
        </div>

        {/* Utilization % */}
        <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-soft-purple space-y-1 col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold uppercase text-slate-400">Budget Utilization</span>
          <div className="text-xl font-black text-brand-900">
            {summary.utilizationPercentage}%
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                summary.isOverBudget ? 'bg-rose-500' : 'bg-brand-600'
              }`}
              style={{ width: `${Math.min(100, summary.utilizationPercentage)}%` }}
            />
          </div>
        </div>

      </div>

      {/* Visualizations Grid (Donut Chart & Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Allocation Donut Chart */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-soft-purple space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-brand-700 flex items-center justify-center">
                <PieIcon className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900">Category Share Distribution</h3>
            </div>
            <span className="text-xs text-slate-400">Total: {formatCurrency(Math.max(summary.totalActual, summary.totalEstimated), event.currency)}</span>
          </div>

          <div className="h-64 w-full">
            {pieData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No expense data recorded to chart.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [formatCurrency(Number(value) || 0, event.currency), 'Amount']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Estimated vs Actual Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-soft-purple space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-brand-700 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900">Estimated vs. Actual Spend</h3>
            </div>
            <span className="text-xs text-slate-400">By Major Category</span>
          </div>

          <div className="h-64 w-full">
            {barData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No categorical data to display.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    formatter={(value: any) => [formatCurrency(Number(value) || 0, event.currency), '']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Estimated" fill="#9d63e0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Actual" fill="#4c1d95" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Practical Cost-Saving Recommendations Card */}
      <section className="bg-gradient-to-br from-purple-50 via-brand-50/50 to-white p-6 rounded-3xl border border-purple-200/80 shadow-soft-purple space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Practical Cost-Saving Strategies</h3>
            <p className="text-xs text-slate-500">
              Tailored optimizations calculated from your active expense breakdown
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {tips.map((tip, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-purple-100 space-y-1.5 shadow-sm text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{tip.title}</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                  {tip.potentialSavingsEstimate}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">{tip.advice}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Expense Item Ledger Table */}
      <ExpenseTable
        expenses={expenses}
        currency={event.currency}
        onEdit={handleOpenEdit}
        onDelete={onDeleteExpense}
        onAdd={handleOpenAdd}
      />

      {/* Add / Edit Expense Modal */}
      <ExpenseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={onSaveExpense}
        eventId={event.id}
        currency={event.currency}
        initialData={editingItem}
      />

    </div>
  );
};

