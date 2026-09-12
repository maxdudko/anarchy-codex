import { PaginatedResponse } from '../types';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const AUTH_NO_REFRESH = ['/auth/login', '/auth/register', '/auth/refresh'];

let refreshInFlight: Promise<boolean> | null = null;

function getStoredToken(key: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(key);
}

function setStoredToken(key: string, value: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
}

function clearStoredTokens(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

async function refreshAccessToken(): Promise<boolean> {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    const refreshToken = getStoredToken('refreshToken');
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        clearStoredTokens();
        return false;
      }

      const data = await response.json();
      setStoredToken('accessToken', data.access_token);
      setStoredToken('refreshToken', data.refresh_token);
      return true;
    } catch {
      return false;
    }
  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

export async function readApiError(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const error = await response.json();
    return error.message || fallback;
  } catch {
    return fallback;
  }
}

export function normalizePaginated<T>(json: unknown): PaginatedResponse<T> {
  if (Array.isArray(json)) {
    return {
      data: json as T[],
      total: json.length,
      page: 1,
      limit: json.length || 10,
      totalPages: json.length ? 1 : 0,
    };
  }

  const payload = json as Partial<PaginatedResponse<T>>;
  const data = Array.isArray(payload.data) ? payload.data : [];
  return {
    data,
    total: payload.total ?? data.length,
    page: payload.page ?? 1,
    limit: payload.limit ?? data.length ?? 10,
    totalPages: payload.totalPages ?? (data.length ? 1 : 0),
  };
}

export async function apiFetch(
  path: string,
  init: RequestInit = {},
  retry = true,
): Promise<Response> {
  const headers = new Headers(init.headers);
  const accessToken = getStoredToken('accessToken');

  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  if (
    init.body &&
    !(init.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  const shouldRefresh =
    retry &&
    response.status === 401 &&
    !AUTH_NO_REFRESH.some((prefix) => path.startsWith(prefix));

  if (shouldRefresh) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiFetch(path, init, false);
    }
  }

  return response;
}
