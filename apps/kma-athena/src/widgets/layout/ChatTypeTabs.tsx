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
  const tabButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ x: 0, width: 0 });
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
      const x = buttonLeft - navLeft;

      setIndicatorStyle({ x, width });

      if (!isIndicatorReady) {
        animationFrameId = window.requestAnimationFrame(() => {
          setIsIndicatorReady(true);
        });
      }
    };

    updateIndicator();

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
