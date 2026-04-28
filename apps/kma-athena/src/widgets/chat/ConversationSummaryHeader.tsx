'use client';

import { useEffect, useState } from 'react';
import { ChatType } from '@/entities/chat/config/chatTabConfig';
import { CommonInput } from '@/shared/common/ui/CommonInput';
import { CommonPopup } from '@/shared/common/ui/CommonPopup';
import { useNotification } from '@/shared/pop/lib/useNotification';
import tabIconGeneral from '@/shared/assets/images/icon-side-tab-01.png';
import tabIconKnowledge from '@/shared/assets/images/icon-side-tab-02.png';
import tabIconMyAssistant from '@/shared/assets/images/icon-side-tab-03.png';

type Props = {
  conversationTitle: string;
  chatType: ChatType;
  summaryLabel?: string;
  onSubmitTitle?: (nextTitle: string) => Promise<void>;
  disabled?: boolean;
}

function tabIconSrc(chatType: ChatType) {
  switch (chatType) {
    case 'knowledge':
      return tabIconKnowledge.src;
    case 'assistant':
      return tabIconMyAssistant.src;
    default:
      return tabIconGeneral.src;
  }
}

export function ConversationSummaryHeader({
  conversationTitle,
  chatType,
  summaryLabel,
  onSubmitTitle,
  disabled = false,
}: Props) {
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editTitleText, setEditTitleText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isGeneral = chatType === 'general' || !summaryLabel?.trim();
  const { alert, toast } = useNotification();

  useEffect(() => {
    if (!isEditPopupOpen) return;

    setEditTitleText(conversationTitle);
  }, [isEditPopupOpen, conversationTitle]);

  const handleOpenEditPopup = () => {
    if (disabled) {
      alert({ title: '알림', message: '대화방 생성중입니다.' });
      return;
    }
    setEditTitleText(conversationTitle);
    setIsEditPopupOpen(true);
  };

  const handleCloseEditPopup = () => {
    if (isSubmitting) return;

    setIsEditPopupOpen(false);
    setEditTitleText('');
    toast('취소되었습니다.', 'error');
  };

  const handleConfirmEditPopup = async () => {
    const trimmed = editTitleText.trim();

    if (!trimmed) {
      toast('제목을 입력해주세요.', 'error');
      return;
    }

    if (trimmed === conversationTitle.trim()) {
      setIsEditPopupOpen(false);
      return;
    }

    try {
      setIsSubmitting(true);

      setIsEditPopupOpen(false);
      toast('저장되었습니다.', 'success');
    } catch (error) {
      console.error('대화명 수정 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <div className="sticky top-0 z-10 px-4 py-1.5 md:py-[9px]">
        <div className="flex items-center">
          {!isGeneral &&
            <span className="mr-2.5 md:mr-4 inline-flex h-[26px] md:h-7 shrink-0 items-center justify-center rounded-md bg-[var(--kma-badge-01)] px-2 md:px-2.5 text-[13px] md:text-sm">
              {summaryLabel}
            </span>
          }
          <div className="flex min-w-0 flex-1 items-center">
            <p
              className="mr-1 truncate bg-left0 bg-no-repeat pl-[26px] text-[13px] md:text-sm leading-5 bg-[length:20px_20px]"
              style={{ backgroundImage: `url(${tabIconSrc(chatType)})` }}
            >
              {conversationTitle}
            </p>
            <button
              type="button"
              className="btn-title-edit shrink-0 transition-colors"
              onClick={handleOpenEditPopup}
            >
              <span className="sr-only">수정</span>
            </button>
          </div>
        </div>
      </div>

      {/* 제목수정 팝업 */}
      <CommonPopup
        open={isEditPopupOpen}
        variant="custom"
        title="대화명 수정"
        content={
          <CommonInput
            value={editTitleText}
            onChange={setEditTitleText}
            onClear={() => setEditTitleText('')}
            placeholder="대화명을 입력해주세요."
            disabled={isSubmitting}
          />
        }
        onClose={handleCloseEditPopup}
        onConfirm={handleConfirmEditPopup}
      />
    </>
  );
}
