'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import PageFrame from '@/components/PageFrame';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchProjectById,
  selectCurrentProject,
  updateProject,
} from '@/store/slices/projectSlice';
import { isOwner, parseTags } from '@/lib/auth';
import { inputClass, primaryBtnClass } from '@/lib/styles';

export default function EditProjectPage() {
  const params = useParams<{ project: string }>();
  const id = params.project;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const project = useAppSelector(selectCurrentProject);
  const { user, hydrated } = useAppSelector((state) => state.auth);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchProjectById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!project || project._id !== id) return;
    setTitle(project.title);
    setDescription(project.description);
    setTags((project.tags || []).join(', '));
    setIsPublished(project.isPublished);
    setReady(true);
  }, [project, id]);

  useEffect(() => {
    if (hydrated && ready && project && !isOwner(user, project.author)) {
      router.push(`/projects/${id}`);
    }
  }, [hydrated, ready, project, user, router, id]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const result = await dispatch(
      updateProject({
        id,
        newsData: {
          title: title.trim(),
          description: description.trim(),
          tags: parseTags(tags),
          isPublished,
        },
      }),
    );
    if (updateProject.fulfilled.match(result)) {
      router.push(`/projects/${id}`);
    }
  };

  return (
    <PageFrame>
      <form className="mx-auto max-w-3xl px-4 py-10" onSubmit={handleSubmit}>
        <h1 className="mb-6 text-3xl font-bold text-cyan-400">{t('actions.edit')}</h1>
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
