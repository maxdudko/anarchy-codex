'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import PageFrame from '@/components/PageFrame';
import RichTextEditor from '@/components/RichTextEditor';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchArticleById,
  selectCurrentArticle,
  updateArticle,
} from '@/store/slices/articleSlice';
import { htmlToText, isOwner, parseTags } from '@/lib/auth';
import { inputClass, primaryBtnClass } from '@/lib/styles';

export default function EditArticlePage() {
  const params = useParams<{ article: string }>();
  const id = params.article;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const article = useAppSelector(selectCurrentArticle);
  const { user, hydrated } = useAppSelector((state) => state.auth);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchArticleById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!article || article._id !== id) {
      return;
    }
    setTitle(article.title);
    setSummary(article.summary);
    setContent(article.content);
    setTags((article.tags || []).join(', '));
    setIsPublished(article.isPublished);
    setReady(true);
  }, [article, id]);

  useEffect(() => {
    if (!hydrated || !ready || !article) {
      return;
    }
    if (!isOwner(user, article.author)) {
      router.push(`/articles/${id}`);
    }
  }, [hydrated, ready, article, user, router, id]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !summary.trim() || !htmlToText(content)) {
      return;
    }
    const result = await dispatch(
      updateArticle({
        id,
        articleData: {
          title: title.trim(),
          summary: summary.trim(),
          content,
          tags: parseTags(tags),
          isPublished,
        },
      }),
    );
    if (updateArticle.fulfilled.match(result)) {
      router.push(`/articles/${id}`);
    }
  };

  return (
    <PageFrame>
      <form className="mx-auto max-w-3xl px-4 py-10" onSubmit={handleSubmit}>
        <h1 className="mb-6 text-3xl font-bold text-cyan-400">{t('actions.edit')}</h1>
        {!ready ? (
          <p>{t('auth.loading')}</p>
        ) : (
          <>
            <label className="text-sm text-pink-400">{t('actions.title')}</label>
            <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
            <label className="text-sm text-pink-400">{t('actions.summary')}</label>
            <textarea className={inputClass} value={summary} onChange={(e) => setSummary(e.target.value)} />
            <label className="text-sm text-pink-400">{t('actions.content')}</label>
            <RichTextEditor value={content} onChange={setContent} />
            <label className="text-sm text-pink-400">{t('actions.tags')}</label>
            <input className={inputClass} value={tags} onChange={(e) => setTags(e.target.value)} />
            <label className="mb-4 flex items-center gap-2 text-sm text-pink-400">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              {t('actions.published')}
            </label>
            <button className={primaryBtnClass} type="submit">
              {t('actions.save')}
            </button>
          </>
        )}
      </form>
    </PageFrame>
  );
}
