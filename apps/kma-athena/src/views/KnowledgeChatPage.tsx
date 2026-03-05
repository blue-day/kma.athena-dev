'use client';

import { ChatLayout } from '@/widgets/layout/ChatLayout';

export function KnowledgeChatPage() {
  return (
    <ChatLayout>
      <div className="flex h-full flex-col p-6">
        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <h2 className="text-xl font-bold text-blue-900">사내 지식 챗봇 페이지</h2>
          <p className="mt-2 text-sm text-blue-700">
            이 페이지는 탭 이동 예시 화면입니다. 사내 문서 기반 질의응답 UI를 이 영역에 구성하면 됩니다.
          </p>
        </section>
      </div>
    </ChatLayout>
  );
}
