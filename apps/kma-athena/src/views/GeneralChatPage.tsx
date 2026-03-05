'use client';

import { ChatPromptInput } from '@/features/chat/ui/ChatPromptInput';
import { ChatWelcomeHero } from '@/features/chat/ui/ChatWelcomeHero';
import { ChatLayout } from '@/widgets/layout/ChatLayout';

export function GeneralChatPage() {
  return (
    <ChatLayout>
      <div className="relative flex h-full">

        <section className="relative z-10 mx-auto flex h-full w-full max-w-[892px] flex-col items-center pt-[220px]">
          <ChatWelcomeHero subtitle="무엇을 도와드릴까요?" />

          <ChatPromptInput />
        </section>
      </div>
    </ChatLayout>
  );
}
