'use client';

import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';

type IntlMessages = {
  [key: string]: string | IntlMessages;
};

interface IntlProviderProps {
  children: ReactNode;
  locale: string;
  messages: IntlMessages;
}

export function IntlProvider({ children, locale, messages }: IntlProviderProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
