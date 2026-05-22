'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Pencil, Trash2, Tag, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { CategoryFormModal } from '@/components/categories/CategoryFormModal';
import { DeleteCategoryModal } from '@/components/categories/DeleteCategoryModal';
import { CategoryIcon } from '@/lib/icons';
import { useCategories } from '@/hooks/useCategories';
import { cn } from '@/lib/utils';
import { useT } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n';
import type { Category } from '@/types/category';

export default function CategoriesPage() {
  const t = useT();
  const { categories, loading, refresh } = useCategories();
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const system = categories.filter((c) => c.isSystem);
  const own = categories.filter((c) => !c.isSystem);

  function openCreate() {
    setFormMode('create');
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(c: Category) {
    setFormMode('edit');
    setEditing(c);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <Link href="/ajustes" className="inline-flex items-center gap-1 text-sm text-muted hover:underline">
        <ArrowLeft className="h-4 w-4" /> {t('categories.backToSettings')}
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('categories.title')}</h1>
          <p className="text-muted">{t('categories.customizeSubtitle')}</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> {t('categories.create')}
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
        </div>
      )}

      {/* Mis categorías */}
      {!loading && (
        <Card>
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-500" /> {t('categories.mine')}
              </h3>
              <span className="text-xs text-muted">{own.length}</span>
            </div>
            {own.length === 0 ? (
              <p className="rounded-xl border-2 border-dashed border-ink-200 py-8 text-center text-sm text-muted dark:border-ink-700">
                {t('categories.noneYet')}
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {own.map((c) => (
                  <CategoryRow
                    key={c.id}
                    category={c}
                    onEdit={() => openEdit(c)}
                    onDelete={() => setDeleting(c)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Categorías del sistema */}
      {!loading && (
        <Card>
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted" /> {t('categories.systemTitle')}
              </h3>
              <span className="text-xs text-muted">{system.length}</span>
            </div>
            <p className="mb-3 text-xs text-muted">{t('categories.systemDesc')}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {system.map((c) => (
                <CategoryRow key={c.id} category={c} readOnly />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <CategoryFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        mode={formMode}
        category={editing}
        onSaved={refresh}
      />

      <DeleteCategoryModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        category={deleting}
        allCategories={categories}
        onDeleted={refresh}
      />
    </div>
  );
}

const TYPE_PREVIEW_KEYS: Record<'expense' | 'income' | 'both', TranslationKey> = {
  expense: 'categories.previewExpense',
  income: 'categories.previewIncome',
  both: 'categories.types.both',
};

function CategoryRow({
  category,
  onEdit,
  onDelete,
  readOnly,
}: {
  category: Category;
  onEdit?: () => void;
  onDelete?: () => void;
  readOnly?: boolean;
}) {
  const t = useT();
  const typeLabel = t(TYPE_PREVIEW_KEYS[category.type]);

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl border p-3',
        'border-ink-200 dark:border-ink-700',
      )}
    >
      <span
        className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
        style={{ background: `${category.color}1A`, color: category.color }}
      >
        <CategoryIcon name={category.icon} className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{category.name}</p>
        <p className="text-[11px] text-muted">{typeLabel}</p>
      </div>
      {!readOnly && (
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-ink-100 dark:hover:bg-ink-700/40"
            aria-label={t('common.edit')}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-danger hover:bg-red-50 dark:hover:bg-red-900/20"
            aria-label={t('common.delete')}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
