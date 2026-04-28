'use client';

import { MouseEvent, useEffect, useRef, useState } from 'react';

type ScrollableFilterTabsProps<T extends string> = {
  options: readonly T[];
  selectedOption: T;
  onChange: (option: T) => void;
  ariaLabel?: string;
};

export function ScrollableFilterTabs<T extends string>({
  options,
  selectedOption,
  onChange,
  ariaLabel = '필터 목록',
}: ScrollableFilterTabsProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasHorizontalOverflow, setHasHorizontalOverflow] = useState(false);

  useEffect(() => {
    const scroller = scrollRef.current;

    if (!scroller) {
      return;
    }

    const updateOverflowState = () => {
      setHasHorizontalOverflow(scroller.scrollWidth > scroller.clientWidth + 1);
    };

    updateOverflowState();

    const resizeObserver = new ResizeObserver(updateOverflowState);
    resizeObserver.observe(scroller);

    const contentNode = scroller.firstElementChild;
    if (contentNode) {
      resizeObserver.observe(contentNode);
    }

    window.addEventListener('resize', updateOverflowState);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateOverflowState);
    };
  }, [options]);

  const handleOptionClick = (option: T, event: MouseEvent<HTMLButtonElement>) => {
    onChange(option);

    const scroller = scrollRef.current;
    const button = event.currentTarget;

    if (!scroller) {
      return;
    }

    const nextScrollLeft =
      button.offsetLeft - scroller.clientWidth / 2 + button.clientWidth / 2;

    scroller.scrollTo({
      left: Math.max(0, nextScrollLeft),
      behavior: 'smooth',
    });
  };

  return (
    <div className={`filter-scroll-wrap w-full md:w-auto ${hasHorizontalOverflow ? 'is-scrollable' : ''}`}>
      <div
        ref={scrollRef}
        className="filter-scroll-box overflow-x-auto px-4 md:overflow-visible md:px-0"
        aria-label={ariaLabel}
      >
        <ul className="flex w-max items-center gap-2 md:w-auto">
          {options.map((option) => {
            const isActive = selectedOption === option;

            return (
              <li key={option}>
                <button
                  type="button"
                  className={`rounded-full border border-[var(--kma-gray-button-border)] bg-[var(--kma-white-02)] px-4 leading-[34px] transition-colors ${
                    isActive ? 'border-primary bg-primary text-white' : ''
                  }`}
                  onClick={(event) => handleOptionClick(option, event)}
                  aria-pressed={isActive}
                >
                  {option}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
