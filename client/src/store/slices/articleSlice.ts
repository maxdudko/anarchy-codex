import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Article } from '../../types';
import { apiFetch, normalizePaginated, readApiError } from '../../lib/api';

// Async thunks
export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (
    params: {
      page?: number;
      limit?: number;
      published?: boolean;
      tag?: string;
      search?: string;
    } | void,
    { rejectWithValue },
  ) => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.published !== undefined)
        searchParams.append('published', params.published.toString());
      if (params?.tag) searchParams.append('tag', params.tag);
      if (params?.search) searchParams.append('search', params.search);

      const response = await apiFetch(`/articles?${searchParams}`);

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to fetch articles'),
        );
      }

      return normalizePaginated<Article>(await response.json());
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const fetchArticleById = createAsyncThunk(
  'articles/fetchArticleById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiFetch(`/articles/${id}`);

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to fetch article'),
        );
      }

      const data: Article = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const createArticle = createAsyncThunk(
  'articles/createArticle',
  async (articlesData: Partial<Article>, { rejectWithValue }) => {
    try {
      const response = await apiFetch('/articles', {
        method: 'POST',
        body: JSON.stringify(articlesData),
      });

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to create article'),
        );
      }

      const data: Article = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const updateArticle = createAsyncThunk(
  'articles/updateArticle',
  async (
    { id, articleData }: { id: string; articleData: Partial<Article> },
    { rejectWithValue },
  ) => {
    try {
      const response = await apiFetch(`/articles/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to update article'),
        );
      }

      const data: Article = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const deleteArticle = createAsyncThunk(
  'articles/deleteArticle',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiFetch(`/articles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to delete article'),
        );
      }

      return id;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

// State interface
interface ArticleState {
  articlesList: Article[];
  currentArticle: Article | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const initialState: ArticleState = {
  articlesList: [],
  currentArticle: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

export const articleSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentArticle: (state) => {
      state.currentArticle = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch articles
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articlesList = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch articles by ID
    builder
      .addCase(fetchArticleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentArticle = action.payload;
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create  article
    builder
      .addCase(createArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.articlesList.unshift(action.payload);
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update  article
    builder
      .addCase(updateArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.articlesList.findIndex(
          (article) => article._id === action.payload._id,
        );
        if (index !== -1) {
          state.articlesList[index] = action.payload;
        }
        if (state.currentArticle?._id === action.payload._id) {
          state.currentArticle = action.payload;
        }
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete  article
    builder
      .addCase(deleteArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.articlesList = state.articlesList.filter(
          (article) => article._id !== action.payload,
        );
        if (state.currentArticle?._id === action.payload) {
          state.currentArticle = null;
        }
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { clearError, clearCurrentArticle, setLoading } =
  articleSlice.actions;

// Selectors
export const selectArticle = (state: { articles: ArticleState }) =>
  state.articles;
export const selectArticleList = (state: { articles: ArticleState }) =>
  state.articles.articlesList;
export const selectCurrentArticle = (state: { articles: ArticleState }) =>
  state.articles.currentArticle;
export const selectArticleLoading = (state: { articles: ArticleState }) =>
  state.articles.loading;
export const selectArticleError = (state: { articles: ArticleState }) =>
  state.articles.error;
export const selectArticlePagination = (state: { articles: ArticleState }) =>
  state.articles.pagination;

export default articleSlice.reducer;
