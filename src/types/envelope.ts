export interface Envelope {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  isMain: boolean;
  targetAmount: number | null;
  currentBalance: number;
  archivedAt: string | null;
  createdAt: string;
}

export interface EnvelopeListResponse {
  envelopes: Envelope[];
  totalBalance: number;
}

export interface EnvelopeTransaction {
  id: string;
  type: 'income' | 'expense' | 'transfer_in' | 'transfer_out';
  amount: number;
  description: string | null;
  occurredAt: string;
  category: { id: string; name: string; icon: string; color: string } | null;
}

export interface EnvelopeDetailResponse {
  envelope: Envelope;
  stats: {
    monthIncome: number;
    monthExpense: number;
    progress: number | null;
  };
  recentTransactions: EnvelopeTransaction[];
}

export interface CreateEnvelopePayload {
  name: string;
  description?: string;
  icon: string;
  color: string;
  targetAmount?: number;
  initialAmount?: number;
}

export interface UpdateEnvelopePayload {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  targetAmount?: number | null;
}

export interface TransferPayload {
  sourceEnvelopeId: string;
  destinationEnvelopeId: string;
  amount: number;
  description?: string;
}

// Paletas curadas para el form
export const ENVELOPE_COLORS = [
  '#10B981', // brand
  '#0EA5E9', // sky
  '#3B82F6', // blue
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#EF4444', // red
  '#F59E0B', // amber
  '#EAB308', // yellow
  '#84CC16', // lime
  '#14B8A6', // teal
  '#A855F7', // purple
  '#6B7280', // gray
] as const;

export const ENVELOPE_ICONS = [
  '💰', '🏦', '🍔', '🚌', '📚', '🎮', '✈️', '🏠', '👕',
  '💊', '🎁', '☕', '🎬', '🎵', '⚽', '💻', '📱', '🐶',
  '🎓', '💍', '🚗', '⛽', '🛒', '🌮',
] as const;
