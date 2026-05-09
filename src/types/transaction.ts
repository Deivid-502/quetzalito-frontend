export type TransactionType = 'income' | 'expense' | 'transfer_in' | 'transfer_out';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  occurredAt: string;
  relatedTransactionId: string | null;
  envelope: { id: string; name: string; icon: string; color: string };
  category: { id: string; name: string; icon: string; color: string; type: string } | null;
  createdAt: string;
}

export interface TransactionListResponse {
  items: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  totals: {
    income: number;
    expense: number;
    transferIn: number;
    transferOut: number;
    net: number;
  };
}

export interface CreateTransactionPayload {
  type: 'income' | 'expense';
  amount: number;
  envelopeId: string;
  categoryId?: string;
  description?: string;
  occurredAt?: string;
}

export interface TransactionFilters {
  from?: string;
  to?: string;
  envelopeId?: string;
  categoryId?: string;
  type?: TransactionType;
  page?: number;
  limit?: number;
}
