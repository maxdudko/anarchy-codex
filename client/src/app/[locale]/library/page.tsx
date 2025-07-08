'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Logo from '@/../public/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchLibraryFiles,
  selectLibraryFiles,
} from '@/store/slices/librarySlice';
import { useEffect } from 'react';
import Link from 'next/link';

export default function LibraryPage() {
  const t = useTranslations();
  const dispatch = useDispatch();
  const files = useSelector(selectLibraryFiles) || [];

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    dispatch(fetchLibraryFiles());
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 font-mono text-cyan-300">
      <Navbar />
      <section className="mb-12 border-b border-cyan-500 pb-8 text-center">
        <h1 className="px-6 py-16 text-4xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] md:text-5xl">
          {t('library.header.title')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pink-400">
          {t('library.header.description')}
        </p>
      </section>

      <section className="mx-auto max-w-5xl">
        <h2 className="mb-6 text-2xl font-semibold text-cyan-300 drop-shadow-[0_0_4px_rgba(0,255,255,0.5)]">
          {t('library.featuredResources')}
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {files.map((book, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-xl border border-cyan-600 bg-gray-900 p-4 drop-shadow-md transition hover:shadow-cyan-700/40"
            >
              <div>
                <Image
                  src={Logo}
                  alt={book.title}
                  className="mb-4 h-48 w-full rounded border border-cyan-800 object-cover"
                />
                <h3 className="mb-1 text-lg font-bold text-cyan-300">
                  {book.title}
                </h3>
                <p className="mb-2 text-sm text-pink-500">{book.author}</p>
                <p className="text-sm text-cyan-200">{book.description}</p>
              </div>
              <div>
                <Link
                  href={`/library/${book._id}`}
                  className="mt-4 inline-block rounded border border-cyan-400 px-4 py-2 text-sm text-cyan-400 transition hover:bg-cyan-800 hover:text-white"
                >
                  {t('library.viewDetails')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
