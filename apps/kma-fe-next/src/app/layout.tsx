'use client'; // 클라이언트 사이드 전용 상태 및 효과 사용 명시

import React, { useEffect } from 'react';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { useAuthSession } from '@kma/comn'; // 공통 인증 스토어 임포트
import './globals.css';

// Kendo UI 기본 테마 추가
import '@progress/kendo-theme-default/dist/all.css';

// 통합 UI 시스템의 표준 스타일 가이드 적용
import '@kma/ui-components/styles/kma-base.css';
import '@kma/ui-components/styles/kma-layout.css';
import '@kma/ui-components/styles/kma-common.css';
import '@kma/ui-components/styles/kma-widgets.css';
import '@kma/ui-components/styles/kma-member.css';

/**
 * 전체 애플리케이션의 공통 골격을 정의하는 최상위 레이아웃 컴포넌트입니다.
 * 인증 세션 초기화와 전역 프로바이더 구성을 담당합니다.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 전역 스토어에서 세션 복구 함수 추출
  const { initialize } = useAuthSession();

  /**
   * 브라우저 환경에서 컴포넌트가 마운트되는 즉시 실행됩니다.
   * 새로고침 발생 시 소멸된 유저 정보를 복구하기 위한 트리거 역할을 합니다.
   */
  useEffect(() => {
    // 앱 구동 시 단 한 번 세션 복구 로직을 수행합니다.
    initialize();
  }, [initialize]);

  return (
    <html lang="ko">
      <head>
        <title>KMA Portal (Next)</title>
      </head>
      <body>
        {/* 상태 관리 및 테마 설정을 포함한 전역 컨텍스트 주입 */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
