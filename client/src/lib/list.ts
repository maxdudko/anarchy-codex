'use client';

import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';

export const LIST_PAGE_SIZE = 5;

export function useListFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = Math.max(1, Number(searchParams.get('page') || 1) || 1);
  const tag = searchParams.get('tag') || '';
  const q = searchParams.get('q') || '';

  const setFilters = useCallback(
    (next: { page?: number; tag?: string | null; q?: string }) => {
      const params = new URLSearchParams();
      const nextQ = next.q !== undefined ? next.q : q;
      const nextTag = next.tag !== undefined ? next.tag || '' : tag;
      const resetting = next.tag !== undefined || next.q !== undefined;
      const nextPage = resetting ? 1 : (next.page ?? page);

      if (nextQ.trim()) {
        params.set('q', nextQ.trim());
      }
      if (nextTag.trim()) {
        params.set('tag', nextTag.trim());
      }
      if (nextPage > 1) {
        params.set('page', String(nextPage));
      }

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [page, pathname, q, router, tag],
  );

  return { page, tag, q, setFilters };
}
