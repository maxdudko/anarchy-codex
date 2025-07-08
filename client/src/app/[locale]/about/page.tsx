import Navbar from '@/components/Navbar';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black to-gray-900 font-mono text-cyan-300">
      <Navbar />
      <section className="px-4">
        <h1>About Us</h1>
        <p>This is the about page of our application.</p>
        <p>
          Here you can find information about our team, mission, and values.
        </p>
      </section>
    </main>
  );
}
