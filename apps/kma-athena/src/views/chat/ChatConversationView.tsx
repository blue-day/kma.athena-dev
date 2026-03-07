'use client';

import { useState } from 'react';
import { AssistantAnswerCard } from '@/features/chat/ui/AssistantAnswerCard';
import { ChatPromptInput } from '@/features/chat/ui/ChatPromptInput';
import { ConversationSummaryHeader } from '@/features/chat/ui/ConversationSummaryHeader';
import { MaterialPanel, MaterialPanelContent } from '@/features/chat/ui/MaterialPanel';
import { CommonBottomSheet } from '@/shared/ui/CommonBottomSheet';
import { ChatLayout } from '@/widgets/layout/ChatLayout';

const noop = (_value?: string) => {};

export function ChatConversationView() {
  const [isMaterialPanelOpen, setIsMaterialPanelOpen] = useState(false);

  return (
    <ChatLayout>
      <div className="relative flex h-full">
        <section className="relative z-10 mx-auto flex h-full w-full flex-col">
          <ConversationSummaryHeader />

          <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-2.5 pt-[60px]">
            <div className="mx-auto flex w-full max-w-[852px] flex-col py-6">
              <div className="chat-message-rise ml-auto max-w-[80%] rounded-[8px_0_8px_8px] bg-[#ebf3fd] px-4 py-2 leading-7">
                성분명 처방에 대한 협회의 공식 입장은 어때?
              </div>
              <AssistantAnswerCard onOpenMaterialPanel={() => setIsMaterialPanelOpen(true)} />
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
          className={`hidden flex-shrink-0 overflow-y-auto border-l border-gray-border bg-white transition-all duration-300 md:block ${
            isMaterialPanelOpen ? 'w-[400px] opacity-100' : 'w-0 opacity-0 pointer-events-none'
          }`}
          aria-hidden={!isMaterialPanelOpen}
        >
          <MaterialPanel onClose={() => setIsMaterialPanelOpen(false)} />
        </aside>

        <CommonBottomSheet
          open={isMaterialPanelOpen}
          onClose={() => setIsMaterialPanelOpen(false)}
          className="max-h-[80vh]"
        >
          <div className="max-h-[calc(80vh-84px)] overflow-y-auto">
            <MaterialPanelContent />
          </div>
        </CommonBottomSheet>
      </div>
    </ChatLayout>
  );
}
