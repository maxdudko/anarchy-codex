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
  fetchThreads,
  selectForumPagination,
  selectThreads,
} from '@/store/slices/forumSlice';
import { displayName } from '@/lib/auth';
import { LIST_PAGE_SIZE, useListFilters } from '@/lib/list';
import { primaryBtnClass } from '@/lib/styles';

export default function ForumPage() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const threads = useAppSelector(selectThreads) || [];
  const pagination = useAppSelector(selectForumPagination);
  const { loading, error } = useAppSelector((state) => state.forum);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { page, tag, q, setFilters } = useListFilters();

  useEffect(() => {
    dispatch(
      fetchThreads({
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
          {t('forum.header.title')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pink-400">
          {t('forum.header.description')}
        </p>
        {isAuthenticated && (
          <Link href="/forum/new" className={`${primaryBtnClass} mt-6 inline-block`}>
            {t('actions.newThread')}
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
        {loading || error || threads.length === 0 ? (
          <StatusBlock
            loading={loading && threads.length === 0}
            error={error}
            empty={!loading && threads.length === 0}
            hasFilters={Boolean(q || tag)}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {threads.map((thread) => (
              <div key={thread._id} className="rounded-xl border border-cyan-600 bg-gray-900 p-6">
                <div className="mb-2 flex flex-wrap gap-2 text-xs">
                  {thread.isPinned && (
                    <span className="rounded border border-cyan-400 px-2 py-0.5 text-cyan-300">
                      {t('moderation.pinned')}
                    </span>
                  )}
                  {thread.isLocked && (
                    <span className="rounded border border-pink-400 px-2 py-0.5 text-pink-300">
                      {t('moderation.locked')}
                    </span>
                  )}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-cyan-300">{thread.title}</h3>
                <p className="mb-2 line-clamp-3 text-pink-400">{thread.content}</p>
                <p className="mb-2 text-sm text-gray-400">
                  {displayName(thread.author)} · {thread.replyCount ?? thread.messageCount ?? 0}{' '}
                  {t('actions.replies')}
                </p>
                <TagChips tags={thread.tags} onSelect={(next) => setFilters({ tag: next })} />
                <Link href={`/forum/${thread._id}`} className="mt-3 inline-block text-sm text-cyan-400 hover:underline">
                  {t('forum.viewThread')}
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
