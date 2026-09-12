'use client';

import { isHtmlContent, sanitizeHtml } from '@/lib/html';

export default function ContentBody({ content }: { content?: string }) {
  if (!content) {
    return null;
  }

  if (isHtmlContent(content)) {
    return (
      <div
        className="content-body space-y-3 leading-relaxed text-cyan-100"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
      />
    );
  }

  return (
    <p className="whitespace-pre-wrap leading-relaxed text-cyan-100">{content}</p>
  );
}
