import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '../../types';
import { apiFetch, normalizePaginated, readApiError } from '../../lib/api';

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
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

      const response = await apiFetch(`/projects?${searchParams}`);

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to fetch projects'),
        );
      }

      return normalizePaginated<Project>(await response.json());
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiFetch(`/projects/${id}`);

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to fetch project'),
        );
      }

      const data: Project = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const createProject = createAsyncThunk(
  'project/createProject',
  async (newsData: Partial<Project>, { rejectWithValue }) => {
    try {
      const response = await apiFetch('/projects', {
        method: 'POST',
        body: JSON.stringify(newsData),
      });

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to create project'),
        );
      }

      const data: Project = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const updateProject = createAsyncThunk(
  'project/updateProject',
  async (
    { id, newsData }: { id: string; newsData: Partial<Project> },
    { rejectWithValue },
  ) => {
    try {
      const response = await apiFetch(`/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(newsData),
      });

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to update project'),
        );
      }

      const data: Project = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const deleteProject = createAsyncThunk(
  'project/deleteProject',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiFetch(`/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to delete project'),
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
interface ProjectState {
  projectList: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const initialState: ProjectState = {
  projectList: [],
  currentProject: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Projects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projectList = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Project by ID
    builder
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Project
    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projectList.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Project
    builder
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projectList.findIndex(
          (news) => news._id === action.payload._id,
        );
        if (index !== -1) {
          state.projectList[index] = action.payload;
        }
        if (state.currentProject?._id === action.payload._id) {
          state.currentProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Project
    builder
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projectList = state.projectList.filter(
          (news) => news._id !== action.payload,
        );
        if (state.currentProject?._id === action.payload) {
          state.currentProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { clearError, clearCurrentProject, setLoading } =
  projectSlice.actions;

// Selectors
export const selectProject = (state: { projects: ProjectState }) =>
  state.projects;
export const selectProjectList = (state: { projects: ProjectState }) =>
  state.projects.projectList;
export const selectCurrentProject = (state: { projects: ProjectState }) =>
  state.projects.currentProject;
export const selectProjectLoading = (state: { projects: ProjectState }) =>
  state.projects.loading;
export const selectProjectError = (state: { projects: ProjectState }) =>
  state.projects.error;
export const selectProjectPagination = (state: { projects: ProjectState }) =>
  state.projects.pagination;

export default projectSlice.reducer;
