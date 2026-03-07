'use client';

import { useRouter } from 'next/navigation';
import { ChatPromptInput } from '@/features/chat/ui/ChatPromptInput';
import { ChatWelcomeHero } from '@/features/chat/ui/ChatWelcomeHero';
import { ChatLayout } from '@/widgets/layout/ChatLayout';

// 진입 화면에서는 탭 출처만 전달하고, 질문 문자열은 상세 라우트에 넘기지 않습니다.
const CONVERSATION_ROUTE = '/chat/conversation?source=general';

export function GeneralChatPage() {
  const router = useRouter();

  const handleSubmit = (message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    // 첫 전송 시 상세 페이지로만 이동하고, 상세 화면에서 대화 UI를 이어서 처리합니다.
    router.push(CONVERSATION_ROUTE);
  };

  return (
    <ChatLayout>
      <section className="relative z-10 mx-auto flex h-full w-full flex-col">
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-2.5">
          <div className="mx-auto hidden h-full w-full flex-col items-center pt-[220px] md:flex">
            <ChatWelcomeHero subtitle="무엇을 도와드릴까요?" />
            <ChatPromptInput onSubmit={handleSubmit} />
          </div>

          <div className="mx-auto flex h-full w-full flex-col items-center pt-[30px] md:hidden">
            <ChatWelcomeHero subtitle="무엇을 도와드릴까요?" />
          </div>
        </div>

        <div className="px-2.5 pb-5 pt-4 md:hidden">
          <ChatPromptInput onSubmit={handleSubmit} docked />
        </div>
      </section>
    </ChatLayout>
  );
}
