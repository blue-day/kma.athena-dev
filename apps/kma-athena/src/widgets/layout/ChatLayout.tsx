'use client';

import React from 'react';
import { ChatHeader } from './Header';
import { HelpGuide } from '../../shared/ui/HelpGuide';

interface ChatLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  showHelp?: boolean;
  contentBgClassName?: string;
}

/**
 * 채팅 레이아웃 컴포넌트
 * - 헤더 + 중앙 채팅 영역
 */
export const ChatLayout = ({
  children,
  header,
  showHelp = false,
  contentBgClassName = 'bg-[linear-gradient(to_top,_#ddf0ff_0%,_transparent_30%)] dark:bg-[linear-gradient(to_top,_#222e40_0%,_transparent_30%)]',
}: ChatLayoutProps) => {
  return (
    <div className="relative flex flex-col w-full h-full overflow-hidden bg-white">
      <ChatHeader header={header} />
      {showHelp && <HelpGuide />}

      <div className="relative flex flex-1 min-h-0 overflow-hidden pt-[56px] md:pt-0">
        <section
          className={`relative flex-1 min-w-0 overflow-hidden bg-[var(--kma-white-content)] ${contentBgClassName}`}
        >
          {children}
        </section>
      </div>
    </div>
  );
};
