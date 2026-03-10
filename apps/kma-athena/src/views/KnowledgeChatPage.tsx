'use client';

import { ChatLayout } from '@/widgets/layout/ChatLayout';

export function KnowledgeChatPage() {
  return (
    <ChatLayout showHelp>
      <section className="relative z-10 mx-auto flex h-full w-full flex-col bg-kma-deco">
      KMA 내부 지식 챗봇  페이지
      </section>
    </ChatLayout>
  );
}
