'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import type { Category } from '@/types/category';

export function useCategories(type?: 'income' | 'expense') {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const path = type ? `/categories?type=${type}` : '/categories';
      const data = await api.get<Category[]>(path);
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No pudimos cargar las categorías.');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { categories, loading, error, refresh: fetch };
}
