'use client';
/**
 * 만들기 팝업의 데이터 수정 시마다 발생하는 나만의 비서 메인화면 렌더링 방지를 위해 파일 분리
 */
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CommonBottomSheet } from '@/shared/common/ui/CommonBottomSheet';
import { CommonPopup } from '@/shared/common/ui/CommonPopup';
import { CreateAssistantContent } from '@/features/assistant/ui/CreateAssistantContent';
import { AssistantCardCarousel } from '@/widgets/assistant/AssistantCardCarousel';
import type { AssistantListItem } from '@/entities/chat/model/assistantTypes';
import { buildConversationRoute } from '@/entities/chat/lib/chatNavigation';

interface AssistantViewProps {
  assistants: AssistantListItem[];
  hasAssistants: boolean;
}

export function AssistantFormWidget({ assistants, hasAssistants }: AssistantViewProps) {
  const router = useRouter();
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [isCreateBottomSheetOpen, setIsCreateBottomSheetOpen] = useState(false);

  const handleCreateClick = () => {
    if (typeof window === 'undefined') {
      return;
    }

    if (window.matchMedia('(min-width: 768px)').matches) {
      setIsCreatePopupOpen(true);
      return;
    }

    setIsCreateBottomSheetOpen(true);
  };

  const handleAssistantClick = (assistantId: string) => {
    router.push(buildConversationRoute(assistantId, 'assistant'));
  };

  const handleCloseCreatePopup = () => {
    setIsCreatePopupOpen(false);
  };

  const handleCloseCreateBottomSheet = () => {
    setIsCreateBottomSheetOpen(false);
  };

  return (
    <>
      {hasAssistants ? (
        <AssistantCardCarousel
          assistants={assistants}
          onCreateClick={handleCreateClick}
          onAssistantClick={handleAssistantClick}
        />
      ) : (
        /* Empty State: 생성 버튼만 노출 */
        <section>
          <div className="assistant-init-wrap">
            <button
              type="button"
              onClick={handleCreateClick}
              className="w-[170px] h-[46px] rounded-[55px] border border-[var(--kma-gray-button-border)] bg-[var(--kma-white-02)]"
            >
              <span className="text-sm font-medium">나만의 비서 만들기</span>
            </button>
          </div>
        </section>
      )}

      <CommonPopup
        open={isCreatePopupOpen}
        variant="custom"
        title="나만의 비서 만들기"
        popupWidth={830}
        content={<CreateAssistantContent />}
        onClose={handleCloseCreatePopup}
        onConfirm={handleCloseCreatePopup}
        confirmText="저장"
        confirmDisabled
      />

      <CommonBottomSheet
        open={isCreateBottomSheetOpen}
        onClose={handleCloseCreateBottomSheet}
        title="나만의 비서 만들기"
        footer={(
          <div className="btn-wrap">
            <button
              type="button"
              className="btn-txt secondary w-full"
              onClick={handleCloseCreateBottomSheet}
            >
              취소
            </button>
            <button
              type="button"
              className="btn-txt primary w-full"
              disabled
            >
              저장
            </button>
          </div>
        )}
      >
        <CreateAssistantContent />
      </CommonBottomSheet>
    </>
  );
}
