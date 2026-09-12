'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import PageFrame from '@/components/PageFrame';
import ContentBody from '@/components/ContentBody';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  deleteArticle,
  fetchArticleById,
  selectCurrentArticle,
} from '@/store/slices/articleSlice';
import { displayName, canManage } from '@/lib/auth';
import TagChips from '@/components/TagChips';
import { dangerBtnClass, secondaryBtnClass } from '@/lib/styles';

export default function ArticlePage() {
  const params = useParams<{ article: string }>();
  const id = params.article;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const article = useAppSelector(selectCurrentArticle);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchArticleById(id));
    }
  }, [dispatch, id]);

  const owner = canManage(user, article?.author);

  return (
    <PageFrame>
      <section className="mx-auto max-w-3xl px-4 py-10">
        {!article ? (
          <p>{t('auth.loading')}</p>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-cyan-400">{article.title}</h1>
            <p className="mt-2 text-sm text-gray-400">
              {displayName(article.author)} ·{' '}
              {new Date(article.createdAt).toLocaleString()}
            </p>
            <p className="mt-4 text-pink-400">{article.summary}</p>
            <TagChips
              tags={article.tags}
              onSelect={(tag) => router.push(`/articles?tag=${encodeURIComponent(tag)}`)}
            />
            <div className="mt-6">
              <ContentBody content={article.content} />
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/articles" className={secondaryBtnClass}>
                {t('actions.back')}
              </Link>
              {owner && (
                <>
                  <Link href={`/articles/${article._id}/edit`} className={secondaryBtnClass}>
                    {t('actions.edit')}
                  </Link>
                  <button
                    type="button"
                    className={dangerBtnClass}
                    onClick={async () => {
                      if (!window.confirm(t('actions.confirmDelete'))) {
                        return;
                      }
                      await dispatch(deleteArticle(article._id));
                      router.push('/articles');
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
