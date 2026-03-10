'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChatTypeTabs } from './ChatTypeTabs';
import { ThemeModeSwitch } from './ThemeModeSwitch';
import { useMainLayout } from './MainLayoutContext';
import Link from 'next/link';
import { SelectBottomSheet } from '@/shared/ui/SelectBottomSheet';

interface ChatHeaderProps {
  header?: React.ReactNode;
}

export const ChatHeader = ({ header }: ChatHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { openMobileMenu, themeMode, setThemeMode } = useMainLayout();
  const tabs = [
    { key: '/', label: '일반 챗봇' },
    { key: '/knowledge-chat', label: 'KMA 내부 지식 챗봇 ' },
    { key: '/my-assistant', label: '나만의 비서' },
  ];
  const activeTabFromPath = tabs.find((tab) => tab.key === pathname)?.key ?? '/';
  const [activeTab, setActiveTab] = useState(activeTabFromPath);
  const routeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mobileSelectOpen, setMobileSelectOpen] = useState(false);

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
    <header className="flex-shrink-0 h-[56px] md:h-[70px] md:border-b border-gray-border bg-white fixed md:static top-0 left-0 right-0 z-10">
      {header || (
        <>
          <div className="hidden md:flex items-center h-full w-full px-[30px]">
            <ChatTypeTabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
            <ThemeModeSwitch value={themeMode} onChange={setThemeMode} />
          </div>

          <div className="flex md:hidden h-full w-full items-center justify-between px-2.5">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                aria-label="메뉴 열기"
                onClick={openMobileMenu}
                className="btn-mobile-menu"
              >
              </button>
              
              <Link
                href="/"
                className="flex items-center "
              >
                <h1 className="logo-kma">
                  <span className="sr-only">KMA 대한의사협회</span>
                </h1>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileSelectOpen(true)}
              className="common-select-popopen"
              aria-haspopup="dialog"
              aria-expanded={mobileSelectOpen}
            >
              <span className="truncate">{tabs.find((tab) => tab.key === activeTab)?.label}</span>
            </button>
          </div>

          <SelectBottomSheet
            open={mobileSelectOpen}
            onClose={() => setMobileSelectOpen(false)}
            title="챗봇 타입 선택"
            options={tabs}
            value={activeTab}
            onSelect={handleTabChange}
          />
        </>
      )}
    </header>
  );
};

