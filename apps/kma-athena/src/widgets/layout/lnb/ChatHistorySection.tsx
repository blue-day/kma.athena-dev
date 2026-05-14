'use client';
/**
 * 사이드 메뉴 대화 목록 영역 렌더링
 * - useLnbHistory(Zustand/Apollo) 구독을 내부에서 처리해 Lnb 전체 리렌더와 격리
 */
import { memo } from 'react';
import { ChatHistoryItem } from './ChatHistoryItem';

type ChatHistorySectionProps = {
  expanded: boolean;
  isHistoryVisible: boolean;
  isDeletingAll: boolean;
  showThemeSwitch?: boolean;
  themeSwitchNode?: React.ReactNode;
  forceVisible?: boolean;
  onToggleVisible: () => void;
  onDeleteAll: () => void;
};

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

export const ChatHistorySection = memo(function ChatHistorySection({
  expanded,
  isHistoryVisible,
  isDeletingAll = false,
  showThemeSwitch = false,
  themeSwitchNode,
  forceVisible = false,
  onToggleVisible,
  onDeleteAll,
}: ChatHistorySectionProps) {
  const isNavSectionVisible = forceVisible || (expanded && isHistoryVisible);

  return (
    <>
      <div className="py-1.5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => expanded && onToggleVisible()}
          disabled={!expanded}
          className="flex items-center transition-all duration-300 text-left"
        >
          <span
            className={`btn-toggle-text truncate transition-opacity duration-300 ${expanded ? 'visible opacity-100' : 'invisible opacity-0'
              } ${isHistoryVisible ? '' : 'close'}`}
          >
            대화기록
          </span>
        </button>

        {isHistoryVisible ? (
          <button
            type="button"
            aria-busy={isDeletingAll}
            className={`btn-list-del mr-1.5 md:mr-2.5 transition-opacity flex-shrink-0 duration-300 ${expanded ? 'opacity-100' : 'opacity-0'
              }`}
            onClick={onDeleteAll}
          >
            전체삭제
          </button>
        ) : null}
      </div>

      <nav
        className={`wide px-2.5 md:px-4 flex-1 overflow-y-auto space-y-[26px] pb-6 custom-scrollbar transition-opacity duration-300 ${isNavSectionVisible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
      >
        {HISTORY_SECTIONS.map((section) => (
          <div
            key={section.key}
            className={`transition-all duration-300 ${isNavSectionVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: isNavSectionVisible ? section.transitionDelay : '0ms' }}
          >
            {expanded ? (
              <h3 className="px-1.5 md:px-[10px] py-[6px] text-[13px] text-gray-300">
                {section.title}
              </h3>
            ) : null}

            <div className="space-y-1.5">
              {section.items.map((item, index) => (
                <ChatHistoryItem
                  key={`${section.key}-${index}`}
                  title={item}
                  category={section.category}
                  isDeleting={false}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {showThemeSwitch ? themeSwitchNode ?? null : null}
    </>
  );
});
