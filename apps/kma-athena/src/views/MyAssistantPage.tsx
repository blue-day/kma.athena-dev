'use client';

import { ChatLayout } from '@/widgets/layout/ChatLayout';

export function MyAssistantPage() {
  return (
    <ChatLayout>
      <div className="flex h-full flex-col p-6">
        <section className="rounded-2xl border border-violet-100 bg-violet-50 p-6">
          <h2 className="text-xl font-bold text-violet-900">나만의 비서 페이지</h2>
          <p className="mt-2 text-sm text-violet-700">
            이 페이지는 탭 이동 예시 화면입니다. 개인화 비서 기능 UI를 이 영역에 구성하면 됩니다.
          </p>
        </section>
      </div>
    </ChatLayout>
  );
}
