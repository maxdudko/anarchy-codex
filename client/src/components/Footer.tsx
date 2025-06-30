export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-cyan-500 px-6 py-8 text-center text-sm text-cyan-500">
      <p className="drop-shadow-[0_0_3px_rgba(0,255,255,0.5)]">
        © {new Date().getFullYear()} ANARCHY CODEX. Powered by freedom and
        code.
      </p>
      <p className="mt-2 text-pink-500">
        Designed for decentralization and autonomy.
      </p>
    </footer>
  );
};

export default Footer;
