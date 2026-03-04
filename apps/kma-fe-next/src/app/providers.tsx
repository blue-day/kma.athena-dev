'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import { store } from '@/app/providers/storeProvider';
import { initHttp } from '@kma/utils';
import { client as apolloClient, useMenuStore, useAuthSession } from '@kma/comn';
import '@/shared/lib/i18n';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
    const gqlPath = process.env.NEXT_PUBLIC_GQL_PATH || '/graphql';

    // utils 패키지의 http 인스턴스 초기화
    initHttp({
      /**
       * 토큰 추출 소스를 Redux(store)에서 Zustand(useAuthSession)로 변경합니다.
       * Redux는 새로고침 시 초기화될 수 있으나, Zustand는 initialize()를 통해
       * 쿠키에서 세션을 즉시 복구하므로 항상 토큰을 보장할 수 있습니다.
       */
      tokenGetter: () => useAuthSession.getState().token,
      apiBaseUrl,
      gqlPath,
    });

    // 앱 구동 시 쿠키 기반 세션 초기화 실행 (Zustand 데이터 복구)
    useAuthSession.getState().initialize();

    // 초기 메뉴 데이터 로드
    useMenuStore.getState().fetchMenus();
  }, []);

  return (
    <ApolloProvider client={apolloClient as any}>
      <Provider store={store}>{children}</Provider>
    </ApolloProvider>
  );
}
