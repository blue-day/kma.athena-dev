'use client';

import { useState } from 'react';
import editIcon from '@/shared/assets/images/icon-side-list.png';
import { CommonInput } from '@/shared/ui/CommonInput';
import { CommonPopup } from '@/shared/ui/CommonPopup';

export function ConversationSummaryHeader() {
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editTitleText, setEditTitleText] = useState('');

  return (
    <>
      <div className="sticky top-0 z-10 px-4 py-1.5 md:py-[9px]">
        <div className="flex items-center">
          <span className="mr-2.5 md:mr-4 inline-flex h-[26px] md:h-7 shrink-0 items-center justify-center rounded-md bg-[var(--kma-badge-01)] px-2 md:px-2.5 text-[13px] md:text-sm">
            협회 자료 검색
          </span>
          <div className="flex min-w-0 flex-1 items-center">
            <p
              className="mr-1 truncate bg-left0 bg-no-repeat pl-[26px] text-[13px] md:text-sm leading-5 bg-[length:20px_20px]"
              style={{ backgroundImage: `url(${editIcon.src})` }}
            >
              성분명 처방에 대한 의협의 공식 입장은 어때?
            </p>
            <button
              type="button"
              className="btn-title-edit shrink-0 transition-colors hover:bg-[var(--kma-bg-hover)]"
              onClick={() => setIsEditPopupOpen(true)}
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
        title="제목 수정"
        content={
          <CommonInput
            value={editTitleText}
            onChange={setEditTitleText}
            onClear={() => setEditTitleText('')}
            placeholder="제목을 입력해주세요."
          />
        }
        onClose={() => setIsEditPopupOpen(false)}
        onConfirm={() => setIsEditPopupOpen(false)}
      />
    </>
  );
}
