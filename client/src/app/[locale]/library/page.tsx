'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import PageFrame from '@/components/PageFrame';
import ListToolbar from '@/components/ListToolbar';
import PaginationBar from '@/components/PaginationBar';
import StatusBlock from '@/components/StatusBlock';
import TagChips from '@/components/TagChips';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchLibraryFiles,
  selectLibraryFiles,
  selectLibraryPagination,
} from '@/store/slices/librarySlice';
import { displayName } from '@/lib/auth';
import { LIST_PAGE_SIZE, useListFilters } from '@/lib/list';
import { primaryBtnClass } from '@/lib/styles';

export default function LibraryPage() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const files = useAppSelector(selectLibraryFiles) || [];
  const pagination = useAppSelector(selectLibraryPagination);
  const { loading, error } = useAppSelector((state) => state.library);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { page, tag, q, setFilters } = useListFilters();

  useEffect(() => {
    dispatch(
      fetchLibraryFiles({
        page,
        limit: LIST_PAGE_SIZE,
        tag: tag || undefined,
        search: q || undefined,
      }),
    );
  }, [dispatch, page, tag, q]);

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
        <ListToolbar
          query={q}
          tag={tag}
          onSearch={(value) => setFilters({ q: value })}
          onClear={() => setFilters({ q: '', tag: null })}
        />
        {loading || error || files.length === 0 ? (
          <StatusBlock
            loading={loading && files.length === 0}
            error={error}
            empty={!loading && files.length === 0}
            hasFilters={Boolean(q || tag)}
          />
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
                  <TagChips tags={book.tags} onSelect={(next) => setFilters({ tag: next })} />
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
        <PaginationBar
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(next) => setFilters({ page: next })}
        />
      </section>
    </PageFrame>
  );
}
