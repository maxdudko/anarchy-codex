'use client';

import Navbar from '@/components/Navbar';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Footer from '@/components/Footer';
import {
  fetchLibraryFileById,
  selectCurrentLibraryFile,
} from '@/store/slices/librarySlice';

export default function BookPage() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const id = pathname.split('/').pop() || '';
  const book = useSelector(selectCurrentLibraryFile);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    dispatch(fetchLibraryFileById(id));
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 font-mono text-cyan-300">
      <Navbar />
      <section className="px-4">
        <h1>
          {book?.title} | {new Date(book?.createdAt || '').toLocaleString()}
        </h1>
        <p>{book?.description}</p>
        <button
          onClick={() => window.history.back()}
          className="mt-10 cursor-pointer rounded border border-cyan-400 px-4 py-2 text-cyan-300 transition hover:bg-cyan-800"
        >
          Back to Library
        </button>
      </section>
      <Footer />
    </main>
  );
}
