'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChatTypeTabs } from './ChatTypeTabs';
import { ThemeModeSwitch } from './ThemeModeSwitch';

interface ChatHeaderProps {
  header?: React.ReactNode;
}

export const ChatHeader = ({ header }: ChatHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const tabs = [
    { key: '/', label: '일반 챗봇' },
    { key: '/knowledge-chat', label: '사내 지식 챗봇' },
    { key: '/my-assistant', label: '나만의 비서' },
  ];
  const activeTabFromPath = tabs.find((tab) => tab.key === pathname)?.key ?? '/';
  const [activeTab, setActiveTab] = useState(activeTabFromPath);
  const routeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setActiveTab(activeTabFromPath);
  }, [activeTabFromPath]);

  useEffect(() => {
    return () => {
      if (routeTimerRef.current) {
        clearTimeout(routeTimerRef.current);
      }
    };
  }, []);

  const handleTabChange = (nextPath: string) => {
    setActiveTab(nextPath);

    if (nextPath === pathname) {
      return;
    }

    if (routeTimerRef.current) {
      clearTimeout(routeTimerRef.current);
    }

    // 탭 인디케이터 애니메이션이 보이도록 짧게 지연 후 이동
    routeTimerRef.current = setTimeout(() => {
      router.push(nextPath);
    }, 180);
  };

  return (
    <header className="flex-shrink-0 h-[70px] border-b border-gray-border bg-white">
      {header || (
        <div className="flex items-center h-full w-full px-[30px]">
          <ChatTypeTabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
          <ThemeModeSwitch value={themeMode} onChange={setThemeMode} />
        </div>
      )}
    </header>
  );
};

