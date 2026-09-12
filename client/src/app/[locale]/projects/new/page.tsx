'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import PageFrame from '@/components/PageFrame';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createProject } from '@/store/slices/projectSlice';
import { parseTags } from '@/lib/auth';
import { inputClass, primaryBtnClass } from '@/lib/styles';

export default function NewProjectPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const { isAuthenticated, hydrated, accessToken } = useAppSelector((state) => state.auth);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    if (hydrated && !isAuthenticated && !accessToken) {
      router.push('/login');
    }
  }, [hydrated, isAuthenticated, accessToken, router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await dispatch(
      createProject({
        title: title.trim(),
        description: description.trim(),
        tags: parseTags(tags),
        isPublished,
      }),
    );
    if (createProject.fulfilled.match(result)) {
      router.push(`/projects/${result.payload._id}`);
    }
  };

  return (
    <PageFrame>
      <form className="mx-auto max-w-3xl px-4 py-10" onSubmit={handleSubmit}>
        <h1 className="mb-6 text-3xl font-bold text-cyan-400">{t('actions.newProject')}</h1>
        <label className="text-sm text-pink-400">{t('actions.title')}</label>
        <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
        <label className="text-sm text-pink-400">{t('actions.description')}</label>
        <textarea className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} required />
        <label className="text-sm text-pink-400">{t('actions.tags')}</label>
        <input className={inputClass} value={tags} onChange={(e) => setTags(e.target.value)} />
        <label className="mb-4 flex items-center gap-2 text-sm text-pink-400">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
          {t('actions.published')}
        </label>
        <button className={primaryBtnClass} type="submit">
          {t('actions.save')}
        </button>
      </form>
    </PageFrame>
  );
}
