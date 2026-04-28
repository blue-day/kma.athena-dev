'use client';

import { useRouter } from 'next/navigation';
import { ChatPromptInput } from '@/features/chat/ui/ChatPromptInput';
import { ChatWelcomeHero } from '@/features/chat/ui/ChatWelcomeHero';
import { buildConversationRoute } from '@/entities/chat/lib/chatNavigation';
import { generateSessionId } from '@/entities/chat/lib/chatUtil';

// 진입 화면에서는 탭 출처만 전달하고, 질문 문자열은 상세 라우트에 넘기지 않습니다.

export function GeneralChatPage() {
  const router = useRouter();

  const handleSubmit = (message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    const conversationId = generateSessionId()

    // 첫 전송 시 상세 페이지로만 이동하고, 상세 화면에서 대화 UI를 이어서 처리합니다.
    router.push(buildConversationRoute(conversationId, 'general'));
  };

  return (
    <section className="relative z-10 mx-auto flex h-full w-full flex-col bg-kma-deco">
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 md:px-2.5">
        <div className="flex mx-auto h-full w-full flex-col items-center pt-[100px] md:pt-[220px] md:flex">
          <ChatWelcomeHero subtitle="무엇을 도와드릴까요?" />
          <ChatPromptInput onSubmit={handleSubmit} />
        </div>

        {/* <div className="mx-auto flex h-full w-full flex-col items-center pt-[30px] md:hidden">
            <ChatWelcomeHero subtitle="무엇을 도와드릴까요?" />
          </div> */}
      </div>

      {/* <div className="px-4 pb-2.5 pt-4 md:hidden">
          <ChatPromptInput onSubmit={handleSubmit} docked />
        </div> */}
    </section>
  );
}
