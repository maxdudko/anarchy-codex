'use client';

import { FC, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Logo from '../../public/logo.png';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

const Navbar: FC = () => {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const navigation = t.raw('navigation') as Array<{
    name: string;
    path: string;
  }>;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const changeLocale = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale });
  };

  const handleLogout = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="relative flex items-center justify-between border-b border-cyan-500 px-6 py-4">
      <h1 className="text-2xl font-bold text-cyan-400 drop-shadow-[0_0_5px_rgba(0,255,255,0.7)]">
        <Link href="/">
          <Image
            src={Logo}
            alt="Anarchy Codex Logo"
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
            <Link
              key={index}
              href={item.path}
              className={`hover:text-cyan-300 ${pathname === item.path ? 'font-semibold text-red-50' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div>
          <select
            className="cursor-pointer rounded border border-cyan-500 bg-gray-800 px-2 py-1 text-pink-400 hover:bg-gray-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            onChange={(e) => changeLocale(e.target.value)}
            value={locale}
          >
            <option value="en">English</option>
            <option value="ru">Russian</option>
            <option value="ua">Ukrainian</option>
          </select>
        </div>
        {isAuthenticated ? (
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/profile"
              className="rounded border border-cyan-400 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-800 hover:text-white"
            >
              {user?.pseudonym || t('auth.profile')}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded border border-pink-400 px-4 py-2 text-sm text-pink-300 transition hover:bg-pink-900 hover:text-white"
            >
              {t('auth.logout')}
            </button>
          </div>
        ) : (
          <div className="hidden md:block">
            <Link
              href="/login"
              className="rounded border border-cyan-400 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-800 hover:text-white"
            >
              {t('auth.login')}
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
          <select
            className="rounded border border-cyan-500 bg-gray-800 px-2 py-1 text-pink-400 hover:bg-gray-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            onChange={(e) => changeLocale(e.target.value)}
            value={locale}
          >
            <option value="en">English</option>
            <option value="ru">Russian</option>
            <option value="ua">Ukrainian</option>
          </select>
          {isAuthenticated ? (
            <>
              <Link href="/profile" className="hover:text-cyan-300">
                {user?.pseudonym || t('auth.profile')}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-left hover:text-cyan-300"
              >
                {t('auth.logout')}
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-cyan-300">
              {t('auth.login')}
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
