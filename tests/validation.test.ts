import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, getDaysRemaining } from '../src/utils/formatters';

describe('Validation & Formatters', () => {
  it('formats various currencies accurately with correct symbols', () => {
    expect(formatCurrency(25000, 'USD')).toBe('$25,000');
    expect(formatCurrency(500000, 'INR')).toBe('₹500,000');
    expect(formatCurrency(1200, 'EUR')).toBe('€1,200');
    expect(formatCurrency(850, 'GBP')).toBe('£850');
  });

  it('formats dates cleanly for human readability', () => {
    expect(formatDate('2026-11-20')).toBe('Nov 20, 2026');
    expect(formatDate('2026-05-04')).toBe('May 4, 2026');
  });

  it('calculates days remaining without NaN or runtime exceptions', () => {
    const days = getDaysRemaining('2099-01-01');
    expect(days).toBeGreaterThan(0);

    const pastDays = getDaysRemaining('2020-01-01');
    expect(pastDays).toBeLessThan(0);
  });
});

