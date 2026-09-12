'use client';

import { ReactNode } from 'react';
// import { SessionProvider } from 'next-auth/react';
import { StoreProvider } from '@/store/StoreProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    // <SessionProvider>
      <StoreProvider>
        {children}
      </StoreProvider>
    // </SessionProvider>
  );
}
