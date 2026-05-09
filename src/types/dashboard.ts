import type { TransactionType } from './transaction';

export type AlertSeverity = 'info' | 'warning' | 'danger';

export interface DashboardAlert {
  type: string;
  message: string;
  severity: AlertSeverity;
}

export interface DashboardCategoryBreakdown {
  id: string;
  name: string;
  icon: string;
  color: string;
  value: number;
  percent: number;
}

export interface DashboardEnvelope {
  id: string;
  name: string;
  icon: string;
  color: string;
  isMain: boolean;
  currentBalance: number;
  targetAmount: number | null;
  progress: number | null;
}

export interface DashboardTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  occurredAt: string;
  envelope: { id: string; name: string; icon: string; color: string };
  category: { id: string; name: string; icon: string; color: string } | null;
}

export interface DashboardBudgetAlert {
  category: { id: string; name: string; icon: string; color: string };
  limit: number;
  spent: number;
  percent: number;
  status: 'alert' | 'exceeded';
}

export interface DashboardResponse {
  user: {
    nickname: string;
    firstName: string;
    isPremium: boolean;
    currencyCode: string;
  };
  period: { year: number; month: number };
  balance: {
    total: number;
    monthIncome: number;
    monthExpense: number;
    net: number;
  };
  dailyLimit: {
    value: number;
    daysLeft: number;
    percentSpent: number;
    isCurrentMonth: boolean;
  };
  categoryBreakdown: DashboardCategoryBreakdown[];
  categoryBreakdownTotal: number;
  recentTransactions: DashboardTransaction[];
  topEnvelopes: DashboardEnvelope[];
  budgetAlerts: DashboardBudgetAlert[];
  alerts: DashboardAlert[];
  tip: { title: string; text: string };
}
