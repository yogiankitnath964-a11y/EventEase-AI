import { CurrencyCode } from '../types/event';

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  INR: '₹',
  EUR: '€',
  GBP: '£',
  CAD: 'CA$',
  AUD: 'AU$',
};

export function formatCurrency(amount: number, currency: CurrencyCode = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  const formattedNumber = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(amount));

  return `${symbol}${formattedNumber}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function getDaysRemaining(targetDateStr: string): number {
  if (!targetDateStr) return 0;
  const [year, month, day] = targetDateStr.split('-').map(Number);
  const target = new Date(year, month - 1, day);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function getRelativeDateBadge(targetDateStr: string): { label: string; colorClass: string; isPast: boolean } {
  const days = getDaysRemaining(targetDateStr);
  if (days < 0) {
    return {
      label: `${Math.abs(days)} days ago`,
      colorClass: 'bg-slate-100 text-slate-700 border-slate-300',
      isPast: true,
    };
  }
  if (days === 0) {
    return {
      label: 'Today',
      colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse',
      isPast: false,
    };
  }
  if (days === 1) {
    return {
      label: 'Tomorrow',
      colorClass: 'bg-amber-100 text-amber-800 border-amber-300',
      isPast: false,
    };
  }
  if (days < 30) {
    return {
      label: `In ${days} days`,
      colorClass: 'bg-violet-100 text-violet-800 border-violet-300',
      isPast: false,
    };
  }
  const months = Math.round(days / 30);
  return {
    label: `In ${months} ${months === 1 ? 'month' : 'months'}`,
    colorClass: 'bg-purple-100 text-purple-800 border-purple-300',
    isPast: false,
  };
}

