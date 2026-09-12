export interface ListQuery {
  tag?: string;
  search?: string;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function withListFilters(
  base: Record<string, unknown>,
  query: ListQuery | undefined,
  searchFields: string[],
): Record<string, unknown> {
  const filter: Record<string, unknown> = { ...base };
  const tag = query?.tag?.trim();
  const search = query?.search?.trim();

  if (tag) {
    filter.tags = tag;
  }

  if (search && searchFields.length) {
    const searchRegex = new RegExp(escapeRegex(search), 'i');
    filter.$or = searchFields.map((field) => ({ [field]: searchRegex }));
  }

  return filter;
}
