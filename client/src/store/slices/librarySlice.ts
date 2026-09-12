import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LibraryFile } from '../../types';
import { apiFetch, normalizePaginated, readApiError } from '../../lib/api';
import { getEntityId } from '../../lib/auth';

// Async thunks
export const fetchLibraryFiles = createAsyncThunk(
  'library/fetchLibraryFiles',
  async (
    params: {
      page?: number;
      limit?: number;
      publicOnly?: boolean;
      tag?: string;
      authorId?: string;
      search?: string;
    } | void,
    { rejectWithValue },
  ) => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.publicOnly !== undefined)
        searchParams.append('publicOnly', params.publicOnly.toString());
      if (params?.tag) searchParams.append('tag', params.tag);
      if (params?.authorId) searchParams.append('authorId', params.authorId);
      if (params?.search) searchParams.append('search', params.search);

      const response = await apiFetch(`/library?${searchParams}`);

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to fetch library files'),
        );
      }

      return normalizePaginated<LibraryFile>(await response.json());
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const fetchLibraryFileById = createAsyncThunk(
  'library/fetchLibraryFileById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiFetch(`/library/${id}`);

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to fetch library file'),
        );
      }

      const data: LibraryFile = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const uploadFile = createAsyncThunk(
  'library/uploadFile',
  async (fileData: FormData, { rejectWithValue }) => {
    try {
      const response = await apiFetch('/library', {
        method: 'POST',
        body: fileData,
      });

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to upload file'),
        );
      }

      const data: LibraryFile = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const updateLibraryFile = createAsyncThunk(
  'library/updateLibraryFile',
  async (
    { id, fileData }: { id: string; fileData: Partial<LibraryFile> },
    { rejectWithValue },
  ) => {
    try {
      const response = await apiFetch(`/library/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(fileData),
      });

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to update library file'),
        );
      }

      const data: LibraryFile = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const deleteLibraryFile = createAsyncThunk(
  'library/deleteLibraryFile',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiFetch(`/library/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to delete library file'),
        );
      }

      return id;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const downloadFile = createAsyncThunk(
  'library/downloadFile',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiFetch(`/library/${id}/download`);

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to download file'),
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const disposition = response.headers.get('content-disposition') || '';
      const utfName = disposition.match(/filename\*=UTF-8''([^;]+)/i);
      const quotedName = disposition.match(/filename="([^"]+)"/i);
      const plainName = disposition.match(/filename=([^;]+)/i);
      a.download = decodeURIComponent(
        utfName?.[1] ||
          quotedName?.[1] ||
          plainName?.[1]?.replace(/["']/g, '').trim() ||
          'download',
      );
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return id;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

// State interface
interface LibraryState {
  filesList: LibraryFile[];
  currentFile: LibraryFile | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const initialState: LibraryState = {
  filesList: [],
  currentFile: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

export const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentFile: (state) => {
      state.currentFile = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch library files
    builder
      .addCase(fetchLibraryFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLibraryFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.filesList = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchLibraryFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch library file by ID
    builder
      .addCase(fetchLibraryFileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLibraryFileById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFile = action.payload;
      })
      .addCase(fetchLibraryFileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Upload file
    builder
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.filesList.unshift(action.payload);
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update library file
    builder
      .addCase(updateLibraryFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLibraryFile.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.filesList.findIndex(
          (file) => file._id === action.payload._id,
        );
        if (index !== -1) {
          state.filesList[index] = action.payload;
        }
        if (state.currentFile?._id === action.payload._id) {
          state.currentFile = action.payload;
        }
      })
      .addCase(updateLibraryFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete library file
    builder
      .addCase(deleteLibraryFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLibraryFile.fulfilled, (state, action) => {
        state.loading = false;
        state.filesList = state.filesList.filter(
          (file) => file._id !== action.payload,
        );
        if (state.currentFile?._id === action.payload) {
          state.currentFile = null;
        }
      })
      .addCase(deleteLibraryFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Download file
    builder
      .addCase(downloadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadFile.fulfilled, (state, action) => {
        state.loading = false;
        // Update download count in the file list
        const index = state.filesList.findIndex(
          (file) => file._id === action.payload,
        );
        if (index !== -1) {
          state.filesList[index].downloadCount += 1;
        }
        if (state.currentFile?._id === action.payload) {
          state.currentFile.downloadCount += 1;
        }
      })
      .addCase(downloadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { clearError, clearCurrentFile, setLoading } =
  librarySlice.actions;

// Selectors
export const selectLibrary = (state: { library: LibraryState }) =>
  state.library;
export const selectLibraryFiles = (state: { library: LibraryState }) =>
  state.library.filesList;
export const selectCurrentLibraryFile = (state: { library: LibraryState }) =>
  state.library.currentFile;
export const selectLibraryLoading = (state: { library: LibraryState }) =>
  state.library.loading;
export const selectLibraryError = (state: { library: LibraryState }) =>
  state.library.error;
export const selectLibraryPagination = (state: { library: LibraryState }) =>
  state.library.pagination;

// Helper selectors
export const selectPublicLibraryFiles = (state: { library: LibraryState }) =>
  state.library.filesList.filter((file) => file.isPublic);

export const selectLibraryFilesByTag = (
  state: { library: LibraryState },
  tag: string,
) => state.library.filesList.filter((file) => file.tags.includes(tag));

export const selectLibraryFilesByAuthor = (
  state: { library: LibraryState },
  authorId: string,
) =>
  state.library.filesList.filter(
    (file) => getEntityId(file.author) === authorId,
  );

export default librarySlice.reducer;
