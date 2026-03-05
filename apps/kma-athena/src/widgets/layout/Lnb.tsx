'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import defaultProfileIcon from '@/shared/assets/images/icon-profile.svg';

type LnbProps = {
  profileName?: string;
  profileTeam?: string;
  profileEmail?: string;
  profileImageUrl?: string;
};

/**
 * 전역 사이드바 (LNB)
 * - 펼쳐지거나 좁은 형태 유지 (버튼 토글 방식)
 */
export const Lnb = ({
  profileName = '홍길동',
  profileTeam = 'AI개발팀',
  profileEmail = 'sample@kma.or.kr',
  profileImageUrl,
}: LnbProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);
  const [profileSrc, setProfileSrc] = useState(profileImageUrl?.trim() || defaultProfileIcon.src);
  const isNavVisible = isExpanded && isHistoryVisible;

  useEffect(() => {
    setProfileSrc(profileImageUrl?.trim() || defaultProfileIcon.src);
  }, [profileImageUrl]);

  return (
    <aside
      className={`relative flex flex-col h-screen transition-all duration-300 ${
        isExpanded ? 'w-[320px]' : 'w-[84px]'
      }`}
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(191, 221, 255, 0) 80%, #bfddff), linear-gradient(to bottom, #f8f9fc, #f8f9fc)',
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

        {/* 토글 버튼: 펼쳐졌을 때는 우측, 닫혔을 때는 중앙(로고 자리) */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`btn-lnb-toggle transition-all duration-300 flex-shrink-0 ${!isExpanded && 'mx-auto'}`}
        >
          <span className="sr-only">{isExpanded ? '사이드바 닫기' : '사이드바 열기'}</span>
        </button>
      </div>

      <div className="flex flex-col flex-1 min-h-0 px-4">
        {/* (1) 새 채팅 버튼 (상단 고정 스타일) */}
        <div className="pb-5">
          <button className={`btn-new-chat ${
            isExpanded ? 'w-full' : 'close'
          }`}>
            <span className={`text-sm font-medium truncate ${isExpanded ? 'block opacity-100' : ' w-0 hidden opacity-0'}`}>새 채팅</span>
          </button>
        </div>

        {/* (2) 대화 기록 섹션 헤더 (전체 접기/펴기) */}
        <div className="py-1">
          <button 
            onClick={() => isExpanded && setIsHistoryVisible(!isHistoryVisible)}
            disabled={!isExpanded}
            className="flex items-center transition-all duration-300 text-left"
          >
            <span className={`btn-toggle-text truncate transition-opacity duration-300 ${isExpanded ? 'visible opacity-100' : 'invisible opacity-0'} ${isHistoryVisible ? '' : 'close'}`}>대화 기록</span>
          </button>
        </div>

        {/* (3) 대화 기록 리스트 (스크롤 영역) */}
        <nav className={`flex-1 overflow-y-auto space-y-[26px] pb-6 custom-scrollbar transition-opacity duration-300 ${
          isNavVisible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}>
          {/* 오늘 */}
          <div
            className={`space-y-2 transition-all duration-300 ${
              isNavVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: isNavVisible ? '60ms' : '0ms' }}
          >
            {isExpanded && <h3 className="px-[10px] py-[6px] text-[13px] text-gray-300">오늘</h3>}
            <div className="space-y-1.5">
              {[1, 2].map((i) => (
                <div key={`today-${i}`} className="btn-lnb-history">
                  <button className="title">
                    <span className="truncate text-sm font-medium">
                      오늘의 대화 제목 샘플 오늘의 대화 제목 샘플 오늘의 대화 제목 샘플{i}
                    </span>
                  </button>
                  <button className="delete-btn">
                    <span className="sr-only">삭제</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 어제 */}
          <div
            className={`transition-all duration-300 ${
              isNavVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: isNavVisible ? '130ms' : '0ms' }}
          >
            {isExpanded && <h3 className="px-[10px] py-[6px] text-[13px] text-gray-300">어제</h3>}
            <div className="space-y-1.5">
              {[1, 2].map((i) => (
                <div key={`yest-${i}`} className="btn-lnb-history">
                  <button className="title">
                    <span className="truncate text-sm font-medium">
                      어제의 대화 제목 샘플 {i}
                    </span>
                  </button>
                  <button className="delete-btn">
                    <span className="sr-only">삭제</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 이전 기록 */}
          <div
            className={`transition-all duration-300 ${
              isNavVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: isNavVisible ? '200ms' : '0ms' }}
          >
            {isExpanded && <h3 className="px-[10px] py-[6px] text-[13px] text-gray-300">4일 전</h3>}
            <div className="space-y-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={`prev-${i}`} className="btn-lnb-history">
                  <button className="title">
                    <span className="truncate text-sm font-medium">
                      오래된 대화 제목 샘플 {i}
                    </span>
                  </button>
                  <button className="delete-btn">
                    <span className="sr-only">삭제</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </nav>
      </div>

      <div className="h-[142px] self-stretch flex flex-col justify-center items-stretch bg-primary">
        <div className={`flex items-center gap-3 transition-padding duration-300 ${isExpanded ? 'px-[36px]' : 'p-4'}`}>
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
          {isExpanded && (
            <div className="min-w-0">
              <p className="truncate text-base leading-5 font-semibold text-white">
                {profileName} <span className="text-sm font-normal">({profileTeam})</span>
              </p>
              <p className="truncate text-sm leading-5 text-white">
                {profileEmail}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
