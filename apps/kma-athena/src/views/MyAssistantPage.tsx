'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper';
import { Pagination } from 'swiper/modules';
import { ChatLayout } from '@/widgets/layout/ChatLayout';
import { CreateAssistantContent } from '../features/chat/ui/CreateAssistantContent';
import { ChatWelcomeHero } from '@/features/chat/ui/ChatWelcomeHero';
import { CommonBottomSheet } from '@/shared/ui/CommonBottomSheet';
import { CommonPopup } from '@/shared/ui/CommonPopup';
import 'swiper/css';
import 'swiper/css/pagination';

interface AssistantCard {
  id: string;
  title: string;
}

interface SlideCardCreate {
  kind: 'create';
}

interface SlideCardAssistant {
  kind: 'assistant';
  assistant: AssistantCard;
}

type SlideCard = SlideCardCreate | SlideCardAssistant;

const CONVERSATION_ROUTE = '/chat/conversation?source=my-assistant';
const MOBILE_CARDS_PER_SLIDE = 4;
const MOCK_ASSISTANTS: AssistantCard[] = [
  { id: 'assistant-1', title: '지식 아카이브 매니저' },
  { id: 'assistant-2', title: '베테랑 의협 사무국장' },
  { id: 'assistant-3', title: '스마트한 세무 컨설턴트' },
  { id: 'assistant-4', title: '청구코드 점검 비서' },
  { id: 'assistant-5', title: '학회자료 정리 비서' },
];

const chunkCards = (cards: SlideCard[], size: number): SlideCard[][] => {
  const pages: SlideCard[][] = [];

  for (let index = 0; index < cards.length; index += size) {
    pages.push(cards.slice(index, index + size));
  }

  return pages;
};

export function MyAssistantPage() {
  const router = useRouter();
  const desktopSwiperRef = useRef<SwiperInstance | null>(null);
  const [isDesktopSwiperReady, setIsDesktopSwiperReady] = useState(false);
  const [isSwiperAreaVisible, setIsSwiperAreaVisible] = useState(false);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [isCreateBottomSheetOpen, setIsCreateBottomSheetOpen] = useState(false);
  const assistants = MOCK_ASSISTANTS;
  const hasAssistants = assistants.length > 0;

  const slideCards = useMemo(() => {
    const assistantCards: SlideCard[] = assistants.map((assistant) => ({
      kind: 'assistant',
      assistant,
    }));
    return [{ kind: 'create' } as SlideCardCreate, ...assistantCards];
  }, [assistants]);
  const mobileSlidePages = useMemo(
    () => chunkCards(slideCards, MOBILE_CARDS_PER_SLIDE),
    [slideCards],
  );

  const shouldLoopDesktop = slideCards.length > 4;
  const shouldLoopMobile = mobileSlidePages.length > 1;
  const shouldShowDesktopNavigation = slideCards.length > 4;
  const shouldCenterDesktopCards = assistants.length + 1 <= 4;
  const hasFiveOrMoreSlides = slideCards.length >= 5;

  useEffect(() => {
    if (!hasAssistants) {
      setIsSwiperAreaVisible(false);
      return;
    }

    const rafId = window.requestAnimationFrame(() => {
      setIsSwiperAreaVisible(true);
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [hasAssistants]);

  const handleCreateClick = () => {
    if (typeof window === 'undefined') {
      return;
    }

    if (window.matchMedia('(min-width: 768px)').matches) {
      setIsCreatePopupOpen(true);
      return;
    }

    setIsCreateBottomSheetOpen(true);
  };

  const handleAssistantClick = (assistantId: string) => {
    router.push(`${CONVERSATION_ROUTE}&conversationId=${assistantId}`);
  };

  const handleCloseCreatePopup = () => {
    setIsCreatePopupOpen(false);
  };

  const handleCloseCreateBottomSheet = () => {
    setIsCreateBottomSheetOpen(false);
  };

  const renderCard = (card: SlideCard) => {
    if (card.kind === 'create') {
      return (
        <button
          type="button"
          onClick={handleCreateClick}
          className="btn-assistant-create w-full min-h-[102px] md:min-h-[240px] rounded-2xl md:rounded-[24px] border border-gray-border bg-white p-4"
        >
          <strong className="text-sm md:text-base font-semibold">만들기</strong>
        </button>
      );
    }

    return (
      <article className="relative flex flex-col w-full min-h-[102px] md:min-h-[240px] rounded-2xl md:rounded-[24px] border border-gray-border bg-white md:px-2 pb-4 md:pb-[26px]">
        <button type="button" className="btn-assistant flex md:justify-center w-full flex-1 px-4 pl-[82px] pt-6 pb-10 md:pt-[122px] md:pb-0 md:px-4" onClick={() => handleAssistantClick(card.assistant.id)}>
          <strong className="block text-[15px] md:text-base font-semibold break-keep">{card.assistant.title}</strong>
        </button>
        <div className="mt-4 flex justify-center gap-1.5 absolute bottom-4 right-4 md:static z-10">
          <button
            type="button"
            className="min-w-[70px] md:min-w-20 h-[30px] md:h-8 rounded-full border border-[#d5dbe2] bg-white px-4 text-sm font-medium"
          >
            편집
          </button>
          <button
            type="button"
            className="min-w-[70px] md:min-w-20 h-[30px] md:h-8 rounded-full border border-[#d5dbe2] bg-white px-4 text-sm font-medium"
          >
            삭제
          </button>
        </div>
      </article>
    );
  };

  return (
    <ChatLayout showHelp>
      {/* 페이지 배경/스크롤 영역 */}
      <section className="relative z-10 mx-auto flex h-full w-full flex-col bg-kma-deco">
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 md:px-2.5">
          <div className={`flex flex-col items-center ${hasAssistants ? 'pt-[30px]' : 'pt-[100px]'} md:pt-[220px] pb-10 md:px-12`}>
            {/* 상단 인사/설명 영역 */}
            <ChatWelcomeHero
              subtitle={
                <>
                  참고할 자료를 업로드하고
                  <br className="md:hidden" />
                  {' '}
                  AI 역할을 설정하면 나만의 비서가 됩니다.
                </>
              }
            />

            {hasAssistants ? (
              /* Filled State: 생성 카드 + 비서 카드 슬라이드 */
              <section
                className={`mt-5 md:mt-[34px] w-full max-w-[1224px] ${
                  isSwiperAreaVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
              >
                <div className="relative">
                  {/* 데스크톱 전용 이전/다음 버튼 */}
                  {shouldShowDesktopNavigation && (
                    <>
                      <button
                        type="button"
                        onClick={() => desktopSwiperRef.current?.slidePrev()}
                        className={`btn-assistant-prev absolute -left-[50px] top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 transition-opacity md:flex ${
                          isDesktopSwiperReady ? 'opacity-100' : 'pointer-events-none opacity-0'
                        }`}
                        aria-label="이전 슬라이드"
                      >
                        <span className="sr-only">이전 슬라이드</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => desktopSwiperRef.current?.slideNext()}
                        className={`btn-assistant-next absolute -right-[50px] top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 transition-opacity md:flex ${
                          isDesktopSwiperReady ? 'opacity-100' : 'pointer-events-none opacity-0'
                        }`}
                        aria-label="다음 슬라이드"
                      >
                        <span className="sr-only">다음 슬라이드</span>
                      </button>
                    </>
                  )}

                  <div>
                    {/* PC: 1행 4열 카드 슬라이드 */}
                    <div className={`my-assistant-swiper-wrapper--pc hidden transition-opacity md:block ${isDesktopSwiperReady ? 'opacity-100' : 'opacity-0'}`}>
                      <Swiper
                        modules={[Pagination]}
                        onSwiper={(swiper: SwiperInstance) => {
                          desktopSwiperRef.current = swiper;
                          setIsDesktopSwiperReady(true);
                        }}
                        loop={shouldLoopDesktop}
                        speed={360}
                        spaceBetween={hasFiveOrMoreSlides ? 8 : 0}
                        slidesPerView="auto"
                        slidesPerGroup={1}
                        centerInsufficientSlides={shouldCenterDesktopCards}
                        pagination={{
                          el: '.my-assistant-swiper-pagination-desktop',
                          clickable: true,
                        }}
                        className={`my-assistant-swiper${hasFiveOrMoreSlides ? ' my-assistant-swiper--five-plus' : ''}`}
                      >
                        {slideCards.map((card: SlideCard, cardIndex: number) => (
                          <SwiperSlide key={`my-assistant-card-${cardIndex}`} className="h-auto">
                            <div className="w-full">{renderCard(card)}</div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>

                    {/* Mobile: 4행 1열 카드 슬라이드 */}
                    <div className="md:hidden">
                      <Swiper
                        modules={[Pagination]}
                        loop={shouldLoopMobile}
                        speed={360}
                        spaceBetween={8}
                        slidesPerView={1}
                        slidesPerGroup={1}
                        pagination={{
                          el: '.my-assistant-swiper-pagination-mobile',
                          clickable: true,
                        }}
                        className="my-assistant-swiper"
                      >
                        {mobileSlidePages.map((pageCards: SlideCard[], pageIndex: number) => (
                          <SwiperSlide key={`my-assistant-mobile-page-${pageIndex}`} className="h-auto">
                            <div className="flex flex-col gap-1.5 bg-[#f7faff] p-1.5 rounded-[20px]">
                              {pageCards.map((card: SlideCard, cardIndex: number) => (
                                <div key={`my-assistant-mobile-card-${pageIndex}-${cardIndex}`}>{renderCard(card)}</div>
                              ))}
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                </div>

                {/* 페이지네이션 (PC/Mobile 분리) */}
                <div className="my-assistant-swiper-pagination-mobile mt-5 flex justify-center md:hidden" />
                <div className="my-assistant-swiper-pagination-desktop mt-5 hidden justify-center md:flex" />
              </section>
            ) : (
              /* Empty State: 생성 버튼만 노출 */
              <section className="">
                <div className="assistant-init-wrap">
                  <button
                    type="button"
                    onClick={handleCreateClick}
                    className="w-[170px] h-[46px] rounded-[55px] border border-[#d5dbe2] bg-[#fff]"
                  >
                    <span className="text-sm font-medium">나만의 비서 만들기</span>
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      </section>

      <CommonPopup
        open={isCreatePopupOpen}
        variant="custom"
        title="나만의 비서 만들기"
        popupWidth={830}
        content={<CreateAssistantContent />}
        onClose={handleCloseCreatePopup}
        onConfirm={handleCloseCreatePopup}
        confirmText="저장"
        confirmDisabled
      />

      <CommonBottomSheet
        open={isCreateBottomSheetOpen}
        onClose={handleCloseCreateBottomSheet}
        title="나만의 비서 만들기"
        footer={(
          <div className="btn-wrap">
            <button
              type="button"
              className="btn-txt secondary w-full"
              onClick={handleCloseCreateBottomSheet}
            >
              취소
            </button>
            <button
              type="button"
              className="btn-txt primary w-full"
              disabled
            >
              저장
            </button>
          </div>
        )}
      >
        <CreateAssistantContent />
      </CommonBottomSheet>
    </ChatLayout>
  );
}
