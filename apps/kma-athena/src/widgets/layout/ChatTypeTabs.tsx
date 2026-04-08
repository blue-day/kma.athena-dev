'use client';

import { useLayoutEffect, useRef, useState } from 'react';

interface ChatTypeTabsProps {
  tabs: Array<{
    key: string;
    label: string;
    category: string;
  }>;
  activeTab: string;
  onChange: (tabKey: string) => void;
}

export const ChatTypeTabs = ({ tabs, activeTab, onChange }: ChatTypeTabsProps) => {
  const navRef = useRef<HTMLElement | null>(null);
  // 각 탭 버튼의 실측 위치/너비를 읽기 위해 ref를 배열로 관리
  const tabButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ x: 0, width: 0 });
  // 최초 위치 계산 전에는 transition을 끄고, 계산 후에만 애니메이션 활성화
  const [isIndicatorReady, setIsIndicatorReady] = useState(false);

  useLayoutEffect(() => {
    let animationFrameId: number | null = null;

    const updateIndicator = () => {
      const activeIndex = tabs.findIndex((tab) => tab.key === activeTab);
      if (activeIndex < 0) {
        return;
      }

      const activeButton = tabButtonRefs.current[activeIndex];
      const navElement = navRef.current;

      if (!activeButton || !navElement) {
        return;
      }

      const { left: navLeft } = navElement.getBoundingClientRect();
      const { left: buttonLeft, width } = activeButton.getBoundingClientRect();
      // nav 기준 상대 좌표로 변환해 인디케이터 시작점을 맞춘다
      const x = buttonLeft - navLeft;

      setIndicatorStyle({ x, width });

      if (!isIndicatorReady) {
        animationFrameId = window.requestAnimationFrame(() => {
          setIsIndicatorReady(true);
        });
      }
    };

    updateIndicator();

    // 탭 텍스트 길이/레이아웃 변경에도 인디케이터를 즉시 재계산
    const resizeObserver = new ResizeObserver(updateIndicator);
    if (navRef.current) {
      resizeObserver.observe(navRef.current);
    }
    tabButtonRefs.current.forEach((button) => {
      if (button) {
        resizeObserver.observe(button);
      }
    });

    window.addEventListener('resize', updateIndicator);
    return () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateIndicator);
    };
  }, [tabs, activeTab, isIndicatorReady]);

  return (
    <nav ref={navRef} className="chat-type-tabs relative flex h-full items-end" aria-label="챗봇 타입 탭">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.key;
        const categoryClass = tab.category === 'general' ? 'general' : tab.category === 'knowledge' ? 'knowledge' : 'assistant';
        return (
          <button
            key={tab.key}
            ref={(element) => {
              tabButtonRefs.current[index] = element;
            }}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`${categoryClass} relative min-h-12 min-w-[140px] pb-[11px] px-2`}
          >
            <span className={`inline-block pl-[26px] transition-font leading-[24px] ${isActive ? 'font-semibold' : 'hover:font-semibold'}`}>{tab.label}</span>
          </button>
        );
      })}

      <span
        className={`pointer-events-none absolute bottom-0 left-0 h-1 bg-primary ${isIndicatorReady ? 'duration-300 ease-out' : ''}`}
        style={{
          width: `${indicatorStyle.width}px`,
          transform: `translateX(${indicatorStyle.x}px)`,
          transitionProperty: isIndicatorReady ? 'transform, width' : 'none',
        }}
      />
    </nav>
  );
};
