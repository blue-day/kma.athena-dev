'use client';

import { AssistantAnswerCard } from '@/features/chat/ui/AssistantAnswerCard';
import { ChatPromptInput } from '@/features/chat/ui/ChatPromptInput';
import { ConversationSummaryHeader } from '@/features/chat/ui/ConversationSummaryHeader';
import { MaterialPanel } from '@/features/chat/ui/MaterialPanel';
import { ChatLayout } from '@/widgets/layout/ChatLayout';

const noop = (_value?: string) => {};

export function ChatConversationView() {

  return (
    <ChatLayout>
      <div className="relative flex h-full">
        <section className="relative z-10 mx-auto flex h-full w-full flex-col">
          <ConversationSummaryHeader />

          <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-2.5 pt-6">
            <div className="mx-auto flex w-full max-w-[860px] flex-col gap-4 pb-6 pt-2">
              <div className="chat-message-rise ml-auto max-w-[80%] rounded-2xl bg-[#eef3ff] px-4 py-3 text-sm text-[#1f2937]">
                성분명 처방에 대한 협회의 공식 입장은 어때?
              </div>
              <AssistantAnswerCard />
            </div>
          </div>

          <div className="px-2.5 pb-5 pt-4 md:hidden">
            <ChatPromptInput onSubmit={noop} docked />
          </div>

          <div className="hidden px-2.5 pb-5 pt-4 md:block">
            <ChatPromptInput onSubmit={noop} docked />
          </div>
        </section>

        <aside
          className="hidden w-0 flex-shrink-0 overflow-y-auto border-l border-gray-100 bg-gray-50 opacity-0 transition-all duration-300 md:block"
          aria-hidden
        >
          <MaterialPanel onClose={noop} />
        </aside>
      </div>
    </ChatLayout>
  );
}
