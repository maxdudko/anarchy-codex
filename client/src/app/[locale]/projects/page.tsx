'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import PageFrame from '@/components/PageFrame';
import ListToolbar from '@/components/ListToolbar';
import PaginationBar from '@/components/PaginationBar';
import StatusBlock from '@/components/StatusBlock';
import TagChips from '@/components/TagChips';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchProjects,
  selectProjectList,
  selectProjectPagination,
} from '@/store/slices/projectSlice';
import { LIST_PAGE_SIZE, useListFilters } from '@/lib/list';
import { primaryBtnClass } from '@/lib/styles';

export default function ProjectsPage() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectProjectList) || [];
  const pagination = useAppSelector(selectProjectPagination);
  const { loading, error } = useAppSelector((state) => state.projects);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { page, tag, q, setFilters } = useListFilters();

  useEffect(() => {
    dispatch(
      fetchProjects({
        page,
        limit: LIST_PAGE_SIZE,
        tag: tag || undefined,
        search: q || undefined,
      }),
    );
  }, [dispatch, page, tag, q]);

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
        <ListToolbar
          query={q}
          tag={tag}
          onSearch={(value) => setFilters({ q: value })}
          onClear={() => setFilters({ q: '', tag: null })}
        />
        {loading || error || projects.length === 0 ? (
          <StatusBlock
            loading={loading && projects.length === 0}
            error={error}
            empty={!loading && projects.length === 0}
            hasFilters={Boolean(q || tag)}
          />
        ) : (
          <ul className="space-y-4">
            {projects.map((project) => (
              <li key={project._id} className="rounded-lg bg-gray-800 p-4">
                <h3 className="text-lg font-bold text-cyan-200">{project.title}</h3>
                <p className="text-pink-400">{project.description}</p>
                <TagChips tags={project.tags} onSelect={(next) => setFilters({ tag: next })} />
                <Link href={`/projects/${project._id}`} className="mt-2 inline-block text-cyan-400 hover:underline">
                  {t('projects.readMoreBtn')}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <PaginationBar
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={(next) => setFilters({ page: next })}
        />
      </section>
    </PageFrame>
  );
}
