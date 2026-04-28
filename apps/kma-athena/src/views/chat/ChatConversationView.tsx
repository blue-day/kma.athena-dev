'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  AttachmentPanel,
  AttachmentPanelContent,
  AttachmentPanelDownloadButton,
} from '@/features/chat/ui/AttachmentPanel';
import { AssistantAnswerCard } from '@/features/chat/ui/AssistantAnswerCard';
import { ChatPromptInput } from '@/features/chat/ui/ChatPromptInput';
import {
  MaterialPanel,
  MaterialPanelContent,
  MaterialPanelDownloadButton,
} from '@/features/chat/ui/MaterialPanel';
import { CommonBottomSheet } from '@/shared/common/ui/CommonBottomSheet';
import { ConversationSummaryHeader } from '@/widgets/chat/ConversationSummaryHeader';
import { getInfoByRoute } from '@/entities/chat/lib/chatNavigation';
import { ConversationMessages } from '@/widgets/chat/ConversationMessages';

const noop = (_value?: string) => { };
// 하단에서 일정 거리 이상 벗어나면 "맨 아래 이동" 버튼을 노출합니다.
const BOTTOM_THRESHOLD = 80;

type SidePanelType = 'material' | 'attachment' | null;

export function ChatConversationView() {
  const pathname = usePathname();
  const [activeSidePanel, setActiveSidePanel] = useState<SidePanelType>(null);
  const [materialSelectModeInSheet, setMaterialSelectModeInSheet] = useState(false);
  // 모바일 바텀 시트용 자료 탭 상태 관리 (내부 문서일 때만 다운로드 버튼 노출)
  const [materialActiveTabInSheet, setMaterialActiveTabInSheet] = useState<string>('internal');
  const [attachmentSelectModeInSheet, setAttachmentSelectModeInSheet] = useState(false);
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isSidePanelOpen = activeSidePanel !== null;
  const sourceData = getInfoByRoute(pathname);
  const isFromMyAssistant = sourceData.chatType === 'assistant';

  const updateScrollButtonVisibility = () => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    // 스크롤 위치를 기준으로 현재 하단까지의 거리를 계산합니다.
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowScrollToBottomButton(distanceFromBottom > BOTTOM_THRESHOLD);
  };

  const handleScrollToBottom = () => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    // 초기 진입 시에도 버튼 노출 여부를 한 번 계산합니다.
    const rafId = window.requestAnimationFrame(updateScrollButtonVisibility);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    if (activeSidePanel !== 'material') {
      setMaterialSelectModeInSheet(false);
      setMaterialActiveTabInSheet('internal');
    }
    if (activeSidePanel !== 'attachment') {
      setAttachmentSelectModeInSheet(false);
    }
  }, [activeSidePanel]);

  const closeSidePanel = () => {
    setActiveSidePanel(null);
    setMaterialSelectModeInSheet(false);
    setMaterialActiveTabInSheet('internal');
    setAttachmentSelectModeInSheet(false);
  };

  return (
    <div className="relative flex h-full">
      <section className="relative z-10 mx-auto flex h-full w-full flex-col">
        <ConversationSummaryHeader
          conversationTitle="새 대화방"
          chatType={sourceData.chatType}
          summaryLabel={sourceData.label ?? ''} />

        <div
          ref={scrollContainerRef}
          onScroll={updateScrollButtonVisibility}
          className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-2.5 md:pt-[60px]"
        >
          <ConversationMessages
            conversation={sourceData}
            onOpenMaterialPanel={() => setActiveSidePanel('material')}
          />
        </div>

        <button
          type="button"
          className={`btn-scroll-bottom ${showScrollToBottomButton ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          onClick={handleScrollToBottom}
          aria-label="최신 메시지로 이동"
        />

        <div className="px-4 pb-2.5 pt-4 md:px-2.5 md:pb-5">
          <ChatPromptInput
            onSubmit={noop}
            docked
            modelSelectorVariant="text"
            isFromMyAssistant={isFromMyAssistant}
            onOpenAttachmentPanel={() => setActiveSidePanel('attachment')}
          />
        </div>
      </section>

      <aside
        className={`side-panel-wrap hidden flex-shrink-0 overflow-y-auto border-l border-gray-border bg-[var(--kma-white-content)] transition-all duration-300 md:block ${isSidePanelOpen ? 'w-[400px] opacity-100' : 'w-0 opacity-0 pointer-events-none'
          }`}
        aria-hidden={!isSidePanelOpen}
      >
        {activeSidePanel === 'material' ? (
          <MaterialPanel onClose={closeSidePanel} />
        ) : activeSidePanel === 'attachment' ? (
          <AttachmentPanel onClose={closeSidePanel} />
        ) : null}
      </aside>

      <CommonBottomSheet
        open={isSidePanelOpen}
        onClose={closeSidePanel}
        className="h-fix has-inner-scroll"
        footer={
          /* 자료 패널이고 내부 문서 탭일 때만 푸터(다운로드 버튼) 노출 */
          activeSidePanel === 'material' && materialActiveTabInSheet === 'internal' ? (
            <MaterialPanelDownloadButton
              isSelectMode={materialSelectModeInSheet}
              onToggleSelectMode={() => setMaterialSelectModeInSheet((prev) => !prev)}
            />
          ) : activeSidePanel === 'attachment' ? (
            <AttachmentPanelDownloadButton
              isSelectMode={attachmentSelectModeInSheet}
              onToggleSelectMode={() => setAttachmentSelectModeInSheet((prev) => !prev)}
            />
          ) : undefined
        }
      >
        {activeSidePanel === 'material' ? (
          <MaterialPanelContent
            isSelectMode={materialSelectModeInSheet}
            activeSubTab={materialActiveTabInSheet}
            onTabChange={setMaterialActiveTabInSheet}
          />
        ) : activeSidePanel === 'attachment' ? (
          <AttachmentPanelContent isSelectMode={attachmentSelectModeInSheet} />
        ) : null}
      </CommonBottomSheet>
    </div>
  );
}
