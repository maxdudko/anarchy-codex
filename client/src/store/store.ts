import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import articleReducer from './slices/articleSlice';
import projectReducer from './slices/projectSlice';
import eventsReducer from './slices/eventsSlice';
import libraryReducer from './slices/librarySlice';
import forumReducer from './slices/forumSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    articles: articleReducer,
    projects: projectReducer,
    events: eventsReducer,
    library: libraryReducer,
    forum: forumReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
