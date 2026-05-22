export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  nickname: string;
  phone?: string | null;
  avatarUrl?: string | null;
  isPremium: boolean;
  currencyCode: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  /** ISO string o null si el email no fue verificado aún */
  emailVerifiedAt?: string | null;
}

export interface AuthResponse {
  user: User;
}
