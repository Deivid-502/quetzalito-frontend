'use client';

import { create } from 'zustand';
import { api } from '@/lib/api';
import type { User } from '@/types/user';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  fetchMe: () => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  /** Mezcla cambios parciales en el usuario actual (sin re-fetch) */
  patchUser: (changes: Partial<User>) => void;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  nickname: string;
  phone?: string;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,

  setUser: (user) => set({ user }),

  patchUser: (changes) => {
    const current = useAuthStore.getState().user;
    if (current) set({ user: { ...current, ...changes } });
  },

  fetchMe: async () => {
    set({ loading: true });
    try {
      const res = await api.get<{ user: User }>('/auth/me');
      set({ user: res.user, initialized: true });
    } catch {
      set({ user: null, initialized: true });
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    const res = await api.post<{ user: User }>('/auth/login', { email, password });
    set({ user: res.user, initialized: true });
    return res.user;
  },

  register: async (data) => {
    const res = await api.post<{ user: User }>('/auth/register', data);
    set({ user: res.user, initialized: true });
    return res.user;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      set({ user: null });
    }
  },
}));
