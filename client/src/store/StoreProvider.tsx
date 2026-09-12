'use client';

import { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch } from './hooks';
import { getCurrentUser, hydrate } from './slices/authSlice';

function AuthSession({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrate());
    if (typeof window !== 'undefined' && localStorage.getItem('accessToken')) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return <>{children}</>;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthSession>{children}</AuthSession>
    </Provider>
  );
}
