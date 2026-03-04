'use client';

import React, { useRef } from 'react';
import { convertHwpToHtml } from '@kma/utils';

export function HwpImportButton({ onImport }: { onImport: (html: string) => void }) {
  const hwpInput = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    try {
      const res = await convertHwpToHtml(f);
      if (!res.ok) {
        alert(res.message ?? 'HWP 변환 실패');
      } else {
        onImport(res.html ?? '');
      }
    } catch (err) {
      alert('HWP 파일 처리 중 오류가 발생했습니다.');
    }

    e.target.value = '';
  };

  return (
    <>
      <button
        className="kma-btn kma-btn-gray"
        type="button"
        onClick={() => hwpInput.current?.click()}
      >
        HWP 불러오기
      </button>
      <input
        ref={hwpInput}
        type="file"
        accept=".hwp"
        className="kma-hidden"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </>
  );
}
