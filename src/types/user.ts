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
}

export interface AuthResponse {
  user: User;
}
