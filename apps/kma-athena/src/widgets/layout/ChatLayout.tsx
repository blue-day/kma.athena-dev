'use client';

import React from 'react';
import { ChatHeader } from './Header';

interface ChatLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

/**
 * 채팅 레이아웃 컴포넌트
 * - 헤더 + 중앙 채팅 영역
 */
export const ChatLayout = ({ children, header }: ChatLayoutProps) => {
  return (
    <div className="relative flex flex-col w-full h-full overflow-hidden bg-white">
      <ChatHeader header={header} />

      <div className="relative flex flex-1 min-h-0 overflow-hidden pt-[64px] md:pt-0">
        <section className="relative flex-1 min-w-0 overflow-y-auto custom-scrollbar  bg-white bg-[linear-gradient(to_top,_#ddf0ff_0%,_transparent_30%)]">
          {children}
        </section>
      </div>
    </div>
  );
};
