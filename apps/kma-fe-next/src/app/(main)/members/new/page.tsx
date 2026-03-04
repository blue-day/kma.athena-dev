import { Suspense } from 'react';
import { MemberCreatePage } from '@/views/members/MemberCreatePage';

/**
 * Route Segment Config는 서버 컴포넌트에서 export 해야 빌드 오류가 발생하지 않습니다.
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  return (
    // MemberCreatePage 내부에서 useSearchParams를 사용하므로 Suspense가 반드시 필요합니다.
    <Suspense fallback={<div className="kma-loading">회원 등록 페이지 로딩 중...</div>}>
      <MemberCreatePage />
    </Suspense>
  );
}
