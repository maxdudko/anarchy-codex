'use client';

import { useTranslations } from 'next-intl';

interface StatusBlockProps {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  hasFilters?: boolean;
}

export default function StatusBlock({
  loading,
  error,
  empty,
  hasFilters,
}: StatusBlockProps) {
  const t = useTranslations();

  if (loading) {
    return <p className="text-cyan-300">{t('list.loading')}</p>;
  }
  if (error) {
    return <p className="text-red-400">{error || t('list.error')}</p>;
  }
  if (empty) {
    return (
      <p className="text-pink-400">
        {hasFilters ? t('list.noResults') : t('actions.empty')}
      </p>
    );
  }
  return null;
}
