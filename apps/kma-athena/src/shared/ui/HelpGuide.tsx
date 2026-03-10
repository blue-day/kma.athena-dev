'use client';

import { useState } from 'react';
import { CommonPopup } from './CommonPopup';

export function HelpGuide() {
  const [isHelpPopupOpen, setIsHelpPopupOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn-info-help"
        onClick={() => setIsHelpPopupOpen(true)}
      >
        페이지 소개
      </button>

      <CommonPopup
        open={isHelpPopupOpen}
        variant="custom"
        popupWidth={480}
        title="도움말"
        content={
          <div>
            도움말 팝업 영역 (내용 미정)
          </div>
        }
        onClose={() => setIsHelpPopupOpen(false)}
        onConfirm={() => setIsHelpPopupOpen(false)}
      />
    </>
  );
}
