'use client';

import { useTranslations } from 'next-intl';
import { secondaryBtnClass } from '@/lib/styles';

interface PaginationBarProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationBar({
  page,
  totalPages,
  onPageChange,
}: PaginationBarProps) {
  const t = useTranslations();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <button
        type="button"
        className={secondaryBtnClass}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        {t('list.prev')}
      </button>
      <span className="text-sm text-cyan-300">
        {t('list.page')} {page} / {totalPages}
      </span>
      <button
        type="button"
        className={secondaryBtnClass}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        {t('list.next')}
      </button>
    </div>
  );
}
