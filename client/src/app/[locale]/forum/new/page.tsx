'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import PageFrame from '@/components/PageFrame';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createThread } from '@/store/slices/forumSlice';
import { parseTags } from '@/lib/auth';
import { inputClass, primaryBtnClass } from '@/lib/styles';

export default function NewThreadPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const { isAuthenticated, hydrated, accessToken } = useAppSelector((state) => state.auth);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (hydrated && !isAuthenticated && !accessToken) {
      router.push('/login');
    }
  }, [hydrated, isAuthenticated, accessToken, router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await dispatch(
      createThread({
        title: title.trim(),
        content: content.trim(),
        tags: parseTags(tags),
      }),
    );
    if (createThread.fulfilled.match(result)) {
      router.push(`/forum/${result.payload._id}`);
    }
  };

  return (
    <PageFrame>
      <form className="mx-auto max-w-3xl px-4 py-10" onSubmit={handleSubmit}>
        <h1 className="mb-6 text-3xl font-bold text-cyan-400">{t('actions.newThread')}</h1>
        <label className="text-sm text-pink-400">{t('actions.title')}</label>
        <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
        <label className="text-sm text-pink-400">{t('actions.content')}</label>
        <textarea className={inputClass} rows={8} value={content} onChange={(e) => setContent(e.target.value)} required />
        <label className="text-sm text-pink-400">{t('actions.tags')}</label>
        <input className={inputClass} value={tags} onChange={(e) => setTags(e.target.value)} />
        <button className={primaryBtnClass} type="submit">
          {t('actions.save')}
        </button>
      </form>
    </PageFrame>
  );
}
