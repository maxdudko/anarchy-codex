'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import PageFrame from '@/components/PageFrame';
import ContentBody from '@/components/ContentBody';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  deleteEvent,
  fetchEventById,
  joinEvent,
  leaveEvent,
  selectCurrentEvent,
} from '@/store/slices/eventsSlice';
import { displayName, getEntityId, isOwner } from '@/lib/auth';
import { dangerBtnClass, primaryBtnClass, secondaryBtnClass } from '@/lib/styles';

export default function EventPage() {
  const params = useParams<{ event: string }>();
  const id = params.event;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const event = useAppSelector(selectCurrentEvent);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id) dispatch(fetchEventById(id));
  }, [dispatch, id]);

  const owner = isOwner(user, event?.organizer);
  const attending = Boolean(
    user &&
      event?.attendees?.some((attendee) => getEntityId(attendee) === user._id),
  );

  return (
    <PageFrame>
      <section className="mx-auto max-w-3xl px-4 py-10">
        {!event ? (
          <p>{t('auth.loading')}</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-cyan-400">{event.title}</h1>
            <p className="mt-2 text-sm text-gray-400">
              {displayName(event.organizer)} · {new Date(event.startDate).toLocaleString()}
              {event.location ? ` · ${event.location}` : ''}
            </p>
            <div className="mt-6">
              <ContentBody content={event.description} />
            </div>
            {event.url && (
              <a href={event.url} className="mt-4 inline-block text-cyan-400 hover:underline">
                {event.url}
              </a>
            )}
            <p className="mt-4 text-sm text-pink-400">
              {t('actions.attendees')}: {event.attendeeCount ?? event.attendees?.length ?? 0}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {isAuthenticated && event.isPublic && (
                <button
                  type="button"
                  className={primaryBtnClass}
                  onClick={() =>
                    dispatch(attending ? leaveEvent(event._id) : joinEvent(event._id))
                  }
                >
                  {attending ? t('actions.leave') : t('actions.join')}
                </button>
              )}
              <Link href="/events" className={secondaryBtnClass}>
                {t('actions.back')}
              </Link>
              {owner && (
                <>
                  <Link href={`/events/${event._id}/edit`} className={secondaryBtnClass}>
                    {t('actions.edit')}
                  </Link>
                  <button
                    type="button"
                    className={dangerBtnClass}
                    onClick={async () => {
                      if (!window.confirm(t('actions.confirmDelete'))) return;
                      await dispatch(deleteEvent(event._id));
                      router.push('/events');
                    }}
                  >
                    {t('actions.delete')}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </section>
    </PageFrame>
  );
}
