'use client';

import { useState } from 'react';
import { ChatLayout } from '@/widgets/layout/ChatLayout';
import { ExpandableSearchArea } from '@/shared/common/ui/ExpandableSearchArea';
import { ScrollableFilterTabs } from '@/shared/common/ui/ScrollableFilterTabs';

const ARCHIVE_FILTER_OPTIONS = ['전체', '일반 챗봇', 'KMA 내부 지식 챗봇', '나만의 비서'] as const;

type ArchiveItem = {
  id: number;
  botType: string;
  title: string;
  createdAt: string;
  archivedAt: string;
  prefix?: string;
  isExpired?: boolean;
};

const ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    id: 1,
    botType: '일반 챗봇',
    title: '의대증원 수급추계위에서 제시하고 있는 추계방법론은 어떤게 있나요?',
    createdAt: '2026.03.08',
    archivedAt: '2026.03.10',
  },
  {
    id: 2,
    botType: 'KMA 내부 지식 챗봇',
    prefix: '[협회 자료 검색]',
    title: '의협은 관리급여에 대해 어떻게 대처하고 있나요?',
    createdAt: '2026.03.08',
    archivedAt: '2026.03.10',
    isExpired: true,
  },
  {
    id: 3,
    botType: '일반 챗봇',
    prefix: '[베테랑 의협 사무국장]',
    title: '의협은 관리급여에 대해 어떻게 대처하고 있나요?',
    createdAt: '2026.03.08',
    archivedAt: '2026.03.10',
  },
  {
    id: 4,
    botType: '일반 챗봇',
    title: '의대증원 수급추계위에서 제시하고 있는 추계방법론은 어떤게 있나요?',
    createdAt: '2026.03.08',
    archivedAt: '2026.03.10',
  },
  {
    id: 5,
    botType: 'KMA 내부 지식 챗봇',
    prefix: '[협회 자료 검색]',
    title: '의협은 관리급여에 대해 어떻게 대처하고 있나요?',
    createdAt: '2026.03.08',
    archivedAt: '2026.03.10',
    isExpired: true,
  },
];

export function ChatArchivePage() {
  const [selectedFilter, setSelectedFilter] = useState<(typeof ARCHIVE_FILTER_OPTIONS)[number]>(
    ARCHIVE_FILTER_OPTIONS[0],
  );
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredArchiveItems =
    selectedFilter === '전체'
      ? ARCHIVE_ITEMS
      : ARCHIVE_ITEMS.filter((item) => item.botType === selectedFilter);

  const handleToggleArchiveItem = (id: number) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  return (
    <section className="relative z-10 mx-auto flex h-full w-full flex-col">
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 md:px-2.5">
        <div className="max-w-[900px] md:px-6 mx-auto pb-8 md:pb-12">
          <div className="sticky top-0 z-10 pt-4 md:pt-10 pb-2.5 md:pb-4 flex md:flex-row flex-col items-center justify-between gap-2.5 md:gap-5 mx-[-16px] md:mx-0 bg-[var(--kma-white-content)]">
            <ScrollableFilterTabs
              options={ARCHIVE_FILTER_OPTIONS}
              selectedOption={selectedFilter}
              onChange={setSelectedFilter}
              ariaLabel="보관함 챗봇 필터"
            />

            <ExpandableSearchArea />
          </div>

          <div className="flex items-center pt-4 pb-2 md:pt-4">
            <strong className="inline-block mr-2.5 text-2xl font-bold">보관함</strong>
            <span className="inline-block text-sm font-medium">
              총 <em className="text-primary">{filteredArchiveItems.length}</em> 건
            </span>
          </div>

          {filteredArchiveItems.length > 0 ? (
            <ul className="archive-list divide-y divide-gray-border border-t border-gray-border">
              {filteredArchiveItems.map((item) => (
                <li key={item.id} className="relative py-5 md:py-4">
                  <div className="flex flex-col items-start w-full">
                    <span className="inline-block mb-2.5 rounded-md bg-[var(--kma-badge-03)] px-2.5 text-sm leading-7">
                      {item.botType}
                    </span>

                    <button
                      type="button"
                      className={`${expandedId === item.id ? 'open' : ''} w-full text-left font-bold leading-[1.38] line-clamp-2 md:truncate mb-2.5`}
                      onClick={() => handleToggleArchiveItem(item.id)}
                      aria-expanded={expandedId === item.id}
                      aria-label={`보관 대화 내용 ${expandedId === item.id ? '닫기' : '펼치기'}: ${item.title}`}
                    >
                      {item.prefix ? (
                        <em className="inline-block text-primary mr-2.5 leading-[1.38]">{item.prefix}</em>
                      ) : null}
                      {item.title}
                    </button>

                    <div
                      className={`grid w-full transition-all duration-300 ease-in-out ${expandedId === item.id ? 'grid-rows-[1fr] opacity-100 mb-2.5' : 'grid-rows-[0fr] opacity-0 mt-0'
                        }`}
                    >
                      <div className="overflow-hidden">
                        <div className="py-1">
                          <div className="ai-answer-wrap !p-0">
                            <p>답변내용이 들어갑니다.</p>

                            <ul>
                              <li>리스트1</li>
                              <li>리스트2</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <span className="flex flex-col gap-0.5 text-sm leading-[1.29]">
                      <span className="block">
                        <span className="mr-2.5 inline-block text-gray-300">생성일</span>
                        {item.createdAt}
                      </span>
                      <span className="block">
                        <span className="mr-2.5 inline-block text-gray-300">보관일</span>
                        {item.archivedAt}
                        {item.isExpired ? <em className="ml-2.5 text-[#f35167]">(보관일 만료)</em> : null}
                      </span>
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn-archive-del absolute right-0 top-2 w-6 h-9"
                    aria-label="보관 항목 삭제"
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <span className="sr-only">보관 항목 삭제</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="nodata-box flex flex-col md:min-h-[470px] pt-[120px] md:pt-[200px] items-center gap-1 md:gap-2.5">
              <p className="pt-[96px] md:pt-[120px] md:text-xl font-medium">검색 결과가 없습니다.</p>
              <span className="text-sm text-gray-300">새로운 항목을 추가해 보세요.</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
