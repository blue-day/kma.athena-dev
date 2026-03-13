'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper';
import { Grid, Pagination } from 'swiper/modules';
import { ChatLayout } from '@/widgets/layout/ChatLayout';
import { ChatWelcomeHero } from '@/features/chat/ui/ChatWelcomeHero';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface AssistantCard {
  id: string;
  title: string;
  updatedAt: string;
}

const CONVERSATION_ROUTE = '/chat/conversation?source=my-assistant';

// const CONVERSATION_CARDS: AssistantCard[] = [];

const CONVERSATION_CARDS: AssistantCard[] = [
  { id: 'assistant-1', title: '진료기록 요약 비서', updatedAt: '최근 대화 2시간 전' },
  { id: 'assistant-2', title: '의학논문 검색 비서', updatedAt: '최근 대화 1일 전' },
  { id: 'assistant-3', title: '환자응대 스크립트 비서', updatedAt: '최근 대화 3일 전' },
  { id: 'assistant-4', title: '청구코드 점검 비서', updatedAt: '최근 대화 1주 전' },
  { id: 'assistant-5', title: '학회자료 정리 비서', updatedAt: '최근 대화 2주 전' },
];

export function MyAssistantPage() {
  const router = useRouter();
  const [isSwiperReady, setIsSwiperReady] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const hasMyAssistant = CONVERSATION_CARDS.length > 0;
  const allCardIds = ['create', ...CONVERSATION_CARDS.map((card) => card.id)];
  const mobilePages = allCardIds.reduce<string[][]>((pages, cardId, index) => {
    const pageIndex = Math.floor(index / 4);
    if (!pages[pageIndex]) {
      pages[pageIndex] = [];
    }
    pages[pageIndex].push(cardId);
    return pages;
  }, []);

  const shouldLoop = isDesktop && allCardIds.length > 4;
  const shouldUseDesktopSwiper = isDesktop && allCardIds.length > 4;
  const shouldUseDesktopCenteredCards = isDesktop && allCardIds.length <= 4;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const syncDesktop = (event?: MediaQueryListEvent) => {
      setIsDesktop(event?.matches ?? mediaQuery.matches);
    };

    syncDesktop();
    mediaQuery.addEventListener('change', syncDesktop);

    return () => {
      mediaQuery.removeEventListener('change', syncDesktop);
    };
  }, []);

  const handleCreateClick = () => {
    // M-1 단계에서는 UI 구성만 수행하며, 팝업 연결은 후속 단계에서 처리합니다.
  };

  const handleConversationClick = (conversationId: string) => {
    router.push(`${CONVERSATION_ROUTE}&conversationId=${conversationId}`);
  };

  const getDesktopSwiperInstance = (): SwiperInstance | null => {
    if (typeof window === 'undefined') {
      return null;
    }

    const swiperElement = document.querySelector('.my-assistant-swiper') as
      | (HTMLElement & { swiper?: SwiperInstance })
      | null;

    return swiperElement?.swiper ?? null;
  };

  const renderCard = (cardId: string) => {
    if (cardId === 'create') {
      return (
        <button
          key="create-card"
          type="button"
          onClick={handleCreateClick}
          className="min-h-[240px] w-full rounded-2xl border border-gray-border bg-white p-4 transition-all md:min-h-[240px]"
        >
          <span className="text-sm font-semibold">만들기</span>
        </button>
      );
    }

    const conversation = CONVERSATION_CARDS.find((card) => card.id === cardId);

    if (!conversation) {
      return null;
    }

    return (
      <button
        key={conversation.id}
        type="button"
        onClick={() => handleConversationClick(conversation.id)}
        className="min-h-[132px] w-full rounded-2xl border border-gray-border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 md:min-h-[116px]"
      >
        <p className="text-sm font-bold text-gray-800 md:text-base">{conversation.title}</p>
        <p className="mt-2 text-xs text-gray-500 md:text-sm">{conversation.updatedAt}</p>
        <div className="mt-4 flex gap-2">
          <span className="rounded-md bg-[#eef3ff] px-2 py-1 text-[11px] text-gray-700">수정하기</span>
          <span className="rounded-md bg-[#fff1f1] px-2 py-1 text-[11px] text-gray-700">삭제하기</span>
        </div>
      </button>
    );
  };

  return (
    <ChatLayout showHelp>
      <section className="relative z-10 mx-auto flex h-full w-full flex-col bg-kma-deco">
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 md:px-2.5">
          <div className="flex flex-col items-center pt-[30px] md:pt-[220px] pb-10 md:px-10">
            <ChatWelcomeHero subtitle="참고할 자료를 업로드하고 AI 역할을 설정하면 나만의 비서가 됩니다." />

            <section className="w-full">
              {hasMyAssistant ? (
                <>
                  <div className="relative">
                    {/* 스와이프 컨테이너 좌/우 고정 이동 버튼 */}
                    {shouldUseDesktopSwiper && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            const swiper = getDesktopSwiperInstance();
                            swiper?.slidePrev();
                          }}
                          className={`my-assistant-swiper-prev absolute left-2 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-border bg-white text-base text-gray-700 shadow-sm md:flex ${
                            isSwiperReady ? 'opacity-100' : 'opacity-0'
                          }`}
                          aria-label="이전 페이지"
                        >
                          {'<'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const swiper = getDesktopSwiperInstance();
                            swiper?.slideNext();
                          }}
                          className={`my-assistant-swiper-next absolute right-2 top-1/2 z-30 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-border bg-white text-base text-gray-700 shadow-sm md:flex ${
                            isSwiperReady ? 'opacity-100' : 'opacity-0'
                          }`}
                          aria-label="다음 페이지"
                        >
                          {'>'}
                        </button>
                      </>
                    )}

                    {/* Swiper viewport */}
                    <div
                      className={`transform transition-all duration-500 ease-out bg-[#f7faff] rounded-[28px] p-2 ${
                        isSwiperReady ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                      }`}
                    >
                      {shouldUseDesktopSwiper ? (
                        <Swiper
                          modules={[Grid, Pagination]}
                          onSwiper={() => setIsSwiperReady(true)}
                          loop={shouldLoop}
                          speed={360}
                          spaceBetween={20}
                          centerInsufficientSlides={!shouldLoop}
                          pagination={{
                            el: '.my-assistant-swiper-pagination',
                            clickable: true,
                          }}
                          slidesPerView={4}
                          slidesPerGroup={1}
                          grid={{ rows: 1, fill: 'row' }}
                          className="my-assistant-swiper"
                        >
                          {allCardIds.map((cardId) => (
                            <SwiperSlide key={`my-assistant-slide-${cardId}`} className="h-auto">
                              {renderCard(cardId)}
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      ) : shouldUseDesktopCenteredCards ? (
                        <div className="flex flex-wrap justify-center gap-5 px-1 py-4">
                          {allCardIds.map((cardId) => (
                            <div
                              key={`my-assistant-desktop-card-${cardId}`}
                              className="w-full max-w-[240px] shrink-0 grow-0"
                            >
                              {renderCard(cardId)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Swiper
                          modules={[Pagination]}
                          onSwiper={() => setIsSwiperReady(true)}
                          speed={360}
                          spaceBetween={12}
                          watchOverflow
                          pagination={{
                            el: '.my-assistant-swiper-pagination',
                            clickable: true,
                          }}
                          slidesPerView={1}
                          slidesPerGroup={1}
                          className="my-assistant-swiper !py-4"
                        >
                          {mobilePages.map((pageCardIds, pageIndex) => (
                            <SwiperSlide key={`my-assistant-mobile-page-${pageIndex}`} className="h-auto">
                              <div className="flex flex-col gap-3">
                                {pageCardIds.map((cardId) => (
                                  <div key={`my-assistant-mobile-card-${cardId}`}>{renderCard(cardId)}</div>
                                ))}
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      )}
                    </div>
                  </div>

                  {/* 현재 스냅 위치 인디케이터 */}
                  {!shouldUseDesktopCenteredCards && (
                    <div className="my-assistant-swiper-pagination mt-4 flex justify-center" />
                  )}
                </>
              ) : (
                // 초기 진입 시 버튼 영역
                <div className="assistant-init-wrap">
                  <button
                    type="button"
                    onClick={handleCreateClick}
                    className="w-[170px] h-[46px] rounded-[55px] border border-[#d5dbe2] bg-[#fff]"
                  >
                    <span className="text-sm font-medium">나만의 비서 만들기</span>
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </section>
    </ChatLayout>
  );
}
