'use client';

import { useRef, useMemo } from 'react';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper';
import { AssistantCard } from '@/features/assistant/ui/AssistantCard';

export interface AssistantCardItem {
  id: string;
  title: string;
}

interface SlideCardCreate {
  kind: 'create';
}

interface SlideCardAssistant {
  kind: 'assistant';
  assistant: AssistantCardItem;
}

type SlideCard = SlideCardCreate | SlideCardAssistant;

const MOBILE_CARDS_PER_SLIDE = 4;

const chunkCards = (cards: SlideCard[], size: number): SlideCard[][] => {
  const pages: SlideCard[][] = [];
  for (let index = 0; index < cards.length; index += size) {
    pages.push(cards.slice(index, index + size));
  }
  return pages;
};

interface AssistantCardCarouselProps {
  assistants: AssistantCardItem[];
  onCreateClick: () => void;
  onAssistantClick: (id: string, title: string) => void;
}

export function AssistantCardCarousel({ assistants, onCreateClick, onAssistantClick }: AssistantCardCarouselProps) {
  const desktopSwiperRef = useRef<SwiperInstance | null>(null);

  const slideCards = useMemo<SlideCard[]>(() => {
    const assistantCards: SlideCard[] = assistants.map((assistant) => ({
      kind: 'assistant',
      assistant,
    }));
    return [{ kind: 'create' }, ...assistantCards];
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

  const renderCard = (card: SlideCard) => {
    if (card.kind === 'create') {
      return <AssistantCard kind="create" onClick={onCreateClick} />;
    }
    return (
      <AssistantCard
        kind="assistant"
        id={card.assistant.id}
        title={card.assistant.title}
        onAssistantClick={onAssistantClick}
      />
    );
  };

  return (
    <section className="mt-5 md:mt-[34px] w-full max-w-[1224px]">
      <div className="relative [&:has(.swiper-initialized)_.btn-assistant-prev]:pointer-events-auto [&:has(.swiper-initialized)_.btn-assistant-prev]:opacity-100 [&:has(.swiper-initialized)_.btn-assistant-next]:pointer-events-auto [&:has(.swiper-initialized)_.btn-assistant-next]:opacity-100">
        {shouldShowDesktopNavigation && (
          <>
            <button
              type="button"
              onClick={() => desktopSwiperRef.current?.slidePrev()}
              className="btn-assistant-prev absolute -left-[50px] top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 transition-opacity md:flex pointer-events-none opacity-0"
              aria-label="이전 슬라이드"
            >
              <span className="sr-only">이전 슬라이드</span>
            </button>
            <button
              type="button"
              onClick={() => desktopSwiperRef.current?.slideNext()}
              className="btn-assistant-next absolute -right-[50px] top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 transition-opacity md:flex pointer-events-none opacity-0"
              aria-label="다음 슬라이드"
            >
              <span className="sr-only">다음 슬라이드</span>
            </button>
          </>
        )}

        <div>
          {/* PC: 1행 4열 카드 슬라이드 */}
          <div className="my-assistant-swiper-wrapper--pc hidden transition-opacity md:block opacity-0 [&:has(.swiper-initialized)]:opacity-100">
            <Swiper
              modules={[Pagination]}
              onSwiper={(swiper: SwiperInstance) => {
                desktopSwiperRef.current = swiper;
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
              {slideCards.map((card, cardIndex) => (
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
              {mobileSlidePages.map((pageCards, pageIndex) => (
                <SwiperSlide key={`my-assistant-mobile-page-${pageIndex}`} className="h-auto">
                  <div className="flex flex-col gap-1.5 bg-[var(--kma-card-border)] p-1.5 rounded-[20px]">
                    {pageCards.map((card, cardIndex) => (
                      <div key={`my-assistant-mobile-card-${pageIndex}-${cardIndex}`}>
                        {renderCard(card)}
                      </div>
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
  );
}
