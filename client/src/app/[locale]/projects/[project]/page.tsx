'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import PageFrame from '@/components/PageFrame';
import ContentBody from '@/components/ContentBody';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  deleteProject,
  fetchProjectById,
  selectCurrentProject,
} from '@/store/slices/projectSlice';
import { displayName, isOwner } from '@/lib/auth';
import { dangerBtnClass, secondaryBtnClass } from '@/lib/styles';

export default function ProjectPage() {
  const params = useParams<{ project: string }>();
  const id = params.project;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const project = useAppSelector(selectCurrentProject);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchProjectById(id));
    }
  }, [dispatch, id]);

  const owner = isOwner(user, project?.author);

  return (
    <PageFrame>
      <section className="mx-auto max-w-3xl px-4 py-10">
        {!project ? (
          <p>{t('auth.loading')}</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-cyan-400">{project.title}</h1>
            <p className="mt-2 text-sm text-gray-400">
              {displayName(project.author)} · {new Date(project.createdAt).toLocaleString()}
            </p>
            <div className="mt-6">
              <ContentBody content={project.description} />
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/projects" className={secondaryBtnClass}>
                {t('actions.back')}
              </Link>
              {owner && (
                <>
                  <Link href={`/projects/${project._id}/edit`} className={secondaryBtnClass}>
                    {t('actions.edit')}
                  </Link>
                  <button
                    type="button"
                    className={dangerBtnClass}
                    onClick={async () => {
                      if (!window.confirm(t('actions.confirmDelete'))) return;
                      await dispatch(deleteProject(project._id));
                      router.push('/projects');
                    }}
                  >
                    {t('actions.delete')}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </section>
    </PageFrame>
  );
}
