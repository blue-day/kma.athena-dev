'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatLayout } from '@/widgets/layout/ChatLayout';
import { ExpandableSearchArea } from '@/shared/ui/ExpandableSearchArea';
import { ScrollableFilterTabs } from '@/shared/ui/ScrollableFilterTabs';

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
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<(typeof ARCHIVE_FILTER_OPTIONS)[number]>(
    ARCHIVE_FILTER_OPTIONS[0],
  );
  const filteredArchiveItems =
    selectedFilter === '전체'
      ? ARCHIVE_ITEMS
      : ARCHIVE_ITEMS.filter((item) => item.botType === selectedFilter);
  const handleArchiveItemClick = (id: number) => {
    router.push(`/chat/conversation?archiveId=${id}`);
  };

  return (
    <ChatLayout contentBgClassName="">
      <section className="relative z-10 mx-auto flex h-full w-full flex-col">
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 md:px-2.5">
          <div className="max-w-[900px] md:px-6 mx-auto pb-8 md:pb-12">
            <div className="sticky top-0 z-10 pt-4 md:pt-10 pb-2.5 md:pb-4 flex md:flex-row flex-col items-center justify-between gap-2.5 md:gap-5 bg-white mx-[-16px] md:mx-0">
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
              <ul className="divide-y divide-gray-border border-t border-gray-border">
                {filteredArchiveItems.map((item) => (
                  <li key={item.id} className="relative py-5 md:py-4">
                    <button
                      type="button"
                      className="flex flex-col items-start w-full text-left gap-2.5"
                      onClick={() => handleArchiveItemClick(item.id)}
                      aria-label={`보관 대화 상세 이동: ${item.title}`}
                    >
                      <span className="inline-block rounded-md bg-[#deedff] px-2.5 text-sm leading-7">
                        {item.botType}
                      </span>

                      <span className="w-full font-bold leading-[1.38] line-clamp-2 md:truncate">
                        {item.prefix ? <em className="inline-block text-primary mr-2.5 leading-[1.38]">{item.prefix}</em> : null}
                        {item.title}
                      </span>

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
                    </button>

                    <button
                      type="button"
                      className="btn-archive-del absolute right-0 top-0 w-6 h-14"
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
                <p className="pt-[96px] md:pt-[120px] md:text-xl font-medium"
                  >검색 결과가 없습니다.</p>
                <span className="text-sm text-[#7f8394]">새로운 항목을 추가해 보세요.</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </ChatLayout>
  );
}
