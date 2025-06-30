'use client';

import { useTranslations } from 'next-intl';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function HomePage() {
  const t = useTranslations();
  const articlesList = t.raw('home.sections.articlesList') as Array<{
    title: string;
    summary: string;
    link: string;
  }>;
  const projectsList = t.raw('home.sections.projectsList') as Array<{
    name: string;
    description: string;
    link: string;
  }>;
  const eventsList = t.raw('home.sections.eventsList') as Array<{
    name: string;
    description: string;
    date: string;
    location: string;
    link: string;
  }>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 font-mono text-cyan-300">
      <Navbar />
      <section className="border-b border-cyan-500 px-6 py-16 text-center">
        <h2 className="mx-auto w-[540px] text-4xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] md:text-5xl">
          {t('home.header.title')}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pink-400">
          {t('home.header.description')}
        </p>
        <button className="mt-6 rounded border border-cyan-400 px-6 py-2 drop-shadow-[0_0_5px_rgba(0,255,255,0.6)] transition hover:bg-cyan-800">
          {t('home.header.readMoreBtn')}
        </button>
      </section>

      <section className="grid gap-8 border-b border-cyan-500 px-6 py-12 text-sm md:grid-cols-3">
        <div>
          <h3 className="mb-2 text-lg font-semibold text-cyan-300 drop-shadow-[0_0_4px_rgba(0,255,255,0.5)]">
            {t('home.sections.latestArticles')}
          </h3>
          <ul className="space-y-2 text-pink-400">
            {articlesList.map((article, index) => (
              <li key={index}>
                <strong className="text-cyan-300">{article.title}</strong>
                <br />
                {article.summary}
                <a
                  href={article.link}
                  className="ml-2 text-cyan-400 hover:underline"
                >
                  {t('home.sections.readMoreBtn')}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold text-cyan-300 drop-shadow-[0_0_4px_rgba(0,255,255,0.5)]">
            {t('home.sections.projectsTitle')}
          </h3>
          <ul className="space-y-2 text-pink-400">
            {projectsList.map((project, index) => (
              <li key={index}>
                <strong className="text-cyan-300">{project.name}</strong>
                <br />
                {project.description}
                <a
                  href={project.link}
                  className="ml-2 text-cyan-400 hover:underline"
                >
                  {t('home.sections.readMoreBtn')}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold text-cyan-300 drop-shadow-[0_0_4px_rgba(0,255,255,0.5)]">
            Upcoming Events
          </h3>
          <ul className="space-y-2 text-pink-400">
            {eventsList.map((event, index) => (
              <li key={index}>
                <strong className="text-cyan-300">{event.name}</strong>
                <br />
                {event.description} <br />
                <span className="text-sm text-gray-400">
                  Date: {event.date} | Location: {event.location}
                </span>
                <a
                  href={event.link}
                  className="ml-2 text-cyan-400 hover:underline"
                >
                  {t('home.sections.readMoreBtn')}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-8 px-6 py-12 md:grid-cols-2">
        <div className="rounded-xl border border-cyan-500 bg-gray-900 p-6 drop-shadow-[0_0_10px_rgba(0,255,255,0.2)]">
          <h4 className="mb-2 text-lg font-semibold text-cyan-300">
            {t('home.sections.knowledgeBase')}
          </h4>
          <p className="text-pink-400">
            {t('home.sections.knowledgeBaseDescription')}
          </p>
          <button className="mt-4 rounded border border-cyan-400 px-4 py-2 transition hover:bg-cyan-800">
            {t('home.sections.exploreBtn')}
          </button>
        </div>

        <div className="rounded-xl border border-cyan-500 bg-gray-900 p-6 drop-shadow-[0_0_10px_rgba(0,255,255,0.2)]">
          <h4 className="mb-2 text-lg font-semibold text-cyan-300">
            {t('home.sections.discussionForum')}
          </h4>
          <p className="text-pink-400">
            {t('home.sections.discussionForumDescription')}
          </p>
          <button className="mt-4 rounded border border-cyan-400 px-4 py-2 transition hover:bg-cyan-800">
            {t('home.sections.joinForumBtn')}
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
