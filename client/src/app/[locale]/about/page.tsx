'use client';

import { useTranslations } from 'next-intl';
import PageFrame from '@/components/PageFrame';
import { Link } from '@/i18n/navigation';
import { secondaryBtnClass } from '@/lib/styles';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <PageFrame>
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="mb-6 text-4xl font-bold text-cyan-400">{t('title')}</h1>
        <p className="mb-8 text-lg text-pink-400">{t('lead')}</p>
        <div className="space-y-8 text-cyan-100">
          <section>
            <h2 className="mb-2 text-2xl text-cyan-300">{t('missionTitle')}</h2>
            <p>{t('mission')}</p>
          </section>
          <section>
            <h2 className="mb-2 text-2xl text-cyan-300">{t('identityTitle')}</h2>
            <p>{t('identity')}</p>
          </section>
          <section>
            <h2 className="mb-2 text-2xl text-cyan-300">{t('privacyTitle')}</h2>
            <p>{t('privacy')}</p>
          </section>
          <section>
            <h2 className="mb-2 text-2xl text-cyan-300">{t('howTitle')}</h2>
            <p>{t('how')}</p>
          </section>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/community" className={secondaryBtnClass}>
            {t('communityCta')}
          </Link>
          <Link href="/forum" className={secondaryBtnClass}>
            {t('forumCta')}
          </Link>
        </div>
      </section>
    </PageFrame>
  );
}
