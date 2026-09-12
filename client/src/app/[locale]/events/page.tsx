'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import PageFrame from '@/components/PageFrame';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchEvents, selectEventsList } from '@/store/slices/eventsSlice';
import { primaryBtnClass } from '@/lib/styles';

export default function EventsPage() {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectEventsList) || [];
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <PageFrame>
      <section className="mb-12 border-b border-cyan-500 pb-8 text-center">
        <h1 className="px-6 py-16 text-4xl font-bold text-cyan-400 md:text-5xl">
          {t('events.header.title')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pink-400">
          {t('events.header.description')}
        </p>
        {isAuthenticated && (
          <Link href="/events/new" className={`${primaryBtnClass} mt-6 inline-block`}>
            {t('actions.newEvent')}
          </Link>
        )}
      </section>
      <section className="mx-auto max-w-5xl px-4">
        {events.length === 0 ? (
          <p className="text-pink-400">{t('actions.empty')}</p>
        ) : (
          <ul className="space-y-4">
            {events.map((event) => (
              <li key={event._id} className="rounded-lg bg-gray-800 p-4">
                <h3 className="text-lg font-bold text-cyan-200">{event.title}</h3>
                <p className="text-pink-400">{event.description}</p>
                <p className="text-sm text-gray-400">
                  {new Date(event.startDate).toLocaleString()} · {event.location}
                </p>
                <Link href={`/events/${event._id}`} className="text-cyan-400 hover:underline">
                  {t('events.readMoreBtn')}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageFrame>
  );
}
