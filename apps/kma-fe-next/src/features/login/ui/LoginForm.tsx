'use client';

import React, { useState } from 'react';
import { uiError } from '@kma/utils';
import { Button } from '@kma/ui-components';
import { useAuthAction } from '@kma/comn';

/**
 * 사용자로부터 인증 정보를 입력받아 처리하는 클라이언트 전용 폼 컴포넌트입니다.
 * 하위 모듈의 비즈니스 훅을 사용하여 UI와 로직을 철저히 분리했습니다.
 */
export function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  // 복잡한 인증 절차를 캡슐화한 커스텀 훅 사용
  const { login } = useAuthAction();

  // 폼 입력 제어를 위한 로컬 상태 관리 (초기값은 개발 편의를 위한 기본값 설정)
  const [id, setId] = useState('admin');
  const [pw, setPw] = useState('admin!');

  // 비동기 통신 중 중복 요청 방지를 위한 상태 플래그
  const [loading, setLoading] = useState(false);

  /**
   * 폼 제출 이벤트를 가로채어 인증 트랜잭션을 실행합니다.
   */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); // 브라우저 기본 제출 동작 차단

    try {
      setLoading(true);
      // 복잡한 상태 변경 로직을 직접 처리하지 않고 추상화된 login 액션에 위임
      await login(id, pw);

      // 인증 성공 시 부모 컨테이너가 정의한 후속 흐름(예: 페이지 이동) 실행
      onSuccess();
    } catch (err: any) {
      // API 응답 에러 및 네트워크 예외 상황을 공통 유틸리티를 통해 사용자에게 통지
      uiError('로그인 실패', err?.message ?? '오류가 발생했습니다.');
    } finally {
      // 트랜잭션 종료 후 입력 활성화를 위한 로딩 상태 해제
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <label className="label">ID</label>
      <input
        className="input"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <label
        className="label"
        style={{ marginTop: 10 }}
      >
        PW
      </label>
      <input
        className="input"
        type="password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
      />

      <div
        className="toolbar"
        style={{ marginTop: 12 }}
      >
        {/* 통신 상태에 따른 버튼 비활성화 및 레이블 동적 변경으로 UX 최적화 */}
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? '로그인 중...' : '로그인'}
        </Button>
      </div>
    </form>
  );
}
