'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/widgets/Header/Header';
import { Footer } from '@/widgets/Footer/Footer';
import { useAuthSession, useAccessControl } from '@kma/comn';

/**
 * 인증 영역의 최상위 보호 레이아웃입니다
 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn, isInitialized } = useAuthSession();
  const { isAdmin } = useAccessControl();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * 보안 정책에 따른 접근 제어 로직
   */
  useEffect(() => {
    // 마운트와 보안 초기화가 모두 완료된 시점에 권한이 없으면 로그인으로 유도합니다
    if (mounted && isInitialized && !isLoggedIn) {
      router.replace('/auth/login');
    }
  }, [mounted, isInitialized, isLoggedIn, router]);

  // 서버/클라이언트 상태 불일치 방지 및 보안 구성 단계 로딩 처리
  if (!mounted || !isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen font-bold text-gray-400 bg-gray-50">
        보안 환경을 구성 중입니다
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <>
      {isAdmin ? (
        <div className="bg-blue-600 text-white text-center text-xs py-1">
          시스템 관리자 권한으로 접속 중입니다
        </div>
      ) : (
        <div className="bg-green-600 text-white text-center text-xs py-1">사용자 권한으로 접속 중입니다</div>
      )}
      <Header />
      <main style={{ minHeight: 'calc(100vh - 200px)' }}>{children}</main>
      <Footer />
    </>
  );
}
