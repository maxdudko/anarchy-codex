import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslations } from 'next-intl';

export default function CommunityPage() {
  const t = useTranslations();
  const projectsList = t.raw('community.projectsList') as Array<{
    name: string;
    description: string;
    btnText: string;
    link: string;
  }>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 font-mono text-cyan-300">
      <Navbar />
      <section className="mb-12 border-b border-cyan-500 pb-8 text-center">
        <h1 className="text-4xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] md:text-5xl">
          {t('community.header.title')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pink-400">
          {t('community.header.description')}
        </p>
      </section>

      <section className="mx-auto max-w-5xl">
        <div className="grid gap-6 md:grid-cols-3">
          {projectsList.map((project, index) => (
            <div
              key={index}
              className="rounded-xl border border-cyan-600 bg-gray-900 p-6 drop-shadow-md transition hover:shadow-cyan-700/40"
            >
              <h3 className="mb-2 text-lg font-semibold text-cyan-300">
                {project.name}
              </h3>
              <p className="mb-2 text-pink-400">{project.description}</p>
              <a
                href={project.link}
                className="text-sm text-cyan-400 hover:underline"
              >
                {project.btnText}
              </a>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
