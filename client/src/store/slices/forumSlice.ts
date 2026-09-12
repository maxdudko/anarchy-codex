import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Thread, Message } from '../../types';
import { apiFetch, normalizePaginated, readApiError } from '../../lib/api';

// Async thunks
export const fetchThreads = createAsyncThunk(
  'forum/fetchThreads',
  async (
    params: { page?: number; limit?: number; sort?: string } | void,
    { rejectWithValue },
  ) => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.sort) searchParams.append('sort', params.sort);

      const response = await apiFetch(`/forum/threads?${searchParams}`);

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to fetch threads'),
        );
      }

      return normalizePaginated<Thread>(await response.json());
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const fetchThreadById = createAsyncThunk(
  'forum/fetchThreadById',
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
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/forum/threads/${id}`,
        { headers },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch thread');
      }

      const data: Thread = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const createThread = createAsyncThunk(
  'forum/createThread',
  async (threadData: Partial<Thread>, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/forum/threads`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(threadData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to create thread');
      }

      const data: Thread = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const updateThread = createAsyncThunk(
  'forum/updateThread',
  async (
    { id, threadData }: { id: string; threadData: Partial<Thread> },
    { rejectWithValue },
  ) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/forum/threads/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(threadData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to update thread');
      }

      const data: Thread = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const deleteThread = createAsyncThunk(
  'forum/deleteThread',
  async (id: string, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/forum/threads/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to delete thread');
      }

      return id;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const fetchMessages = createAsyncThunk(
  'forum/fetchMessages',
  async (threadId: string, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/forum/threads/${threadId}/messages`,
        { headers },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to fetch messages');
      }

      const data: Message[] = await response.json();
      return { threadId, messages: data };
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const createMessage = createAsyncThunk(
  'forum/createMessage',
  async (
    {
      threadId,
      messageData,
    }: { threadId: string; messageData: Partial<Message> },
    { rejectWithValue },
  ) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/forum/threads/${threadId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(messageData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to create message');
      }

      const data: Message = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const updateMessage = createAsyncThunk(
  'forum/updateMessage',
  async (
    { id, messageData }: { id: string; messageData: Partial<Message> },
    { rejectWithValue },
  ) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/forum/messages/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(messageData),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to update message');
      }

      const data: Message = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const deleteMessage = createAsyncThunk(
  'forum/deleteMessage',
  async (id: string, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/forum/messages/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to delete message');
      }

      return id;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const likeMessage = createAsyncThunk(
  'forum/likeMessage',
  async (id: string, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return rejectWithValue('Authentication required');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/forum/messages/${id}/like`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Failed to like message');
      }

      const data: Message = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

// State interface
interface ForumState {
  threads: Thread[];
  currentThread: Thread | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const initialState: ForumState = {
  threads: [],
  currentThread: null,
  messages: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

export const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentThread: (state) => {
      state.currentThread = null;
      state.messages = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch threads
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.loading = false;
        state.threads = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch thread by ID
    builder
      .addCase(fetchThreadById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreadById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentThread = action.payload;
      })
      .addCase(fetchThreadById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create thread
    builder
      .addCase(createThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.loading = false;
        state.threads.unshift(action.payload);
      })
      .addCase(createThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update thread
    builder
      .addCase(updateThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateThread.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.threads.findIndex(
          (thread) => thread._id === action.payload._id,
        );
        if (index !== -1) {
          state.threads[index] = action.payload;
        }
        if (state.currentThread?._id === action.payload._id) {
          state.currentThread = action.payload;
        }
      })
      .addCase(updateThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete thread
    builder
      .addCase(deleteThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteThread.fulfilled, (state, action) => {
        state.loading = false;
        state.threads = state.threads.filter(
          (thread) => thread._id !== action.payload,
        );
        if (state.currentThread?._id === action.payload) {
          state.currentThread = null;
          state.messages = [];
        }
      })
      .addCase(deleteThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch messages
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create message
    builder
      .addCase(createMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
        if (state.currentThread) {
          state.currentThread.messageCount += 1;
          state.currentThread.lastActivityAt = action.payload.createdAt;
        }
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update message
    builder
      .addCase(updateMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMessage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.messages.findIndex(
          (message) => message._id === action.payload._id,
        );
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      })
      .addCase(updateMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete message
    builder
      .addCase(deleteMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = state.messages.filter(
          (message) => message._id !== action.payload,
        );
        if (state.currentThread) {
          state.currentThread.messageCount = Math.max(
            0,
            state.currentThread.messageCount - 1,
          );
        }
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Like message
    builder
      .addCase(likeMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likeMessage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.messages.findIndex(
          (message) => message._id === action.payload._id,
        );
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      })
      .addCase(likeMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { clearError, clearCurrentThread, setLoading } =
  forumSlice.actions;

// Selectors
export const selectForum = (state: { forum: ForumState }) => state.forum;
export const selectThreads = (state: { forum: ForumState }) =>
  state.forum.threads;
export const selectCurrentThread = (state: { forum: ForumState }) =>
  state.forum.currentThread;
export const selectMessages = (state: { forum: ForumState }) =>
  state.forum.messages;
export const selectForumLoading = (state: { forum: ForumState }) =>
  state.forum.loading;
export const selectForumError = (state: { forum: ForumState }) =>
  state.forum.error;
export const selectForumPagination = (state: { forum: ForumState }) =>
  state.forum.pagination;

// Helper selectors
export const selectPinnedThreads = (state: { forum: ForumState }) =>
  state.forum.threads.filter((thread) => thread.isPinned);

export const selectActiveThreads = (state: { forum: ForumState }) =>
  state.forum.threads.filter((thread) => !thread.isLocked);

export const selectMessagesByThread = (
  state: { forum: ForumState },
  threadId: string,
) => state.forum.messages.filter((message) => message.thread === threadId);

export default forumSlice.reducer;
