'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

/**
 * 공통코드 마스터-디테일 페이지 라우트 엔트리
 * 회원 목록 페이지의 구성을 참조하여 브라우저 환경 전용(ssr: false)으로 렌더링합니다.
 */
const CommonCodePage = dynamic(
  () => import('@/views/system/CommonCodePage').then((mod) => mod.CommonCodePage),
  { ssr: false },
);

export default function Page() {
  return (
    /**
     * CommonCodePage 내부에서 useSearchParams를 사용하여 URL 필터를 동기화하므로
     * 반드시 Suspense로 감싸야 빌드 오류를 방지할 수 있습니다.
     */
    <Suspense fallback={<div className="kma-loading">공통코드 관리 페이지 로딩 중...</div>}>
      <CommonCodePage />
    </Suspense>
  );
}
