'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import PageFrame from '@/components/PageFrame';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createEvent } from '@/store/slices/eventsSlice';
import { inputClass, primaryBtnClass } from '@/lib/styles';

export default function NewEventPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const { isAuthenticated, hydrated, accessToken } = useAppSelector((state) => state.auth);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [url, setUrl] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (hydrated && !isAuthenticated && !accessToken) {
      router.push('/login');
    }
  }, [hydrated, isAuthenticated, accessToken, router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await dispatch(
      createEvent({
        title: title.trim(),
        description: description.trim(),
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        location: location.trim() || undefined,
        url: url.trim() || undefined,
        isPublic,
      }),
    );
    if (createEvent.fulfilled.match(result)) {
      router.push(`/events/${result.payload._id}`);
    }
  };

  return (
    <PageFrame>
      <form className="mx-auto max-w-3xl px-4 py-10" onSubmit={handleSubmit}>
        <h1 className="mb-6 text-3xl font-bold text-cyan-400">{t('actions.newEvent')}</h1>
        <label className="text-sm text-pink-400">{t('actions.title')}</label>
        <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
        <label className="text-sm text-pink-400">{t('actions.description')}</label>
        <textarea className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} required />
        <label className="text-sm text-pink-400">{t('actions.startDate')}</label>
        <input className={inputClass} type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        <label className="text-sm text-pink-400">{t('actions.endDate')}</label>
        <input className={inputClass} type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <label className="text-sm text-pink-400">{t('actions.location')}</label>
        <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} />
        <label className="text-sm text-pink-400">{t('actions.url')}</label>
        <input className={inputClass} value={url} onChange={(e) => setUrl(e.target.value)} />
        <label className="mb-4 flex items-center gap-2 text-sm text-pink-400">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          {t('actions.public')}
        </label>
        <button className={primaryBtnClass} type="submit">
          {t('actions.save')}
        </button>
      </form>
    </PageFrame>
  );
}
