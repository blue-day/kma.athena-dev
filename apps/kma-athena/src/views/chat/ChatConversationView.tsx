'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  AttachmentPanel,
  AttachmentPanelContent,
  AttachmentPanelDownloadButton,
} from '@/features/chat/ui/AttachmentPanel';
import { AssistantAnswerCard } from '@/features/chat/ui/AssistantAnswerCard';
import { ChatPromptInput } from '@/features/chat/ui/ChatPromptInput';
import { ConversationSummaryHeader } from '@/features/chat/ui/ConversationSummaryHeader';
import {
  MaterialPanel,
  MaterialPanelContent,
  MaterialPanelDownloadButton,
} from '@/features/chat/ui/MaterialPanel';
import { CommonBottomSheet } from '@/shared/ui/CommonBottomSheet';
import { ChatLayout } from '@/widgets/layout/ChatLayout';

const noop = (_value?: string) => {};
// 하단에서 일정 거리 이상 벗어나면 "맨 아래 이동" 버튼을 노출합니다.
const BOTTOM_THRESHOLD = 80;

type SidePanelType = 'material' | 'attachment' | null;

export function ChatConversationView() {
  const searchParams = useSearchParams();
  const [activeSidePanel, setActiveSidePanel] = useState<SidePanelType>(null);
  const [materialSelectModeInSheet, setMaterialSelectModeInSheet] = useState(false);
  // 모바일 바텀 시트용 자료 탭 상태 관리 (내부 문서일 때만 다운로드 버튼 노출)
  const [materialActiveTabInSheet, setMaterialActiveTabInSheet] = useState<string>('internal');
  const [attachmentSelectModeInSheet, setAttachmentSelectModeInSheet] = useState(false);
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isSidePanelOpen = activeSidePanel !== null;
  const isFromMyAssistant = searchParams.get('source') === 'my-assistant';

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
    <ChatLayout>
      <div className="relative flex h-full">
        <section className="relative z-10 mx-auto flex h-full w-full flex-col">
          <ConversationSummaryHeader />

          <div
            ref={scrollContainerRef}
            onScroll={updateScrollButtonVisibility}
            className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-2.5 md:pt-[60px]"
          >
            <div className="mx-auto flex w-full max-w-[852px] flex-col md:pt-6">
              <div className="chat-message-rise ml-auto max-w-[80%] rounded-[8px_0_8px_8px] bg-[var(--kma-badge-02)] px-3 py-2 text-sm leading-5 md:px-4 md:text-base md:leading-7">
                성분명 처방에 대한 협회의 공식 입장은 어때?
              </div>
              <AssistantAnswerCard onOpenMaterialPanel={() => setActiveSidePanel('material')} />
            </div>
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
          className={`side-panel-wrap hidden flex-shrink-0 overflow-y-auto border-l border-gray-border bg-[var( --kma-white-content)] transition-all duration-300 md:block ${
            isSidePanelOpen ? 'w-[400px] opacity-100' : 'w-0 opacity-0 pointer-events-none'
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
    </ChatLayout>
  );
}
