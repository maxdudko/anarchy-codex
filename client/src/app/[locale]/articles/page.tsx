'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchArticles, selectArticleList } from '@/store/slices/articleSlice';

export default function NewsPage() {
  const t = useTranslations();
  const dispatch = useDispatch();
  const articles = useSelector(selectArticleList);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    dispatch(fetchArticles());
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 font-mono text-cyan-300">
      <Navbar />
      <section className="mb-12 border-b border-cyan-500 pb-8 text-center">
        <h1 className="px-6 py-16 text-4xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] md:text-5xl">
          {t('articles.header.title')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pink-400">
          {t('articles.header.description')}
        </p>
      </section>

      <section className="mx-auto max-w-5xl">
        <h2 className="mb-6 text-2xl font-semibold text-cyan-300 drop-shadow-[0_0_4px_rgba(0,255,255,0.5)]">
          {t('articles.latestItems')}
        </h2>
        <ul className="space-y-4">
          {articles.map((article, index) => (
            <li
              key={index}
              className="rounded-lg bg-gray-800 p-4 transition hover:bg-gray-700"
            >
              <h3 className="text-lg font-bold text-cyan-200">
                {article.title}
              </h3>
              <p className="text-pink-400">
                {new Date(article.createdAt).toLocaleString()} -{' '}
                {article.summary}
              </p>
              <a
                href={`/articles/${article._id}`}
                className="text-cyan-400 hover:underline"
              >
                {t('articles.readMoreBtn')}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </main>
  );
}
