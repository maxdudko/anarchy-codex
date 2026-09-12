'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import PageFrame from '@/components/PageFrame';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  downloadFile,
  fetchLibraryFileById,
  selectCurrentLibraryFile,
} from '@/store/slices/librarySlice';
import { displayName } from '@/lib/auth';
import { primaryBtnClass, secondaryBtnClass } from '@/lib/styles';

export default function LibraryFilePage() {
  const params = useParams<{ book: string }>();
  const id = params.book;
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const book = useAppSelector(selectCurrentLibraryFile);
  const error = useAppSelector((state) => state.library.error);

  useEffect(() => {
    if (id) dispatch(fetchLibraryFileById(id));
  }, [dispatch, id]);

  return (
    <PageFrame>
      <section className="mx-auto max-w-3xl px-4 py-10">
        {!book ? (
          <p>{t('auth.loading')}</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-cyan-400">{book.title}</h1>
            <p className="mt-2 text-sm text-gray-400">
              {book.sourceAuthor || displayName(book.author)} · {book.format || book.mimeType}
            </p>
            <p className="mt-4 text-pink-400">{book.description}</p>
            <p className="mt-2 text-sm text-gray-400">
              {t('actions.download')}: {book.downloadCount}
            </p>
            {error && <p className="mt-3 text-red-400">{error}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                className={primaryBtnClass}
                onClick={() => dispatch(downloadFile(book._id))}
              >
                {t('actions.download')}
              </button>
              <Link href="/library" className={secondaryBtnClass}>
                {t('actions.back')}
              </Link>
            </div>
          </>
        )}
      </section>
    </PageFrame>
  );
}
