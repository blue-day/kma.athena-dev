'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const LoginForm = dynamic(() => import('@/features/login/ui/LoginForm').then((mod) => mod.LoginForm), {
  ssr: false,
  loading: () => (
    <div
      className="login-loading"
      style={{ padding: '20px', textAlign: 'center' }}
    >
      로그인 양식을 불러오는 중...
    </div>
  ),
});

export function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    //(main) 그룹은 URL에 포함되지 않으므로 /members로 직접 이동
    router.push('/members');
  };

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <div
          className="page-title"
          style={{ marginBottom: '20px', fontSize: '1.5rem', fontWeight: 'bold' }}
        >
          로그인
        </div>
        <div className="login-form-content">
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
        <div
          className="login-footer"
          style={{ marginTop: '24px', opacity: 0.6, fontSize: '0.875rem', textAlign: 'center' }}
        >
          <p>© 2024 KMA. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
