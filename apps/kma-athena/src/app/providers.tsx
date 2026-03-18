'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { appStore } from './providers/storeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={appStore}>
      {children}
    </Provider>
  )
}
