import { describe, it, expect } from 'vitest';
import { calculateBudgetSummary, generateSavingSuggestions } from '../src/utils/budgetCalculations';
import { ExpenseItem } from '../src/types/budget';

describe('Budget Calculations & Over-budget alerts', () => {
  it('correctly calculates budget summaries when under budget', () => {
    const totalBudget = 10000;
    const expenses: ExpenseItem[] = [
      {
        id: '1',
        eventId: 'e1',
        category: 'venue',
        name: 'Venue rental',
        estimatedCost: 2500,
        actualCost: 2400,
        paymentStatus: 'paid_in_full',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        eventId: 'e1',
        category: 'catering',
        name: 'Dinner catering',
        estimatedCost: 3000,
        actualCost: 2900,
        paymentStatus: 'deposit_paid',
        createdAt: new Date().toISOString(),
      },
    ];

    const summary = calculateBudgetSummary(totalBudget, expenses);

    expect(summary.totalBudget).toBe(10000);
    expect(summary.totalEstimated).toBe(5500);
    expect(summary.totalActual).toBe(5300);
    expect(summary.isOverBudget).toBe(false);
    expect(summary.overBudgetAmount).toBe(0);
    expect(summary.remainingBudget).toBe(4500); // 10000 - max(5300, 5500)
    expect(summary.utilizationPercentage).toBe(55);
  });

  it('accurately triggers over-budget status and calculates overage amount', () => {
    const totalBudget = 5000;
    const expenses: ExpenseItem[] = [
      {
        id: '1',
        eventId: 'e1',
        category: 'venue',
        name: 'Ballroom',
        estimatedCost: 3500,
        actualCost: 3800,
        paymentStatus: 'deposit_paid',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        eventId: 'e1',
        category: 'catering',
        name: 'Gourmet meal',
        estimatedCost: 2000,
        actualCost: 2100,
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
      },
    ];

    const summary = calculateBudgetSummary(totalBudget, expenses);

    expect(summary.isOverBudget).toBe(true);
    expect(summary.totalActual).toBe(5900);
    expect(summary.overBudgetAmount).toBe(900);
    expect(summary.remainingBudget).toBe(-900);
    expect(summary.utilizationPercentage).toBe(118);
  });

  it('generates practical cost-saving suggestions when categories exceed recommended allocation', () => {
    const totalBudget = 10000;
    // Venue default allocation is 30% ($3000). Let's set it to $4500.
    const expenses: ExpenseItem[] = [
      {
        id: '1',
        eventId: 'e1',
        category: 'venue',
        name: 'Luxury Castle',
        estimatedCost: 4500,
        actualCost: 4500,
        paymentStatus: 'deposit_paid',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        eventId: 'e1',
        category: 'catering',
        name: 'Five course banquet',
        estimatedCost: 4000,
        actualCost: 4000,
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
      },
    ];

    const summary = calculateBudgetSummary(totalBudget, expenses);
    const tips = generateSavingSuggestions(summary);

    expect(tips.length).toBeGreaterThan(0);
    const venueTip = tips.find(t => t.category === 'venue');
    const cateringTip = tips.find(t => t.category === 'catering');

    expect(venueTip).toBeDefined();
    expect(cateringTip).toBeDefined();
  });
});

