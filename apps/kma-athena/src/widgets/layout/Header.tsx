'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChatTypeTabs } from './ChatTypeTabs';
import { ThemeModeSwitch } from './ThemeModeSwitch';
import { useMainLayout } from './MainLayoutContext';
import Link from 'next/link';
import { SelectBottomSheet } from '@/shared/common/ui/SelectBottomSheet';
import { getInfoByRoute, isSameTabNavigation, resolveChatRoute } from '@/entities/chat/lib/chatNavigation';
import { CHAT_TAB_ITEMS } from '@/entities/chat/config/chatTabConfig';

interface ChatHeaderProps {
  header?: React.ReactNode;
}

export const ChatHeader = ({ header }: ChatHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { openMobileMenu, themeMode, setThemeMode } = useMainLayout();

  const [mobileSelectOpen, setMobileSelectOpen] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const routeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const routeActiveTab = resolveChatRoute(pathname).chatTabRoute;
  const visibleActiveTab = pendingTab ?? routeActiveTab;
  const activeChatInfo = getInfoByRoute(visibleActiveTab)

  useEffect(() => {
    setPendingTab(null);
  }, [routeActiveTab]);

  useEffect(() => {
    return () => {
      if (routeTimerRef.current) {
        clearTimeout(routeTimerRef.current);
      }
    };
  }, []);

  const clearRouteTimer = () => {
    if (!routeTimerRef.current) {
      return;
    }

    clearTimeout(routeTimerRef.current);
    routeTimerRef.current = null;
  };

  const handleTabChange = (nextPath: string) => {
    clearRouteTimer();

    if (isSameTabNavigation(pathname, nextPath)) {
      setPendingTab(null);
      setMobileSelectOpen(false);
      router.replace(getInfoByRoute(nextPath).key, { scroll: false });
      return;
    }

    setPendingTab(nextPath);
    setMobileSelectOpen(false);

    routeTimerRef.current = setTimeout(() => {
      router.push(nextPath);
      routeTimerRef.current = null;
    }, 180);
  };

  return (
    <header className="flex-shrink-0 h-[56px] md:h-[70px] md:border-b border-gray-border bg-white dark:bg-[#0f182a] md:dark:bg-[#1e2a3b] fixed md:static top-0 left-0 right-0 z-10">
      {header || (
        <>
          <div className="hidden md:flex items-center h-full w-full px-[30px]">
            <ChatTypeTabs tabs={CHAT_TAB_ITEMS} activeTab={visibleActiveTab} onChange={handleTabChange} />
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
              className={`common-select-popopen ${activeChatInfo.chatType}`}
              aria-haspopup="dialog"
              aria-expanded={mobileSelectOpen}
            >
              <span className="truncate">{activeChatInfo.label}</span>
            </button>
          </div>

          <SelectBottomSheet
            open={mobileSelectOpen}
            onClose={() => setMobileSelectOpen(false)}
            title="챗봇 타입 선택"
            options={CHAT_TAB_ITEMS}
            value={visibleActiveTab}
            onSelect={handleTabChange}
          />
        </>
      )}
    </header>
  );
};

