import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslations } from 'next-intl';

export default function ForumPage() {
  const t = useTranslations();
  const threadList = t.raw('forum.threadList') as Array<{
    title: string;
    author: string;
    description: string;
    date: string;
    link: string;
    replies: number;
    views: number;
  }>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 font-mono text-cyan-300">
      <Navbar />
      <section className="mb-12 border-b border-cyan-500 pb-8 text-center">
        <h1 className="text-4xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] md:text-5xl">
          {t('forum.header.title')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pink-400">
          {t('forum.header.description')}
        </p>
      </section>

      <section className="mx-auto max-w-5xl">
        <div className="grid gap-6 md:grid-cols-2">
          {threadList.map((thread, index) => (
            <div
              key={index}
              className="rounded-xl border border-cyan-600 bg-gray-900 p-6 drop-shadow-md transition hover:shadow-cyan-700/40"
            >
              <h3 className="mb-2 text-lg font-semibold text-cyan-300">
                {thread.title}
              </h3>
              <p className="mb-2 text-pink-400">{thread.description}</p>
              <p className="mb-4 text-sm text-gray-400">
                <span className="font-semibold">{thread.author}</span> -{' '}
                {thread.date} - {thread.replies} replies - {thread.views} views
              </p>
              <a
                href={thread.link}
                className="text-sm text-cyan-400 hover:underline"
              >
                {t('forum.viewThread')}
              </a>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
