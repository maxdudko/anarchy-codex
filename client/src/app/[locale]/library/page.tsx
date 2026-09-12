'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import PageFrame from '@/components/PageFrame';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLibraryFiles, selectLibraryFiles } from '@/store/slices/librarySlice';
import { displayName } from '@/lib/auth';
import { primaryBtnClass } from '@/lib/styles';

export default function LibraryPage() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const files = useAppSelector(selectLibraryFiles) || [];
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchLibraryFiles());
  }, [dispatch]);

  return (
    <PageFrame>
      <section className="mb-12 border-b border-cyan-500 pb-8 text-center">
        <h1 className="px-6 py-16 text-4xl font-bold text-cyan-400 md:text-5xl">
          {t('library.header.title')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pink-400">
          {t('library.header.description')}
        </p>
        {isAuthenticated && (
          <Link href="/library/upload" className={`${primaryBtnClass} mt-6 inline-block`}>
            {t('actions.upload')}
          </Link>
        )}
      </section>
      <section className="mx-auto max-w-5xl px-4">
        {files.length === 0 ? (
          <p className="text-pink-400">{t('actions.empty')}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {files.map((book) => (
              <div key={book._id} className="flex flex-col justify-between rounded-xl border border-cyan-600 bg-gray-900 p-4">
                <div>
                  <h3 className="mb-1 text-lg font-bold text-cyan-300">{book.title}</h3>
                  <p className="mb-2 text-sm text-pink-500">
                    {book.sourceAuthor || displayName(book.author)}
                  </p>
                  <p className="text-sm text-cyan-200">{book.description}</p>
                </div>
                <Link
                  href={`/library/${book._id}`}
                  className="mt-4 inline-block text-sm text-cyan-400 hover:underline"
                >
                  {t('library.viewDetails')}
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageFrame>
  );
}
