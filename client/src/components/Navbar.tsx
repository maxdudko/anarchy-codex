'use client';

import { FC, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Logo from '../../public/logo.png';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

const Navbar: FC = () => {
  const t = useTranslations();
  const params = useParams();
  const pathname = usePathname();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigation = t.raw('navigation') as Array<{
    name: string;
    path: string;
  }>;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  pathname.replace(`/${params.locale}`, '');

  return (
    <header className="relative flex items-center justify-between border-b border-cyan-500 px-6 py-4">
      <h1 className="text-2xl font-bold text-cyan-400 drop-shadow-[0_0_5px_rgba(0,255,255,0.7)]">
        <Link href="/">
          <Image
            src={Logo}
            alt="Anarhy Codex Logo"
            width={40}
            height={40}
            className="mr-4 inline-block rounded-full"
          />
          ANARCHY CODEX
        </Link>
      </h1>
      <div className="flex items-center gap-4">
        <nav className="hidden space-x-6 text-pink-400 md:flex">
          {navigation.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className={`hover:text-cyan-300 ${pathname === item.path ? 'font-semibold text-red-50' : ''}`}
            >
              {item.name}
            </a>
          ))}
        </nav>
        <div>
          <select
            className="cursor-pointer rounded border border-cyan-500 bg-gray-800 px-2 py-1 text-pink-400 hover:bg-gray-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            onChange={(e) => {
              const locale = e.target.value;
              if (locale) {
                window.location.href = `/${locale}`;
              }
            }}
            defaultValue={params.locale}
          >
            <option value="en">English</option>
            <option value="ru">Russian</option>
            <option value="ua">Ukrainian</option>
          </select>
        </div>
        {!isAuthenticated && (
          <div>
            <Link
              href="/login"
              className="rounded border border-cyan-400 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-800 hover:text-white"
            >
              Login
            </Link>
          </div>
        )}
      </div>
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="text-cyan-300 hover:text-cyan-100 md:hidden"
      >
        ☰
      </button>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 z-50 flex w-full flex-col space-y-2 border-t border-cyan-500 bg-gray-900 p-4 text-pink-400 md:hidden">
          {navigation.map((item, index) => (
            <Link key={index} href={item.path} className="hover:text-cyan-300">
              {item.name}
            </Link>
          ))}
          <div className="relative">
            <select
              className="rounded border border-cyan-500 bg-gray-800 px-2 py-1 text-pink-400 hover:bg-gray-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              onChange={(e) => {
                const locale = e.target.value;
                if (locale) {
                  window.location.href = `/${locale}`;
                }
              }}
              defaultValue={params.locale}
            >
              <option value="en">English</option>
              <option value="ru">Russian</option>
              <option value="ua">Ukrainian</option>
            </select>
          </div>
          {!isAuthenticated && (
            <div>
              <Link
                href="/login"
                className="rounded border border-cyan-400 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-800 hover:text-white"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
