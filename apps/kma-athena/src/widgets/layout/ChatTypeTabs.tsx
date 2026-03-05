'use client';

interface ChatTypeTabsProps {
  tabs: Array<{
    key: string;
    label: string;
  }>;
  activeTab: string;
  onChange: (tabKey: string) => void;
}

export const ChatTypeTabs = ({ tabs, activeTab, onChange }: ChatTypeTabsProps) => {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.key === activeTab),
  );

  return (
    <nav className="relative flex h-full items-end" aria-label="챗봇 타입 탭">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`relative min-h-12 w-[140px] pb-[11px] text-base text-[14px] transition-colors ${
              isActive ? 'font-semibold text-[#2a3b56]' : 'text-[#7f8da3] hover:text-[#2a3b56]'
            }`}
          >
            {tab.label}
          </button>
        );
      })}

      <span
        className="pointer-events-none absolute bottom-0 left-0 h-1 w-[140px] bg-primary transition-transform duration-300 ease-out"
        style={{ transform: `translateX(${activeIndex * 140}px)` }}
      />
    </nav>
  );
};
