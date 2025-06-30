import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole } from '../../types';

// Async thunks
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/users`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch users');
      }

      const data: User[] = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error');
    }
  },
);

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (id: string, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch user');
      }

      const data: User = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error');
    }
  },
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData: Partial<User>, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/users/profile`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(profileData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to update profile');
      }

      const data: User = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error');
    }
  },
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (
    { id, userData }: { id: string; userData: Partial<User> },
    { rejectWithValue },
  ) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/users/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(userData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to update user');
      }

      const data: User = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue('Network error');
    }
  },
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/users/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to delete user');
      }

      return id;
    } catch (error) {
      return rejectWithValue('Network error');
    }
  },
);

// State interface
interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateUserInList: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(
        (user) => user._id === action.payload._id,
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
    removeUserFromList: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch user by ID
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        // Update user in list if exists
        const index = state.users.findIndex(
          (user) => user._id === action.payload._id,
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update user
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user._id === action.payload._id,
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser?._id === action.payload._id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete user
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
        if (state.currentUser?._id === action.payload) {
          state.currentUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const {
  clearError,
  clearCurrentUser,
  setLoading,
  updateUserInList,
  removeUserFromList,
} = userSlice.actions;

// Selectors
export const selectUser = (state: { user: UserState }) => state.user;
export const selectUsers = (state: { user: UserState }) => state.user.users;
export const selectCurrentUser = (state: { user: UserState }) =>
  state.user.currentUser;
export const selectUserLoading = (state: { user: UserState }) =>
  state.user.loading;
export const selectUserError = (state: { user: UserState }) => state.user.error;

// Helper selectors
export const selectUsersByRole = (state: { user: UserState }, role: UserRole) =>
  state.user.users.filter((user) => user.roles.includes(role));

export const selectActiveUsers = (state: { user: UserState }) =>
  state.user.users.filter((user) => user.isActive);

export default userSlice.reducer;
