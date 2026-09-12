'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import PageFrame from '@/components/PageFrame';
import RichTextEditor from '@/components/RichTextEditor';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createArticle } from '@/store/slices/articleSlice';
import { htmlToText, parseTags } from '@/lib/auth';
import { inputClass, primaryBtnClass } from '@/lib/styles';

export default function NewArticlePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const { isAuthenticated, hydrated, accessToken } = useAppSelector(
    (state) => state.auth,
  );
  const { loading, error } = useAppSelector((state) => state.articles);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    if (!isAuthenticated && !accessToken) {
      router.push('/login');
    }
  }, [hydrated, isAuthenticated, accessToken, router]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !summary.trim() || !htmlToText(content)) {
      setLocalError(t('actions.requiredFields'));
      return;
    }
    const result = await dispatch(
      createArticle({
        title: title.trim(),
        summary: summary.trim(),
        content,
        tags: parseTags(tags),
        isPublished,
      }),
    );
    if (createArticle.fulfilled.match(result)) {
      router.push(`/articles/${result.payload._id}`);
    }
  };

  return (
    <PageFrame>
      <form className="mx-auto max-w-3xl px-4 py-10" onSubmit={handleSubmit}>
        <h1 className="mb-6 text-3xl font-bold text-cyan-400">
          {t('actions.newArticle')}
        </h1>
        <label className="text-sm text-pink-400">{t('actions.title')}</label>
        <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
        <label className="text-sm text-pink-400">{t('actions.summary')}</label>
        <textarea className={inputClass} value={summary} onChange={(e) => setSummary(e.target.value)} />
        <label className="text-sm text-pink-400">{t('actions.content')}</label>
        <RichTextEditor value={content} onChange={setContent} />
        <label className="text-sm text-pink-400">{t('actions.tags')}</label>
        <input
          className={inputClass}
          placeholder={t('actions.tagsHint')}
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <label className="mb-4 flex items-center gap-2 text-sm text-pink-400">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          {t('actions.published')}
        </label>
        {(localError || error) && (
          <p className="mb-3 text-red-400">{localError || error}</p>
        )}
        <button className={primaryBtnClass} type="submit" disabled={loading}>
          {t('actions.save')}
        </button>
      </form>
    </PageFrame>
  );
}
