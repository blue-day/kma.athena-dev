'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// ssr: false 설정을 통해 브라우저 환경에서만 렌더링하도록 합니다.
const MembersListPage = dynamic(
  () => import('@/views/members/MembersListPage').then((mod) => mod.MembersListPage),
  { ssr: false },
);

export default function Page() {
  return (
    // useSearchParams를 사용하는 컴포넌트는 반드시 Suspense로 감싸야 빌드 오류를 방지할 수 있습니다.
    <Suspense fallback={<div>Loading...</div>}>
      <MembersListPage />
    </Suspense>
  );
}
