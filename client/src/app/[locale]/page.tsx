'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import PageFrame from '@/components/PageFrame';
import { Link } from '@/i18n/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchArticles, selectArticleList } from '@/store/slices/articleSlice';
import { fetchProjects, selectProjectList } from '@/store/slices/projectSlice';
import { fetchEvents, selectEventsList } from '@/store/slices/eventsSlice';

export default function HomePage() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const articles = useAppSelector(selectArticleList) || [];
  const projects = useAppSelector(selectProjectList) || [];
  const events = useAppSelector(selectEventsList) || [];

  useEffect(() => {
    dispatch(fetchArticles({ limit: 3 }));
    dispatch(fetchProjects({ limit: 3 }));
    dispatch(fetchEvents({ limit: 3 }));
  }, [dispatch]);

  return (
    <PageFrame>
      <section className="border-b border-cyan-500 px-6 py-16 text-center">
        <h2 className="mx-auto w-[540px] text-4xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] md:text-5xl">
          {t('home.header.title')}
        </h2>
        <p className="mx-auto mt-4 mb-10 max-w-2xl text-pink-400">
          {t('home.header.description')}
        </p>
        <Link
          href="/about"
          className="mt-6 rounded border border-cyan-400 px-6 py-2 drop-shadow-[0_0_5px_rgba(0,255,255,0.6)] transition hover:bg-cyan-800"
        >
          {t('home.header.readMoreBtn')}
        </Link>
      </section>

      <section className="grid gap-8 border-b border-cyan-500 px-6 py-12 text-sm md:grid-cols-3">
        <div>
          <h3 className="mb-2 text-lg font-semibold text-cyan-300 drop-shadow-[0_0_4px_rgba(0,255,255,0.5)]">
            {t('home.sections.latestArticles')}
          </h3>
          <ul className="mb-4 space-y-2 text-pink-400">
            {articles.map((article, index) => (
              <li key={index}>
                <strong className="text-cyan-300">{article.title}</strong>
                <br />
                {new Date(article.createdAt).toLocaleString()} -{' '}
                {article.summary}
                <Link
                  href={`/articles/${article._id}`}
                  className="ml-2 text-cyan-400 hover:underline"
                >
                  {t('home.sections.readMoreBtn')}
                </Link>
              </li>
            ))}
          </ul>
          <button className="mt-4 rounded border border-cyan-400 px-4 py-2 transition hover:bg-cyan-800">
            <Link href="/articles" className="text-cyan-300">
              {t('home.sections.viewAllArticlesBtn')}
            </Link>
          </button>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold text-cyan-300 drop-shadow-[0_0_4px_rgba(0,255,255,0.5)]">
            {t('home.sections.projectsTitle')}
          </h3>
          <ul className="mb-4 space-y-2 text-pink-400">
            {projects.map((project, index) => (
              <li key={index}>
                <strong className="text-cyan-300">{project.title}</strong>
                <br />
                {project.description}
                <Link
                  href={`/projects/${project._id}`}
                  className="ml-2 text-cyan-400 hover:underline"
                >
                  {t('home.sections.readMoreBtn')}
                </Link>
              </li>
            ))}
          </ul>
          <button className="mt-4 rounded border border-cyan-400 px-4 py-2 transition hover:bg-cyan-800">
            <Link href="/projects" className="text-cyan-300">
              {t('home.sections.viewAllProjectsBtn')}
            </Link>
          </button>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold text-cyan-300 drop-shadow-[0_0_4px_rgba(0,255,255,0.5)]">
            {t('home.sections.eventsTitle')}
          </h3>
          <ul className="mb-4 space-y-2 text-pink-400">
            {events.map((event, index) => (
              <li key={index}>
                <strong className="text-cyan-300">{event.title}</strong>
                <br />
                {event.description} <br />
                <span className="text-sm text-gray-400">
                  Date: {new Date(event.createdAt).toLocaleString()} | Location:{' '}
                  {event.location}
                </span>
                <Link
                  href={`/events/${event._id}`}
                  className="ml-2 text-cyan-400 hover:underline"
                >
                  {t('home.sections.readMoreBtn')}
                </Link>
              </li>
            ))}
          </ul>
          <button className="mt-4 rounded border border-cyan-400 px-4 py-2 transition hover:bg-cyan-800">
            <Link href="/events" className="text-cyan-300">
              {t('home.sections.viewAllEventsBtn')}
            </Link>
          </button>
        </div>
      </section>

      <section className="grid gap-8 px-6 py-12 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-xl border border-cyan-500 bg-gray-900 p-6 drop-shadow-[0_0_10px_rgba(0,255,255,0.2)]">
          <div>
            <h4 className="mb-2 text-lg font-semibold text-cyan-300">
              {t('home.sections.knowledgeBase')}
            </h4>
            <p className="mb-10 text-pink-400">
              {t('home.sections.knowledgeBaseDescription')}
            </p>
          </div>
          <div>
            <Link
              href="/library"
              className="mt-4 rounded border border-cyan-400 px-4 py-2 transition hover:bg-cyan-800"
            >
              {t('home.sections.exploreBtn')}
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-cyan-500 bg-gray-900 p-6 drop-shadow-[0_0_10px_rgba(0,255,255,0.2)]">
          <div>
            <h4 className="mb-2 text-lg font-semibold text-cyan-300">
              {t('home.sections.discussionForum')}
            </h4>
            <p className="mb-10 text-pink-400">
              {t('home.sections.discussionForumDescription')}
            </p>
          </div>
          <div>
            <Link
              href="/forum"
              className="mt-4 rounded border border-cyan-400 px-4 py-2 transition hover:bg-cyan-800"
            >
              {t('home.sections.joinForumBtn')}
            </Link>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
