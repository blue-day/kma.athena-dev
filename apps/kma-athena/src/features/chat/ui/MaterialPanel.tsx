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

const INTERNAL_DOCUMENTS = [
  { id: 'internal-1', name: '대한의사협회 협약서 20250101' },
  { id: 'internal-2', name: '업무 운영 가이드 20250215' },
];

const EXTERNAL_DOCUMENTS = [
  { id: 'external-1', name: '대한의사협회 협약서 20250101', href: '#' },
];

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
      <button type="button" className="btn-txt primary w-full ic-download">
        <span>전체 다운</span>
      </button>
    </div>
  );
};

export const MaterialPanelContent = () => {
  const [activeSubTab, setActiveSubTab] = useState<string>('internal');
  const internalCount = INTERNAL_DOCUMENTS.length;
  const externalCount = EXTERNAL_DOCUMENTS.length;

  return (
    <>
      <CommonSubTabs
        tabs={[...MATERIAL_SUB_TABS]}
        activeTab={activeSubTab}
        onChange={setActiveSubTab}
        ariaLabel="자료 서브 탭"
      />

      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pt-5 md:py-5  md:px-5">
        {activeSubTab === 'internal' ? (
          <section>
            <div className="flex items-center justify-between">
              <p className="py-1.5 flex-1 text-sm font-bold">
                <span className="iht text-primary">{internalCount}</span>건
              </p>
            </div>
            {internalCount === 0 ? (
              <div className="nodata-list-box flex flex-col pt-[120px] md:pt-[200px] items-center gap-1 md:gap-2.5">
                <p className="pt-[80px] text-sm text-gray-300">
                 내부 자료가 확인되지 않습니다.
                </p>
              </div>
            ) : (
              <ol>
                {INTERNAL_DOCUMENTS.map((document, index) => (
                  <li key={document.id} className="flex items-center justify-between gap-2 pl-1">
                    <p className="min-w-0 flex-1 truncate text-sm font-medium">
                      <span className="mr-1">{index + 1}.</span>
                      {document.name}
                    </p>
                    <button
                      type="button"
                      className="btn-download transition-colors hover:bg-[var(--kma-bg-hover)]"
                    >
                      <span className="sr-only">다운로드</span>
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </section>
        ) : (
          <section>
            <p className="py-1.5 text-sm font-bold">
              <span className="iht text-primary">{externalCount}</span>건
            </p>
            {externalCount === 0 ? (
              <div className="nodata-list-box flex flex-col pt-[120px] md:pt-[200px] items-center gap-1 md:gap-2.5">
              <p className="pt-[80px] text-sm text-gray-300">
               외부 자료가 확인되지 않습니다.
              </p>
            </div>
            ) : (
              <ol>
                {EXTERNAL_DOCUMENTS.map((document, index) => (
                  <li key={document.id} className="flex items-center justify-between gap-2 pl-1 py-2">
                    <a
                      href={document.href}
                      className="min-w-0 flex-1 truncate text-sm font-medium"
                    >
                      <span className="mr-1">{index + 1}.</span>
                      {document.name}
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </section>
        )}
      </div>
    </>
  );
};
