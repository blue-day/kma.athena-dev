'use client';
import React, { useState } from 'react';
import Link from 'next/link';

/**
 * 전역 사이드바 (LNB)
 * - 펼쳐지거나 좁은 형태 유지 (버튼 토글 방식)
 */
export const Lnb = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHistoryVisible, setIsHistoryVisible] = useState(true);

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
        {/* 로고 영역: opacity와 visibility를 이용한 Fade 효과 */}
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
            <span className={`text-sm font-medium ${isExpanded ? 'block opacity-100' : ' w-0 hidden opacity-0'}`}>새 채팅</span>
          </button>
        </div>

        {/* (2) 대화 기록 섹션 헤더 (전체 접기/펴기) */}
        <div className="py-1">
          <button 
            onClick={() => isExpanded && setIsHistoryVisible(!isHistoryVisible)}
            disabled={!isExpanded}
            className="flex items-center transition-all duration-300 text-left"
          >
            {isExpanded && (
              <span className={`btn-toggle-text ${isHistoryVisible ? '' : 'close'}`}>대화 기록</span>
            )}
          </button>
        </div>

        {/* (3) 대화 기록 리스트 (스크롤 영역) */}
        <nav className={`flex-1 overflow-y-auto space-y-[26px] pb-6 custom-scrollbar transition-all duration-300 ${
          isExpanded && isHistoryVisible ? 'opacity-100 block' : 'opacity-0 hidden pointer-events-none'
        }`}>
          {/* 오늘 */}
          <div className="space-y-2">
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
          <div>
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
          <div>
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

      <div className="p-4 border-t border-gray-100">
        {/* 하단 설정/프로필 아이콘 */}
        <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto"></div>
      </div>
    </aside>
  );
};
