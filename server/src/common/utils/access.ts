import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';

export function isModerator(roles?: string[]): boolean {
  return Boolean(
    roles?.includes(UserRole.MODERATOR) || roles?.includes(UserRole.ADMIN),
  );
}

export function ownerId(value: { toString(): string } | string): string {
  return value?.toString?.() ?? String(value);
}

export function assertOwnerOrModerator(
  owner: { toString(): string } | string,
  userId: string,
  roles?: string[],
  message = 'You can only modify your own content',
): void {
  if (ownerId(owner) === userId || isModerator(roles)) {
    return;
  }
  throw new ForbiddenException(message);
}
