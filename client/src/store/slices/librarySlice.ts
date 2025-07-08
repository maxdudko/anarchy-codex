import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LibraryFile, PaginatedResponse } from '../../types';

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
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.publicOnly !== undefined)
        searchParams.append('publicOnly', params.publicOnly.toString());
      if (params.tag) searchParams.append('tag', params.tag);
      if (params.authorId) searchParams.append('authorId', params.authorId);
      if (params.search) searchParams.append('search', params.search);

      const accessToken = localStorage.getItem('accessToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/library?${searchParams}`,
        { headers },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(
          error.message || 'Failed to fetch library files',
        );
      }

      const data: PaginatedResponse<LibraryFile> = await response.json();
      return {
        data,
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages,
      };
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
      const accessToken = localStorage.getItem('accessToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/library/${id}`,
        { headers },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch library file');
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
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/library`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: fileData,
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to upload file');
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
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/library/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(fileData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(
          error.message || 'Failed to update library file',
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
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/library/${id}`,
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
          error.message || 'Failed to delete library file',
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
      const accessToken = localStorage.getItem('accessToken');
      const headers: Record<string, string> = {};

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/library/${id}/download`,
        { headers },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =
        response.headers.get('content-disposition')?.split('filename=')[1] ||
        'download';
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
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
) => state.library.filesList.filter((file) => file.author === authorId);

export default librarySlice.reducer;
