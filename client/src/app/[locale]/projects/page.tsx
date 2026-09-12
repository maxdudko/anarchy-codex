'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import PageFrame from '@/components/PageFrame';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProjects, selectProjectList } from '@/store/slices/projectSlice';
import { primaryBtnClass } from '@/lib/styles';

export default function ProjectsPage() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectProjectList) || [];
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <PageFrame>
      <section className="mb-12 border-b border-cyan-500 pb-8 text-center">
        <h1 className="px-6 py-16 text-4xl font-bold text-cyan-400 md:text-5xl">
          {t('projects.header.title')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pink-400">
          {t('projects.header.description')}
        </p>
        {isAuthenticated && (
          <Link href="/projects/new" className={`${primaryBtnClass} mt-6 inline-block`}>
            {t('actions.newProject')}
          </Link>
        )}
      </section>
      <section className="mx-auto max-w-5xl px-4">
        {projects.length === 0 ? (
          <p className="text-pink-400">{t('actions.empty')}</p>
        ) : (
          <ul className="space-y-4">
            {projects.map((project) => (
              <li key={project._id} className="rounded-lg bg-gray-800 p-4">
                <h3 className="text-lg font-bold text-cyan-200">{project.title}</h3>
                <p className="text-pink-400">{project.description}</p>
                <Link href={`/projects/${project._id}`} className="text-cyan-400 hover:underline">
                  {t('projects.readMoreBtn')}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageFrame>
  );
}
