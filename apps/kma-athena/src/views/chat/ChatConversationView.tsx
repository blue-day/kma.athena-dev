'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ChatMessage } from '@/features/chat/model/conversation';
import { AssistantAnswerCard } from '@/features/chat/ui/AssistantAnswerCard';
import { ChatPromptInput } from '@/features/chat/ui/ChatPromptInput';
import { ChatWelcomeHero } from '@/features/chat/ui/ChatWelcomeHero';
import { ConversationSummaryHeader } from '@/features/chat/ui/ConversationSummaryHeader';
import { MaterialPanel } from '@/features/chat/ui/MaterialPanel';
import { ChatLayout } from '@/widgets/layout/ChatLayout';

interface ChatConversationViewProps {
  mode: 'new' | 'history';
  initialMessages?: string[];
}

const DEFAULT_USER_QUESTION = '성분명 처방에 대한 협회의 공식 입장은 어때?';

const DEFAULT_ASSISTANT_MESSAGE: Omit<ChatMessage, 'id'> = {
  role: 'assistant',
  text: `대한의사협회는 2025년 5월 29일 성분명처방 관련 입장을 제시했습니다.
현행 처방체계를 유지하면서도 환자 안전과 진료 연속성을 우선해야 하며, 준비 없는 제도 전환은 신중해야 한다는 내용입니다.
또한 불가피한 변경이 필요할 경우 의료현장과 환자단체의 충분한 협의가 선행돼야 한다고 강조했습니다.`,
  links: [
    {
      id: 'kma-official-1',
      label: '보도자료 바로가기',
      href: '#',
    },
    {
      id: 'kma-official-2',
      label: '노무근거자료',
      href: '#',
    },
  ],
  recommendations: [
    '성분명 처방 관련된 현행 의견',
    '성분명 반대',
    '외국에서 성분명 처방이 어떻게 하고 있나요?',
  ],
};

const createMessageId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const createAssistantMessage = (): ChatMessage => ({
  id: createMessageId(),
  ...DEFAULT_ASSISTANT_MESSAGE,
});

const createUserMessage = (text: string): ChatMessage => ({
  id: createMessageId(),
  role: 'user',
  text,
});

const getInitialConversationMessages = (
  mode: 'new' | 'history',
  initialMessages: string[],
): ChatMessage[] => {
  if (mode === 'new' && initialMessages.length === 0) {
    return [];
  }

  const firstQuestion = initialMessages[0]?.trim() || DEFAULT_USER_QUESTION;
  return [createUserMessage(firstQuestion), createAssistantMessage()];
};

export function ChatConversationView({
  mode,
  initialMessages = [],
}: ChatConversationViewProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(
    getInitialConversationMessages(mode, initialMessages),
  );
  const [isConversationStarted, setIsConversationStarted] = useState(
    mode === 'history' || initialMessages.length > 0,
  );
  const [isMaterialOpen, setIsMaterialOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigationTimerRef = useRef<number | null>(null);

  const handleSubmit = (message: string) => {
    const userMessage = createUserMessage(message);
    const assistantMessage = createAssistantMessage();
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsConversationStarted(true);

    // 새 채팅 첫 전송 시 정적 대화 화면 라우트로 전환합니다.
    if (mode === 'new' && !isConversationStarted) {
      navigationTimerRef.current = window.setTimeout(() => {
        router.replace('/chat/conversation');
      }, 220);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container || messages.length === 0) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (navigationTimerRef.current !== null) {
        window.clearTimeout(navigationTimerRef.current);
      }
    };
  }, []);

  const shouldShowWelcome = mode === 'new' && !isConversationStarted;
  const shouldShowDesktopDockedInput =
    mode === 'history' || isConversationStarted;
  const shouldAnimateDesktopDock =
    mode === 'new' && isConversationStarted && messages.length > 0;
  const summaryTitle = useMemo(() => {
    const firstUserMessage = messages.find((message) => message.role === 'user');
    return firstUserMessage?.text || DEFAULT_USER_QUESTION;
  }, [messages]);

  return (
    <ChatLayout>
      <div className="relative flex h-full">
        <section className="relative z-10 mx-auto flex h-full w-full flex-col">
          {isConversationStarted && (
            <ConversationSummaryHeader
              summary={{
                category: '협회자료 검색',
                title: summaryTitle,
              }}
            />
          )}

          <div
            ref={scrollContainerRef}
            className={`custom-scrollbar min-h-0 flex-1 overflow-y-auto px-2.5 ${
              isConversationStarted ? 'pt-6' : ''
            }`}
          >
            {shouldShowWelcome ? (
              <>
                {/* 입력 전(PC): 기존과 동일하게 중앙 입력창을 노출합니다. */}
                <div className="mx-auto hidden h-full w-full flex-col items-center pt-[220px] md:flex">
                  <ChatWelcomeHero subtitle="무엇을 도와드릴까요?" />
                  <ChatPromptInput onSubmit={handleSubmit} />
                </div>

                {/* 입력 전(모바일): 입력창은 하단 고정이므로 웰컴 영역만 표시합니다. */}
                <div className="mx-auto flex h-full w-full flex-col items-center pt-[30px] md:hidden">
                  <ChatWelcomeHero subtitle="무엇을 도와드릴까요?" />
                </div>
              </>
            ) : (
              <div className="mx-auto flex w-full max-w-[860px] flex-col gap-4 pb-6 pt-2">
                {messages.map((message) =>
                  message.role === 'user' ? (
                    <div
                      key={message.id}
                      className="chat-message-rise ml-auto max-w-[80%] rounded-2xl bg-[#eef3ff] px-4 py-3 text-sm text-[#1f2937]"
                    >
                      {message.text}
                    </div>
                  ) : (
                    <AssistantAnswerCard
                      key={message.id}
                      content={message.text}
                      links={message.links ?? []}
                      recommendations={message.recommendations ?? []}
                      onSelectRecommendation={handleSubmit}
                      onOpenMaterialPanel={() => setIsMaterialOpen(true)}
                    />
                  ),
                )}
              </div>
            )}
          </div>

          {/* 모바일은 입력 전/후 모두 하단 고정 입력창을 사용합니다. */}
          <div className="pb-5 pt-4 md:hidden px-2.5">
            <ChatPromptInput onSubmit={handleSubmit} docked />
          </div>

          {shouldShowDesktopDockedInput && (
            <div
              className={`hidden pb-5 pt-4 md:block px-2.5 ${
                shouldAnimateDesktopDock ? 'chat-input-dock-enter' : ''
              }`}
            >
              <ChatPromptInput onSubmit={handleSubmit} docked />
            </div>
          )}
        </section>

        <aside
          className={`hidden md:block flex-shrink-0 border-l border-gray-100 bg-gray-50 overflow-y-auto transition-all duration-300 ${
            isMaterialOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'
          }`}
          aria-hidden={!isMaterialOpen}
        >
          <MaterialPanel onClose={() => setIsMaterialOpen(false)} />
        </aside>
      </div>
    </ChatLayout>
  );
}
