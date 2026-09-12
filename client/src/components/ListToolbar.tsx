'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { inputClass, secondaryBtnClass } from '@/lib/styles';

interface ListToolbarProps {
  query: string;
  tag?: string;
  showTags?: boolean;
  onSearch: (value: string) => void;
  onClear: () => void;
}

export default function ListToolbar({
  query,
  tag,
  showTags = true,
  onSearch,
  onClear,
}: ListToolbarProps) {
  const t = useTranslations();
  const [value, setValue] = useState(query);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSearch(value);
  };

  return (
    <form
      className="mb-6 flex flex-col gap-3 md:flex-row md:items-end"
      onSubmit={handleSubmit}
    >
      <div className="flex-1">
        <label className="text-sm text-pink-400">{t('list.search')}</label>
        <input
          className={`${inputClass} mb-0`}
          value={value}
          placeholder={t('list.searchPlaceholder')}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <button className={secondaryBtnClass} type="submit">
          {t('list.search')}
        </button>
        {(query || tag) && (
          <button
            className={secondaryBtnClass}
            type="button"
            onClick={() => {
              setValue('');
              onClear();
            }}
          >
            {t('list.clearFilters')}
          </button>
        )}
      </div>
      {showTags && tag ? (
        <p className="text-sm text-cyan-400">
          {t('actions.tags')}: {tag}
        </p>
      ) : null}
    </form>
  );
}
