'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import PageFrame from '@/components/PageFrame';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchThreads, selectThreads } from '@/store/slices/forumSlice';
import { displayName } from '@/lib/auth';
import { primaryBtnClass } from '@/lib/styles';

export default function ForumPage() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const threads = useAppSelector(selectThreads) || [];
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const loading = useAppSelector((state) => state.forum.loading);

  useEffect(() => {
    dispatch(fetchThreads());
  }, [dispatch]);

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
        {loading && threads.length === 0 ? (
          <p>{t('auth.loading')}</p>
        ) : threads.length === 0 ? (
          <p className="text-pink-400">{t('actions.empty')}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {threads.map((thread) => (
              <div key={thread._id} className="rounded-xl border border-cyan-600 bg-gray-900 p-6">
                <h3 className="mb-2 text-lg font-semibold text-cyan-300">{thread.title}</h3>
                <p className="mb-2 line-clamp-3 text-pink-400">{thread.content}</p>
                <p className="mb-4 text-sm text-gray-400">
                  {displayName(thread.author)} · {thread.replyCount ?? thread.messageCount ?? 0}{' '}
                  {t('actions.replies')}
                </p>
                <Link href={`/forum/${thread._id}`} className="text-sm text-cyan-400 hover:underline">
                  {t('forum.viewThread')}
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </PageFrame>
  );
}
