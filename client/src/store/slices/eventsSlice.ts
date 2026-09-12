import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Event } from '../../types';
import { apiFetch, normalizePaginated, readApiError } from '../../lib/api';

// Async thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (
    params: {
      page?: number;
      limit?: number;
      publicOnly?: boolean;
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
      if (params?.search) searchParams.append('search', params.search);

      const response = await apiFetch(`/events?${searchParams}`);

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to fetch events'),
        );
      }

      return normalizePaginated<Event>(await response.json());
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiFetch(`/events/${id}`);

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to fetch event'),
        );
      }

      const data: Event = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData: Partial<Event>, { rejectWithValue }) => {
    try {
      const response = await apiFetch('/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to create event'),
        );
      }

      const data: Event = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async (
    { id, eventData }: { id: string; eventData: Partial<Event> },
    { rejectWithValue },
  ) => {
    try {
      const response = await apiFetch(`/events/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to update event'),
        );
      }

      const data: Event = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiFetch(`/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to delete event'),
        );
      }

      return id;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const joinEvent = createAsyncThunk(
  'events/joinEvent',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiFetch(`/events/${id}/join`, {
        method: 'POST',
      });

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to join event'),
        );
      }

      const data: Event = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

export const leaveEvent = createAsyncThunk(
  'events/leaveEvent',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiFetch(`/events/${id}/leave`, {
        method: 'POST',
      });

      if (!response.ok) {
        return rejectWithValue(
          await readApiError(response, 'Failed to leave event'),
        );
      }

      const data: Event = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return rejectWithValue('Network error');
    }
  },
);

// State interface
interface EventsState {
  eventsList: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const initialState: EventsState = {
  eventsList: [],
  currentEvent: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch events
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.eventsList = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch event by ID
    builder
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create event
    builder
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.eventsList.unshift(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update event
    builder
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.eventsList.findIndex(
          (event) => event._id === action.payload._id,
        );
        if (index !== -1) {
          state.eventsList[index] = action.payload;
        }
        if (state.currentEvent?._id === action.payload._id) {
          state.currentEvent = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete event
    builder
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.eventsList = state.eventsList.filter(
          (event) => event._id !== action.payload,
        );
        if (state.currentEvent?._id === action.payload) {
          state.currentEvent = null;
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Join event
    builder
      .addCase(joinEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.eventsList.findIndex(
          (event) => event._id === action.payload._id,
        );
        if (index !== -1) {
          state.eventsList[index] = action.payload;
        }
        if (state.currentEvent?._id === action.payload._id) {
          state.currentEvent = action.payload;
        }
      })
      .addCase(joinEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Leave event
    builder
      .addCase(leaveEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.eventsList.findIndex(
          (event) => event._id === action.payload._id,
        );
        if (index !== -1) {
          state.eventsList[index] = action.payload;
        }
        if (state.currentEvent?._id === action.payload._id) {
          state.currentEvent = action.payload;
        }
      })
      .addCase(leaveEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { clearError, clearCurrentEvent, setLoading } =
  eventsSlice.actions;

// Selectors
export const selectEvents = (state: { events: EventsState }) => state.events;
export const selectEventsList = (state: { events: EventsState }) =>
  state.events.eventsList;
export const selectCurrentEvent = (state: { events: EventsState }) =>
  state.events.currentEvent;
export const selectEventsLoading = (state: { events: EventsState }) =>
  state.events.loading;
export const selectEventsError = (state: { events: EventsState }) =>
  state.events.error;
export const selectEventsPagination = (state: { events: EventsState }) =>
  state.events.pagination;

// Helper selectors
export const selectPublicEvents = (state: { events: EventsState }) =>
  state.events.eventsList.filter((event) => event.isPublic);

export const selectUpcomingEvents = (state: { events: EventsState }) =>
  state.events.eventsList.filter(
    (event) => new Date(event.startDate) > new Date(),
  );

export default eventsSlice.reducer;
