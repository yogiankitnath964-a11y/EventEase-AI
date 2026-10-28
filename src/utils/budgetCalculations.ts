import { BudgetCategory, BudgetSummary, CategorySummary, ExpenseItem } from '../types/budget';

export const CATEGORY_LABELS: Record<BudgetCategory, string> = {
  venue: 'Venue & Facilities',
  catering: 'Catering & Beverages',
  decor: 'Decor & Florals',
  photography: 'Photography & Media',
  entertainment: 'Music & Entertainment',
  attire: 'Attire & Beauty',
  logistics: 'Logistics & Rentals',
  miscellaneous: 'Miscellaneous & Contingency',
};

export const CATEGORY_COLORS: Record<BudgetCategory, string> = {
  venue: '#7c3aed',         // Vivid purple
  catering: '#9333ea',      // Violet
  decor: '#c084fc',         // Light violet
  photography: '#ec4899',   // Pink
  entertainment: '#6366f1', // Indigo
  attire: '#f43f5e',        // Rose
  logistics: '#06b6d4',     // Cyan
  miscellaneous: '#64748b', // Slate
};

// Recommended percentage allocations by default
export const DEFAULT_CATEGORY_ALLOCATIONS: Record<BudgetCategory, number> = {
  venue: 0.30,
  catering: 0.30,
  decor: 0.12,
  photography: 0.10,
  entertainment: 0.08,
  attire: 0.05,
  logistics: 0.03,
  miscellaneous: 0.02,
};

export function calculateBudgetSummary(
  totalBudget: number,
  expenses: ExpenseItem[]
): BudgetSummary {
  const safeTotalBudget = Math.max(0, totalBudget);

  let totalEstimated = 0;
  let totalActual = 0;

  const categoryTotals: Record<BudgetCategory, { estimated: number; actual: number }> = {
    venue: { estimated: 0, actual: 0 },
    catering: { estimated: 0, actual: 0 },
    decor: { estimated: 0, actual: 0 },
    photography: { estimated: 0, actual: 0 },
    entertainment: { estimated: 0, actual: 0 },
    attire: { estimated: 0, actual: 0 },
    logistics: { estimated: 0, actual: 0 },
    miscellaneous: { estimated: 0, actual: 0 },
  };

  for (const item of expenses) {
    const est = Number(item.estimatedCost) || 0;
    const act = Number(item.actualCost) || 0;

    totalEstimated += est;
    totalActual += act;

    if (categoryTotals[item.category]) {
      categoryTotals[item.category].estimated += est;
      categoryTotals[item.category].actual += act;
    } else {
      categoryTotals.miscellaneous.estimated += est;
      categoryTotals.miscellaneous.actual += act;
    }
  }

  // Active spent reflects actual spent, or estimated for items pending
  const committedSpend = Math.max(totalActual, totalEstimated);
  const remainingBudget = safeTotalBudget - committedSpend;
  const isOverBudget = committedSpend > safeTotalBudget;
  const overBudgetAmount = isOverBudget ? committedSpend - safeTotalBudget : 0;
  
  const utilizationPercentage = safeTotalBudget > 0
    ? Math.min(999, Math.round((committedSpend / safeTotalBudget) * 100))
    : 0;

  const categorySummaries: CategorySummary[] = (Object.keys(categoryTotals) as BudgetCategory[]).map(
    (cat) => ({
      category: cat,
      categoryLabel: CATEGORY_LABELS[cat],
      estimated: categoryTotals[cat].estimated,
      actual: categoryTotals[cat].actual,
      allocatedBudget: Math.round(safeTotalBudget * DEFAULT_CATEGORY_ALLOCATIONS[cat]),
      color: CATEGORY_COLORS[cat],
    })
  );

  return {
    totalBudget: safeTotalBudget,
    totalEstimated,
    totalActual,
    remainingBudget,
    utilizationPercentage,
    isOverBudget,
    overBudgetAmount,
    categorySummaries,
  };
}

export interface SavingTip {
  category: BudgetCategory;
  title: string;
  advice: string;
  potentialSavingsEstimate: string;
}

export function generateSavingSuggestions(summary: BudgetSummary): SavingTip[] {
  const tips: SavingTip[] = [];

  for (const cat of summary.categorySummaries) {
    const committed = Math.max(cat.actual, cat.estimated);
    if (committed > cat.allocatedBudget && committed > 0) {
      if (cat.category === 'catering') {
        tips.push({
          category: 'catering',
          title: 'Optimize Catering Service Style',
          advice: 'Switching from formal multi-course plated dinner to curated family-style or grazing stations can cut food preparation labor and rental fees.',
          potentialSavingsEstimate: '15% – 25% on food & beverage',
        });
      } else if (cat.category === 'venue') {
        tips.push({
          category: 'venue',
          title: 'Review Venue Timing & Inclusive Packages',
          advice: 'Ask about bundled tables, chairs, and AV equipment, or consider adjusting by an hour earlier to dodge premium nighttime overtime rates.',
          potentialSavingsEstimate: '10% – 20% on venue fees',
        });
      } else if (cat.category === 'decor') {
        tips.push({
          category: 'decor',
          title: 'Repurpose Ceremony Florals for Reception',
          advice: 'Move floral arches and aisle arrangements to the main stage and dining tables after the ceremony rather than ordering separate pieces.',
          potentialSavingsEstimate: '20% – 35% on florals',
        });
      } else if (cat.category === 'photography') {
        tips.push({
          category: 'photography',
          title: 'Consolidate Media Coverage Hours',
          advice: 'Focus professional coverage on key moments (ceremony, speeches, first dance) for 6 hours instead of all-day 12-hour retainer packages.',
          potentialSavingsEstimate: '$400 – $1,200',
        });
      }
    }
  }

  // Always supply at least 2 practical tips if none exceeded allocation
  if (tips.length === 0) {
    tips.push({
      category: 'catering',
      title: 'BYO Beverages / Corkage Negotiation',
      advice: 'Source your own wines and signature mocktails if the venue permits, or negotiate a capped flat corkage fee.',
      potentialSavingsEstimate: '15% on beverage bills',
    });
    tips.push({
      category: 'decor',
      title: 'Warm Ambient Lighting Over Elaborate Centerpieces',
      advice: 'Fairy lights, tea candles, and LED uplighting create dramatic upscale atmosphere at a fraction of elaborate custom centerpieces.',
      potentialSavingsEstimate: '20% on visual design',
    });
  }

  return tips;
}

