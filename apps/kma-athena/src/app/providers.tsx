'use client';

import {
  ApolloClient,
  InMemoryCache,
  ApolloNextAppProvider,
  SSRMultipartLink,
} from '@apollo/client-integration-nextjs';
import { HttpLink, ApolloLink } from '@apollo/client';
import React from 'react';


function makeClient() {
  const uri =
    typeof window === 'undefined'
      ? process.env.API_INTERNAL_URL || 'http://localhost:3002/graphql'
      : process.env.NEXT_PUBLIC_GQL_PATH || '/graphql';

  const httpLink = new HttpLink({ uri });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([new SSRMultipartLink({ stripDefer: true }), httpLink]),
  });
}
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  )
}
