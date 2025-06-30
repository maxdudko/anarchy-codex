import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { News, PaginatedResponse } from '../../types';

// Async thunks
export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async (
    params: {
      page?: number;
      limit?: number;
      published?: boolean;
      tag?: string;
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.published !== undefined)
        searchParams.append('published', params.published.toString());
      if (params.tag) searchParams.append('tag', params.tag);

      const accessToken = localStorage.getItem('accessToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/news?${searchParams}`,
        { headers },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch news');
      }

      const data: PaginatedResponse<News> = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error');
    }
  },
);

export const fetchNewsById = createAsyncThunk(
  'news/fetchNewsById',
  async (id: string, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/news/${id}`,
        { headers },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch news article');
      }

      const data: News = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error');
    }
  },
);

export const createNews = createAsyncThunk(
  'news/createNews',
  async (newsData: Partial<News>, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/news`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(newsData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(
          error.message || 'Failed to create news article',
        );
      }

      const data: News = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error');
    }
  },
);

export const updateNews = createAsyncThunk(
  'news/updateNews',
  async (
    { id, newsData }: { id: string; newsData: Partial<News> },
    { rejectWithValue },
  ) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/news/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(newsData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(
          error.message || 'Failed to update news article',
        );
      }

      const data: News = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error');
    }
  },
);

export const deleteNews = createAsyncThunk(
  'news/deleteNews',
  async (id: string, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/news/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(
          error.message || 'Failed to delete news article',
        );
      }

      return id;
    } catch (error) {
      return rejectWithValue('Network error');
    }
  },
);

// State interface
interface NewsState {
  news: News[];
  currentNews: News | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const initialState: NewsState = {
  news: [],
  currentNews: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

export const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentNews: (state) => {
      state.currentNews = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch news
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch news by ID
    builder
      .addCase(fetchNewsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNews = action.payload;
      })
      .addCase(fetchNewsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create news
    builder
      .addCase(createNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news.unshift(action.payload);
      })
      .addCase(createNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update news
    builder
      .addCase(updateNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNews.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.news.findIndex(
          (news) => news._id === action.payload._id,
        );
        if (index !== -1) {
          state.news[index] = action.payload;
        }
        if (state.currentNews?._id === action.payload._id) {
          state.currentNews = action.payload;
        }
      })
      .addCase(updateNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete news
    builder
      .addCase(deleteNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = state.news.filter((news) => news._id !== action.payload);
        if (state.currentNews?._id === action.payload) {
          state.currentNews = null;
        }
      })
      .addCase(deleteNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { clearError, clearCurrentNews, setLoading } = newsSlice.actions;

// Selectors
export const selectNews = (state: { news: NewsState }) => state.news;
export const selectNewsList = (state: { news: NewsState }) => state.news.news;
export const selectCurrentNews = (state: { news: NewsState }) =>
  state.news.currentNews;
export const selectNewsLoading = (state: { news: NewsState }) =>
  state.news.loading;
export const selectNewsError = (state: { news: NewsState }) => state.news.error;
export const selectNewsPagination = (state: { news: NewsState }) =>
  state.news.pagination;

export default newsSlice.reducer;
