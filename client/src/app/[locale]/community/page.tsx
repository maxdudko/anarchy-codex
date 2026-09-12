'use client';

import { useTranslations } from 'next-intl';
import PageFrame from '@/components/PageFrame';
import { Link } from '@/i18n/navigation';

export default function CommunityPage() {
  const t = useTranslations();
  const projectsList = t.raw('community.projectsList') as Array<{
    name: string;
    description: string;
    btnText: string;
    link: string;
  }>;

  return (
    <PageFrame>
      <section className="mb-12 border-b border-cyan-500 pb-8 text-center">
        <h1 className="px-6 py-16 text-4xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] md:text-5xl">
          {t('community.header.title')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pink-400">
          {t('community.header.description')}
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {projectsList.map((project) => (
            <div
              key={project.link}
              className="rounded-xl border border-cyan-600 bg-gray-900 p-6 drop-shadow-md transition hover:shadow-cyan-700/40"
            >
              <h3 className="mb-2 text-lg font-semibold text-cyan-300">
                {project.name}
              </h3>
              <p className="mb-4 text-pink-400">{project.description}</p>
              <Link href={project.link} className="text-sm text-cyan-400 hover:underline">
                {project.btnText}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </PageFrame>
  );
}
