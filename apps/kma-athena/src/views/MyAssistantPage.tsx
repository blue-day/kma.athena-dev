'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatWelcomeHero } from '@/features/chat/ui/ChatWelcomeHero';
import { CommonBottomSheet } from '@/shared/common/ui/CommonBottomSheet';
import { CommonPopup } from '@/shared/common/ui/CommonPopup';
import { CreateAssistantContent } from '@/features/assistant/ui/CreateAssistantContent';
import { buildConversationRoute } from '@/entities/chat/lib/chatNavigation';
import { AssistantCardCarousel } from '@/widgets/assistant/AssistantCardCarousel';

interface AssistantCard {
  id: string;
  title: string;
}

const MOCK_ASSISTANTS: AssistantCard[] = [
  { id: 'assistant-1', title: '지식 아카이브 매니저' },
  { id: 'assistant-2', title: '베테랑 의협 사무국장' },
  { id: 'assistant-3', title: '스마트한 세무 컨설턴트' },
  { id: 'assistant-4', title: '청구코드 점검 비서' },
  { id: 'assistant-5', title: '학회자료 정리 비서' },
];

export function MyAssistantPage() {
  const router = useRouter();
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [isCreateBottomSheetOpen, setIsCreateBottomSheetOpen] = useState(false);
  const assistants = MOCK_ASSISTANTS;
  const hasAssistants = assistants.length > 0;

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
      {/* 페이지 배경/스크롤 영역 */}
      <section className="relative z-10 mx-auto flex h-full w-full flex-col bg-kma-deco">
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 md:px-2.5">
          <div className={`flex flex-col items-center ${hasAssistants ? 'pt-[30px]' : 'pt-[100px]'} md:pt-[220px] pb-10 md:px-12`}>
            {/* 상단 인사/설명 영역 */}
            <ChatWelcomeHero
              subtitle={
                <>
                  참고할 자료를 업로드하고
                  <br className="md:hidden" />
                  {' '}
                  AI 역할을 설정하면 나만의 비서가 됩니다.
                </>
              }
            />

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
          </div>
        </div>
      </section>

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
