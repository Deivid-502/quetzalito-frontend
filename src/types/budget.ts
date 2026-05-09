import type { Category } from './category';

export type BudgetStatus = 'unset' | 'ok' | 'warning' | 'alert' | 'exceeded';

export interface BudgetItem {
  category: Category;
  budgetId: string | null;
  limit: number;
  spent: number;
  remaining: number;
  percent: number;
  status: BudgetStatus;
}

export interface BudgetPeriodResponse {
  period: { year: number; month: number };
  totals: {
    budgeted: number;
    spent: number;
    remaining: number;
    percent: number;
  };
  items: BudgetItem[];
}

export interface UpsertBudgetPayload {
  categoryId: string;
  amount: number;
  periodYear: number;
  periodMonth: number;
}
