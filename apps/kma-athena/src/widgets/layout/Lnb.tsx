'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import defaultProfileIconMale from '@/shared/assets/images/icon-profile-male.svg';//남성인 경우 
import defaultProfileIconFemale from '@/shared/assets/images/icon-profile-female.svg';//여성인 경우
import { ThemeModeSwitch } from '@/widgets/layout/ThemeModeSwitch';
import { useMainLayout } from './MainLayoutContext';

const LNB_BACKGROUND_STYLE = {
  backgroundImage:
    'linear-gradient(to bottom, rgba(191, 221, 255, 0) 70%, #bfddff), linear-gradient(to bottom, #f8f9fc, #f8f9fc)',
} as const;

const HISTORY_SECTIONS = [
  {
    key: 'today',
    title: '오늘',
    transitionDelay: '60ms',
    items: [1, 2].map(
      (index) => `오늘의 대화 제목 샘플 오늘의 대화 제목 샘플 오늘의 대화 제목 샘플${index}`,
    ),
  },
  {
    key: 'yesterday',
    title: '어제',
    transitionDelay: '130ms',
    items: [1, 2].map((index) => `어제의 대화 제목 샘플 ${index}`),
  },
  {
    key: 'past',
    title: '4일 전',
    transitionDelay: '200ms',
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
  const { themeMode, setThemeMode } = useMainLayout();
  // 데스크톱 LNB 전용 접기/펼치기 상태
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);
  const [profileSrc, setProfileSrc] = useState(profileImageUrl?.trim() || defaultProfileIconMale.src);

  useEffect(() => {
    setProfileSrc(profileImageUrl?.trim() || defaultProfileIconMale.src);
  }, [profileImageUrl]);

  const renderHistoryItem = (title: string, key: string) => (
    <div key={key} className="btn-lnb-history">
      <button className="title">
        <span className="truncate text-sm font-medium">{title}</span>
      </button>
      <button className="delete-btn">
        <span className="sr-only">삭제</span>
      </button>
    </div>
  );

  const renderHistorySection = (expanded: boolean, forceVisible = false, showThemeSwitch = false) => {
    const isNavSectionVisible = forceVisible || (expanded && isHistoryVisible);

    return (
      <>
        <div className="space-y-1.5 pb-4 md:pb-5">
          <button className={`btn-menu-item chat ${expanded ? 'w-full' : 'close'}`}>
            <span className={`text-sm font-medium truncate ${expanded ? 'block opacity-100' : 'w-0 hidden opacity-0'}`}>새 채팅</span>
          </button>
          <button className={`btn-menu-item locker ${expanded ? 'w-full' : 'close'}`}>
            <span className={`text-sm font-medium truncate ${expanded ? 'block opacity-100' : 'w-0 hidden opacity-0'}`}>보관함</span>
          </button>
        </div>

        <div className="py-1.5 flex items-center justify-between">
          <button
            onClick={() => expanded && setIsHistoryVisible((prev) => !prev)}
            disabled={!expanded}
            className="flex items-center transition-all duration-300 text-left"
          >
            <span className={`btn-toggle-text truncate transition-opacity duration-300 ${expanded ? 'visible opacity-100' : 'invisible opacity-0'} ${isHistoryVisible ? '' : 'close'}`}>대화기록</span>
          </button>
          <button className="btn-list-del mr-1.5 md:mr-2.5">
            전체삭제
          </button>
        </div>

        <nav
          className={`wide px-2.5 md:px-4  flex-1 overflow-y-auto space-y-[26px] pb-6 custom-scrollbar transition-opacity duration-300 ${
            isNavSectionVisible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
        >
          {HISTORY_SECTIONS.map((section) => (
            <div
              key={section.key}
              className={`transition-all duration-300 ${
                isNavSectionVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionDelay: isNavSectionVisible ? section.transitionDelay : '0ms' }}
            >
              {expanded ? (
                <h3 className="px-1.5 md:px-[10px] py-[6px] text-[13px] text-gray-300">{section.title}</h3>
              ) : null}
              <div className="space-y-1.5">
                {section.items.map((title, index) =>
                  renderHistoryItem(title, `${section.key}-${index}`),
                )}
              </div>
            </div>
          ))}
        </nav>

        {showThemeSwitch ? (
          <div className="pt-4 px-4 pb-2 bg-white wide text-center">
            <ThemeModeSwitch value={themeMode} onChange={setThemeMode} />
          </div>
        ) : null}
      </>
    );
  };

  const renderProfile = (expanded: boolean) => (
    <div className="h-[110px] md:h-[142px] self-stretch flex flex-col justify-center items-stretch bg-primary">
      <div className={`flex items-center gap-3 transition-padding duration-300 ${expanded ? 'px-[36px]' : 'p-4'}`}>
        <div className="w-[50px] h-[50px] min-w-[50px] min-h-[50px] shrink-0 rounded-full overflow-hidden">
          {/* 외부 URL 포함 동적 이미지 소스를 허용하기 위해 img 태그를 사용 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profileSrc}
            alt="프로필 이미지"
            className="w-full h-full object-cover"
            onError={() => setProfileSrc(defaultProfileIcon.src)}
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
        className={`kma-lnb-wrap relative hidden md:flex md:flex-col h-screen transition-all duration-300 ${
          isExpanded ? 'w-[320px]' : 'w-[84px]'
        }`}
        style={{
          ...LNB_BACKGROUND_STYLE,
          backgroundAttachment: 'fixed',
        }}
      >
        <div className={`flex items-center h-[92px] px-6 transition-all duration-300 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
          <Link
            href="/"
            className={`flex items-center transition-all duration-300 ${
              isExpanded ? 'opacity-100 visible w-[194px]' : 'opacity-0 invisible w-0'
            }`}
          >
            <h1 className="logo-kma">
              <span className="sr-only">KMA 대한의사협회</span>
            </h1>
          </Link>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`btn-lnb-toggle transition-all duration-300 flex-shrink-0 ${!isExpanded && 'mx-auto'}`}
          >
            <span className="sr-only">{isExpanded ? '사이드바 닫기' : '사이드바 열기'}</span>
          </button>
        </div>

        <div className="flex flex-col flex-1 min-h-0 px-4">
          {renderHistorySection(isExpanded)}
        </div>

        {renderProfile(isExpanded)}
      </aside>

      {/* 모바일 오버레이 LNB */}
      <div className={`fixed inset-0 z-40 md:hidden ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <button
          type="button"
          aria-label="메뉴 닫기 오버레이"
          onClick={onMobileClose}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <aside
          className={`kma-lnb-wrap relative flex h-full w-[86%] max-w-[290px] flex-col bg-[#f8f9fc] shadow-2xl transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={LNB_BACKGROUND_STYLE}
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
            {renderHistorySection(true, false, true)}
          </div>

          {renderProfile(true)}
        </aside>
      </div>
    </>
  );
};
