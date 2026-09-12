import { User, UserRole } from '../types';

export function getEntityId(
  value?: string | { _id?: string } | null,
): string {
  if (!value) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  return value._id || '';
}

export function displayName(
  value?: string | { pseudonym?: string } | null,
): string {
  if (!value) {
    return 'Anonymous';
  }
  if (typeof value === 'string') {
    return value;
  }
  return value.pseudonym || 'Anonymous';
}

export function isOwner(
  user: User | null | undefined,
  author?: string | { _id?: string } | null,
): boolean {
  if (!user) {
    return false;
  }
  return user._id === getEntityId(author);
}

export function isModerator(user: User | null | undefined): boolean {
  return Boolean(
    user?.roles?.includes(UserRole.MODERATOR) ||
      user?.roles?.includes(UserRole.ADMIN),
  );
}

export function canManage(
  user: User | null | undefined,
  author?: string | { _id?: string } | null,
): boolean {
  return isOwner(user, author) || isModerator(user);
}

export function parseTags(value: string): string[] {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function htmlToText(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function toDatetimeLocal(value?: string): string {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
