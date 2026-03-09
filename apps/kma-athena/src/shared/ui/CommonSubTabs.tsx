'use client';

type CommonSubTabsItem = {
  key: string;
  label: string;
};

type CommonSubTabsProps = {
  tabs: CommonSubTabsItem[];
  activeTab: string;
  onChange: (tabKey: string) => void;
  ariaLabel?: string;
};

export function CommonSubTabs({
  tabs,
  activeTab,
  onChange,
  ariaLabel = '서브 탭',
}: CommonSubTabsProps) {
  return (
    <nav className="md:px-5 border-b border-gray-border" aria-label={ariaLabel}>
      <ul className="flex items-center">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <li key={tab.key}>
              <button
                type="button"
                onClick={() => onChange(tab.key)}
                className={`min-w-20 border-b-2 px-1 py-2 h-10 text-sm transition-font ${
                  isActive
                    ? 'border-primary font-semibold text-primary'
                    : 'border-transparent hover:font-semibold'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
