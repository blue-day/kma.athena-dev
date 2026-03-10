'use client';

import { useState } from 'react';
import { CommonSubTabs } from '@/shared/ui/CommonSubTabs';

interface MaterialPanelProps {
  onClose: () => void;
}

const MATERIAL_SUB_TABS = [
  { key: 'internal', label: '내부 문서' },
  { key: 'external', label: '외부 링크' },
] as const;

export const MaterialPanel = ({ onClose }: MaterialPanelProps) => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="p-4 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="btn-panel-close"
          title="자료 패널 닫기"
          aria-label="자료 패널 닫기"
        >
        </button>
      </div>

      <MaterialPanelContent />
      <div className="material-panel-footer">
        <MaterialPanelDownloadButton />
      </div>
    </div>
  );
};

export const MaterialPanelDownloadButton = () => {
  return (
    <div className="btn-wrap">
      <button type="button" className="btn-txt primary w-full">
        전체다운
      </button>
    </div>
  );
};

export const MaterialPanelContent = () => {
  const [activeSubTab, setActiveSubTab] = useState<string>('internal');

  return (
    <>
      <CommonSubTabs
        tabs={[...MATERIAL_SUB_TABS]}
        activeTab={activeSubTab}
        onChange={setActiveSubTab}
        ariaLabel="자료 서브 탭"
      />

      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto py-5 md:px-5">
        {activeSubTab === 'internal' ? (
          <section>
            <div className="flex items-center justify-between">
              <p className="py-1.5 flex-1 text-sm font-bold">
                <span className="iht text-primary">1</span>건
              </p>
            </div>
            <ol>
              <li className="flex items-center justify-between gap-2 pl-1">
                <p className="min-w-0 flex-1 truncate text-sm font-medium">
                  <span className="mr-1">1.</span>
                  대한의사협회 협약서 20250101
                </p>
                <button
                  type="button"
                  className="btn-download transition-colors hover:bg-[#ebf3fd]"
                >
                  <span className="sr-only">다운로드</span>
                </button>
              </li>
            </ol>
          </section>
        ) : (
          <section>
            <p className="py-1.5 text-sm font-bold">
              <span className="iht text-primary">1</span>건
            </p>
            <ol>
              <li className="flex items-center justify-between gap-2 pl-1 py-2">
                <a href="#" className="min-w-0 flex-1 truncate text-sm font-medium">
                  <span className="mr-1">1.</span>
                  대한의사협회 협약서 20250101
                </a>
              </li>
            </ol>
          </section>
        )}
      </div>
    </>
  );
};
