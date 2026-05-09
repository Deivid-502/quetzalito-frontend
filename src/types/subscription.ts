export interface SubscriptionStatus {
  currentPlan: 'free' | 'premium';
  isPremium: boolean;
  pricing: {
    amount: number;
    currency: string;
    intervalDays: number;
  };
  activeSubscription: {
    id: string;
    plan: string;
    status: string;
    startsAt: string;
    endsAt: string | null;
  } | null;
}
