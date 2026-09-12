'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import PageFrame from '@/components/PageFrame';
import ContentBody from '@/components/ContentBody';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  createMessage,
  deleteMessage,
  deleteThread,
  fetchMessages,
  fetchThreadById,
  likeMessage,
  moderateThread,
  selectCurrentThread,
  selectMessages,
} from '@/store/slices/forumSlice';
import { canManage, displayName, getEntityId, isModerator } from '@/lib/auth';
import { dangerBtnClass, inputClass, primaryBtnClass, secondaryBtnClass } from '@/lib/styles';

export default function ThreadPage() {
  const params = useParams<{ thread: string }>();
  const id = params.thread;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const thread = useAppSelector(selectCurrentThread);
  const messages = useAppSelector(selectMessages) || [];
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [reply, setReply] = useState('');

  useEffect(() => {
    if (!id) return;
    dispatch(fetchThreadById(id));
    dispatch(fetchMessages(id));
  }, [dispatch, id]);

  const handleReply = async (event: FormEvent) => {
    event.preventDefault();
    if (!reply.trim()) return;
    const result = await dispatch(
      createMessage({ threadId: id, messageData: { content: reply.trim() } }),
    );
    if (createMessage.fulfilled.match(result)) {
      setReply('');
    }
  };

  const likedBy = (message: { likedBy?: string[]; likes?: string[] }) =>
    message.likedBy || message.likes || [];

  const moderator = isModerator(user);
  const canDeleteThread = canManage(user, thread?.author);

  return (
    <PageFrame>
      <section className="mx-auto max-w-3xl px-4 py-10">
        {!thread ? (
          <p>{t('auth.loading')}</p>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap gap-2 text-xs">
              {thread.isPinned && (
                <span className="rounded border border-cyan-400 px-2 py-0.5 text-cyan-300">
                  {t('moderation.pinned')}
                </span>
              )}
              {thread.isLocked && (
                <span className="rounded border border-pink-400 px-2 py-0.5 text-pink-300">
                  {t('moderation.locked')}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-cyan-400">{thread.title}</h1>
            <p className="mt-2 text-sm text-gray-400">
              {displayName(thread.author)} · {new Date(thread.createdAt).toLocaleString()}
            </p>
            <div className="mt-6 rounded-lg border border-cyan-800 bg-gray-900 p-4">
              <ContentBody content={thread.content} />
            </div>
            <div className="mt-8 space-y-4">
              {messages.map((message) => {
                const likes = likedBy(message);
                const liked = user
                  ? likes.some((entry) => getEntityId(entry) === user._id)
                  : false;
                return (
                  <div key={message._id} className="rounded-lg border border-cyan-900 bg-gray-800 p-4">
                    <p className="text-sm text-gray-400">
                      {displayName(message.author)} · {new Date(message.createdAt).toLocaleString()}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-cyan-100">{message.content}</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {isAuthenticated && (
                        <button
                          type="button"
                          className="text-sm text-cyan-400 hover:underline"
                          onClick={() => dispatch(likeMessage(message._id))}
                        >
                          {liked ? t('actions.unlike') : t('actions.like')} (
                          {message.likeCount ?? likes.length})
                        </button>
                      )}
                      {canManage(user, message.author) && (
                        <button
                          type="button"
                          className="text-sm text-pink-400 hover:underline"
                          onClick={async () => {
                            if (!window.confirm(t('actions.confirmDelete'))) return;
                            await dispatch(deleteMessage(message._id));
                          }}
                        >
                          {t('actions.delete')}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {isAuthenticated && !thread.isLocked && (
              <form className="mt-8" onSubmit={handleReply}>
                <label className="text-sm text-pink-400">{t('actions.reply')}</label>
                <textarea className={inputClass} value={reply} onChange={(e) => setReply(e.target.value)} />
                <button className={primaryBtnClass} type="submit">
                  {t('actions.reply')}
                </button>
              </form>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/forum" className={secondaryBtnClass}>
                {t('actions.back')}
              </Link>
              {moderator && (
                <>
                  <button
                    type="button"
                    className={secondaryBtnClass}
                    onClick={() =>
                      dispatch(
                        moderateThread({
                          id: thread._id,
                          isPinned: !thread.isPinned,
                        }),
                      )
                    }
                  >
                    {thread.isPinned ? t('moderation.unpin') : t('moderation.pin')}
                  </button>
                  <button
                    type="button"
                    className={secondaryBtnClass}
                    onClick={() =>
                      dispatch(
                        moderateThread({
                          id: thread._id,
                          isLocked: !thread.isLocked,
                        }),
                      )
                    }
                  >
                    {thread.isLocked ? t('moderation.unlock') : t('moderation.lock')}
                  </button>
                </>
              )}
              {canDeleteThread && (
                <button
                  type="button"
                  className={dangerBtnClass}
                  onClick={async () => {
                    if (!window.confirm(t('actions.confirmDelete'))) return;
                    await dispatch(deleteThread(thread._id));
                    router.push('/forum');
                  }}
                >
                  {t('actions.delete')}
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </PageFrame>
  );
}
