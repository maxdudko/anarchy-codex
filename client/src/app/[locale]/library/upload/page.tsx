'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import PageFrame from '@/components/PageFrame';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { uploadFile } from '@/store/slices/librarySlice';
import { inputClass, primaryBtnClass } from '@/lib/styles';

export default function UploadLibraryPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const { isAuthenticated, hydrated, accessToken } = useAppSelector((state) => state.auth);
  const error = useAppSelector((state) => state.library.error);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sourceAuthor, setSourceAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (hydrated && !isAuthenticated && !accessToken) {
      router.push('/login');
    }
  }, [hydrated, isAuthenticated, accessToken, router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      return;
    }
    const form = new FormData();
    form.append('title', title.trim());
    form.append('description', description.trim());
    form.append('sourceAuthor', sourceAuthor.trim());
    form.append('tags', tags);
    form.append('isPublic', String(isPublic));
    form.append('file', file);
    const result = await dispatch(uploadFile(form));
    if (uploadFile.fulfilled.match(result)) {
      router.push(`/library/${result.payload._id}`);
    }
  };

  return (
    <PageFrame>
      <form className="mx-auto max-w-3xl px-4 py-10" onSubmit={handleSubmit}>
        <h1 className="mb-6 text-3xl font-bold text-cyan-400">{t('actions.upload')}</h1>
        <label className="text-sm text-pink-400">{t('actions.title')}</label>
        <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
        <label className="text-sm text-pink-400">{t('actions.description')}</label>
        <textarea className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} />
        <label className="text-sm text-pink-400">{t('actions.sourceAuthor')}</label>
        <input className={inputClass} value={sourceAuthor} onChange={(e) => setSourceAuthor(e.target.value)} />
        <label className="text-sm text-pink-400">{t('actions.tags')}</label>
        <input className={inputClass} value={tags} onChange={(e) => setTags(e.target.value)} />
        <label className="text-sm text-pink-400">{t('actions.file')}</label>
        <input
          className={inputClass}
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />
        <label className="mb-4 flex items-center gap-2 text-sm text-pink-400">
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          {t('actions.public')}
        </label>
        {error && <p className="mb-3 text-red-400">{error}</p>}
        <button className={primaryBtnClass} type="submit">
          {t('actions.save')}
        </button>
      </form>
    </PageFrame>
  );
}
