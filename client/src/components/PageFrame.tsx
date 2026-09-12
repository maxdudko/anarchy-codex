'use client';

import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PageFrame({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 font-mono text-cyan-300">
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
