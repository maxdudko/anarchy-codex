'use client';

import { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { hydrate } from './slices/authSlice';

function HydrateAuth({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Hydrate auth state from localStorage on client mount
    store.dispatch(hydrate());
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <HydrateAuth>{children}</HydrateAuth>
    </Provider>
  );
}
