'use client';

import React, { useState } from 'react';
import { MaterialPanel } from '@/features/chat/ui/MaterialPanel';

interface ChatLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

/**
 * 채팅 레이아웃 컴포넌트
 * - 헤더 + 우측 슬라이딩 패널 (자료 리스트) + 중앙 채팅 영역
 */
export const ChatLayout = ({ children, header }: ChatLayoutProps) => {
  const [isMaterialOpen, setIsMaterialOpen] = useState(false);

  return (
    <div className="relative flex flex-col w-full h-full overflow-hidden bg-white">
      {/* 1. 상단 채팅 전용 헤더 (채팅방 제목, 설정 등) */}
      <header className="flex-shrink-0 h-16 border-b border-gray-100 bg-white">
        {header || (
          <div className="flex items-center h-full px-6">
            <h2 className="text-lg font-bold text-gray-800">대한의사협회 사내 지식 챗봇</h2>
          </div>
        )}
      </header>

      {/* 2. 메인 바디 영역 (채팅창 + 우측 슬라이딩 패널) */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* (A) 중앙 채팅 메시지 영역 (아이템들이 수직으로 쌓임) */}
        <section className="flex-1 min-w-0 overflow-y-auto bg-white relative">
          {/* 자료 패널 토글 버튼 (패널이 닫혀있을 때만 표시) */}
          {!isMaterialOpen && (
            <button
              onClick={() => setIsMaterialOpen(true)}
              className="absolute z-10 p-1 bg-white border border-gray-200 rounded-md top-4 right-4 hover:bg-gray-50 shadow-sm"
              title="자료 리스트 열기"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          
          <div className="w-full max-w-4xl mx-auto h-full flex flex-col">
            {children}
          </div>
        </section>

        {/* (B) 우측 슬라이딩 패널 (자료 리스트) */}
        <aside
          className={`flex-shrink-0 transition-all duration-300 border-l border-gray-100 bg-gray-50 overflow-y-auto ${
            isMaterialOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'
          }`}
        >
          <MaterialPanel onClose={() => setIsMaterialOpen(false)} />
        </aside>
      </div>
    </div>
  );
};
