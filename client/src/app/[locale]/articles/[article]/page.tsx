'use client';

import Navbar from '@/components/Navbar';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchArticleById,
  selectCurrentArticle,
} from '@/store/slices/articleSlice';
import { useEffect } from 'react';
import Footer from '@/components/Footer';

export default function ArticlePage() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const id = pathname.split('/').pop() || '';
  const article = useSelector(selectCurrentArticle);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    dispatch(fetchArticleById(id));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 font-mono text-cyan-300">
      <Navbar />
      <section>
        <h1>
          {article?.title} |{' '}
          {new Date(article?.createdAt || '').toLocaleString()}
        </h1>
        <p>{article?.summary}</p>
        {Array.from({ length: 10 }).map((_, i) => (
          <p key={i}>{article?.content}</p>
        ))}
        <button
          onClick={() => window.history.back()}
          className="mt-10 cursor-pointer rounded border border-cyan-400 px-4 py-2 text-cyan-300 transition hover:bg-cyan-800"
        >
          Back to Articles
        </button>
      </section>
      <Footer />
    </main>
  );
}
