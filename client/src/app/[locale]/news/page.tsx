'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslations } from 'next-intl';

export default function NewsPage() {
  const t = useTranslations();
  const articlesList = t.raw('home.sections.articlesList') as Array<{
    title: string;
    summary: string;
    link: string;
  }>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 font-mono text-cyan-300">
      <Navbar />
      <section className="mb-12 border-b border-cyan-500 pb-8 text-center">
        <h1 className="text-4xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] md:text-5xl">
          {t('news.header.title')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pink-400">
          {t('news.header.description')}
        </p>
      </section>

      <section className="mx-auto max-w-5xl">
        <h2 className="mb-6 text-2xl font-semibold text-cyan-300 drop-shadow-[0_0_4px_rgba(0,255,255,0.5)]">
          {t('news.latestArticles')}
        </h2>
        <ul className="space-y-4">
          {articlesList.map((article, index) => (
            <li
              key={index}
              className="rounded-lg bg-gray-800 p-4 transition hover:bg-gray-700"
            >
              <h3 className="text-lg font-bold text-cyan-200">
                {article.title}
              </h3>
              <p className="text-pink-400">{article.summary}</p>
              <a href={article.link} className="text-cyan-400 hover:underline">
                {t('news.readMoreBtn')}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </main>
  );
}
