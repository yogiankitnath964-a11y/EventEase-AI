export type BudgetCategory = 
  | 'venue' 
  | 'catering' 
  | 'decor' 
  | 'photography' 
  | 'entertainment' 
  | 'attire' 
  | 'logistics' 
  | 'miscellaneous';

export type PaymentStatus = 'pending' | 'deposit_paid' | 'paid_in_full';

export interface ExpenseItem {
  id: string;
  eventId: string;
  category: BudgetCategory;
  name: string;
  estimatedCost: number;
  actualCost: number;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
}

export interface CategorySummary {
  category: BudgetCategory;
  categoryLabel: string;
  estimated: number;
  actual: number;
  allocatedBudget: number;
  color: string;
}

export interface BudgetSummary {
  totalBudget: number;
  totalEstimated: number;
  totalActual: number;
  remainingBudget: number;
  utilizationPercentage: number;
  isOverBudget: boolean;
  overBudgetAmount: number;
  categorySummaries: CategorySummary[];
}

