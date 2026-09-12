'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import PageFrame from '@/components/PageFrame';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchArticles, selectArticleList } from '@/store/slices/articleSlice';
import { primaryBtnClass } from '@/lib/styles';

export default function ArticlesPage() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const articles = useAppSelector(selectArticleList) || [];
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  return (
    <PageFrame>
      <section className="mb-12 border-b border-cyan-500 pb-8 text-center">
        <h1 className="px-6 py-16 text-4xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] md:text-5xl">
          {t('articles.header.title')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pink-400">
          {t('articles.header.description')}
        </p>
        {isAuthenticated && (
          <Link href="/articles/new" className={`${primaryBtnClass} mt-6 inline-block`}>
            {t('actions.newArticle')}
          </Link>
        )}
      </section>

      <section className="mx-auto max-w-5xl px-4">
        <h2 className="mb-6 text-2xl font-semibold text-cyan-300">
          {t('articles.latestItems')}
        </h2>
        {articles.length === 0 ? (
          <p className="text-pink-400">{t('actions.empty')}</p>
        ) : (
          <ul className="space-y-4">
            {articles.map((article) => (
              <li
                key={article._id}
                className="rounded-lg bg-gray-800 p-4 transition hover:bg-gray-700"
              >
                <h3 className="text-lg font-bold text-cyan-200">{article.title}</h3>
                <p className="text-pink-400">
                  {new Date(article.createdAt).toLocaleString()} - {article.summary}
                </p>
                <Link
                  href={`/articles/${article._id}`}
                  className="text-cyan-400 hover:underline"
                >
                  {t('articles.readMoreBtn')}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageFrame>
  );
}
