'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="mt-20 border-t border-cyan-500 px-6 py-8 text-center text-sm text-cyan-500">
      <nav className="mb-4 flex flex-wrap justify-center gap-4 text-cyan-300">
        <Link href="/about" className="hover:underline">
          {t('about')}
        </Link>
        <Link href="/community" className="hover:underline">
          {t('community')}
        </Link>
        <Link href="/articles" className="hover:underline">
          {t('articles')}
        </Link>
        <Link href="/forum" className="hover:underline">
          {t('forum')}
        </Link>
      </nav>
      <p className="drop-shadow-[0_0_3px_rgba(0,255,255,0.5)]">{t('copyright')}</p>
      <p className="mt-2 text-pink-500">{t('description')}</p>
    </footer>
  );
}
