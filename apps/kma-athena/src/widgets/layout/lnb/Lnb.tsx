'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import defaultProfileIconMale from '@/shared/assets/images/icon-profile-male.svg';//남성인 경우 
import defaultProfileIconFemale from '@/shared/assets/images/icon-profile-female.svg';//여성인 경우
import { ThemeModeSwitch } from '@/widgets/layout/header/ThemeModeSwitch';
import { useMainLayout } from '../MainLayoutContext';
import { useNotification } from '@/shared/notification/hooks/useNotification';
import { ChatHistorySection } from './ChatHistorySection';

const LNB_BACKGROUND_STYLE = {
  backgroundImage:
    'linear-gradient(to bottom, rgba(191, 221, 255, 0) 70%, #bfddff), linear-gradient(to bottom, #f8f9fc, #f8f9fc)',
} as const;
const LNB_BACKGROUND_STYLE_DARK = {
  backgroundImage:
    'linear-gradient(to bottom, rgba(61, 97, 146, 0) 60%, #34517a), linear-gradient(to bottom, #1e2a3b, #1e2a3b)',
} as const;

const HISTORY_SECTIONS = [
  {
    key: 'today',
    title: '오늘',
    transitionDelay: '60ms',
    category: 'general',
    items: [1, 2].map(
      (index) => `오늘의 대화 제목 샘플 오늘의 대화 제목 샘플 오늘의 대화 제목 샘플${index}`,
    ),
  },
  {
    key: 'yesterday',
    title: '어제',
    transitionDelay: '130ms',
    category: 'knowledge',
    items: [1, 2].map((index) => `어제의 대화 제목 샘플 ${index}`),
  },
  {
    key: 'past',
    title: '4일 전',
    transitionDelay: '200ms',
    category: 'assistant',
    items: [1, 2, 3, 4].map((index) => `오래된 대화 제목 샘플 ${index}`),
  },
] as const;

type LnbProps = {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  profileName?: string;
  profileImageUrl?: string;
};

/**
 * 전역 사이드바 (LNB)
 * - 펼쳐지거나 좁은 형태 유지 (버튼 토글 방식)
 */
export const Lnb = ({
  mobileOpen = false,
  onMobileClose,
  profileName = '홍길동',
  profileImageUrl,
}: LnbProps) => {
  const { alert, confirm, toast } = useNotification();  // 팝업 호출부 가져오기
  const { themeMode, setThemeMode } = useMainLayout();
  const lnbBackgroundStyle = themeMode === 'dark' ? LNB_BACKGROUND_STYLE_DARK : LNB_BACKGROUND_STYLE;
  // 데스크톱 LNB 전용 접기/펼치기 상태
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);
  const [profileSrc, setProfileSrc] = useState(profileImageUrl?.trim() || defaultProfileIconMale.src);

  useEffect(() => {
    setProfileSrc(profileImageUrl?.trim() || defaultProfileIconMale.src);
  }, [profileImageUrl]);

  const handleToggleExpanded = useCallback(() => setIsExpanded((prev) => !prev), []);
  const handleToggleHistoryVisible = useCallback(() => setIsHistoryVisible((prev) => !prev), []);

  const btnNewChat = () => {
    confirm({
      message: '새 채팅으로 이동하시겠습니까?',
      onConfirm: () => {
        console.log('확인 후 후처리');
      },
    });
  }

  const btnWait = () => {
    alert({
      // title: '알림',
      message: '준비중인 기능입니다.'
    });
  }

  const btnToast = () => {
    toast('삭제할 수 없습니다.', 'error')
  }

  const renderMenuActions = (expanded: boolean) => {
    return (
      <div className="space-y-1.5 pb-4 md:pb-5">
        <button className={`btn-menu-item chat ${expanded ? 'w-full' : 'close'}`} onClick={btnNewChat}>
          <span className={`text-sm font-medium truncate ${expanded ? 'block opacity-100' : 'w-0 hidden opacity-0'}`}>새 채팅</span>
        </button>
        <Link href="/archive" className={`btn-menu-item locker ${expanded ? 'w-full' : 'close'}`}>
          <span className={`text-sm font-medium truncate ${expanded ? 'block opacity-100' : 'w-0 hidden opacity-0'}`}>보관함</span>
        </Link>
      </div>
    );
  };

  const renderProfile = (expanded: boolean) => (
    <div className="h-[110px] md:h-[120px] self-stretch flex flex-col justify-center items-stretch bg-primary dark:bg-[#1e2a3b]">
      <div className={`flex items-center gap-3 transition-padding duration-300 ${expanded ? 'px-[36px]' : 'p-4'}`}>
        <div className="w-[50px] h-[50px] min-w-[50px] min-h-[50px] shrink-0 rounded-full overflow-hidden">
          {/* 외부 URL 포함 동적 이미지 소스를 허용하기 위해 img 태그를 사용 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profileSrc}
            alt="프로필 이미지"
            className="w-full h-full object-cover"
            onError={() => setProfileSrc(defaultProfileIconMale.src)}
          />
        </div>
        {expanded && (
          <div className="min-w-0">
            <p className="truncate text-base leading-5 font-semibold text-white">
              {profileName}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 데스크톱: 기존 접기/펼치기 가능한 LNB */}
      <aside
        className={`kma-lnb-wrap relative hidden md:flex md:flex-col h-screen transition-all duration-300 ${isExpanded ? 'w-[320px]' : 'w-[84px]'
          }`}
        style={{
          ...lnbBackgroundStyle,
          backgroundAttachment: 'fixed',
        }}
      >
        <div className={`flex items-center h-[92px] px-6 transition-all duration-300 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
          <Link
            href="/"
            className={`flex items-center transition-all duration-300 ${isExpanded ? 'opacity-100 visible w-[194px]' : 'opacity-0 invisible w-0'
              }`}
          >
            <h1 className="logo-kma">
              <span className="sr-only">KMA 대한의사협회</span>
            </h1>
          </Link>

          <button
            type="button"
            onClick={handleToggleExpanded}
            className={`btn-lnb-toggle transition-all duration-300 flex-shrink-0 ${!isExpanded && 'mx-auto'}`}
          >
            <span className="sr-only">{isExpanded ? '사이드바 닫기' : '사이드바 열기'}</span>
          </button>
        </div>

        <div className="flex flex-col flex-1 min-h-0 px-4">
          {renderMenuActions(isExpanded)}

          <ChatHistorySection
            expanded={isExpanded}
            isHistoryVisible={isHistoryVisible}
            isDeletingAll
            showThemeSwitch
            onToggleVisible={handleToggleHistoryVisible}
            onDeleteAll={btnToast}
          />
        </div>

        {renderProfile(isExpanded)}
      </aside>

      {/* 모바일 오버레이 LNB */}
      <div className={`fixed inset-0 z-40 md:hidden ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <button
          type="button"
          aria-label="메뉴 닫기 오버레이"
          onClick={onMobileClose}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'
            }`}
        />

        <aside
          className={`kma-lnb-wrap relative flex h-full w-[86%] max-w-[290px] flex-col shadow-2xl transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          style={lnbBackgroundStyle}
          aria-hidden={!mobileOpen}
        >
          <div className="flex h-[56px] items-center justify-between px-2.5">
            <button
              type="button"
              onClick={onMobileClose}
              className="btn-lnb-close"
              aria-label="메뉴 닫기"
            >
            </button>
          </div>

          <div className="flex flex-col flex-1 min-h-0 px-2.5">
            {renderMenuActions(true)}

            <ChatHistorySection
              expanded={true}
              isHistoryVisible={isHistoryVisible}
              isDeletingAll
              showThemeSwitch
              themeSwitchNode={
                <div className="pt-4 px-4 pb-2 bg-white wide text-center">
                  <ThemeModeSwitch value={themeMode} onChange={setThemeMode} />
                </div>
              }
              onToggleVisible={handleToggleHistoryVisible}
              onDeleteAll={btnToast}
            />
          </div>

          {renderProfile(true)}
        </aside>
      </div>
    </>
  );
};
