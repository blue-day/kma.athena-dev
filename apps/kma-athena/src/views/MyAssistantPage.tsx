'use client';

import { ChatLayout } from '@/widgets/layout/ChatLayout';
import { ChatWelcomeHero } from '@/features/chat/ui/ChatWelcomeHero';

export function MyAssistantPage() {
  return (
    <ChatLayout showHelp>
      <section className="relative z-10 mx-auto flex h-full w-full flex-col bg-kma-deco">
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 md:px-2.5">
          <div className="flex flex-col items-center pt-[30px] md:pt-[220px] pb-10 md:px-10">
            <ChatWelcomeHero subtitle="참고할 자료를 업로드하고 AI 역할을 설정하면 나만의 비서가 됩니다." />
          </div>
        </div>
      </section>
    </ChatLayout>
  );
}
