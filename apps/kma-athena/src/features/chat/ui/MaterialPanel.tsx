'use client';

import { useState } from 'react';
import { CommonSubTabs } from '@/shared/ui/CommonSubTabs';
import { CommonCheckbox } from '@/shared/ui/CommonCheckbox';

interface MaterialPanelProps {
  onClose: () => void;
}

const MATERIAL_SUB_TABS = [
  { key: 'internal', label: '내부 문서' },
  { key: 'external', label: '외부 링크' },
] as const;

const INTERNAL_DOCUMENTS = [
  { id: 'internal-1', name: '대한의사협회 협약서 20250101', status: 'completed' },
  { id: 'internal-2', name: '업무 운영 가이드 20250215', status: 'pending' },
];

const EXTERNAL_DOCUMENTS = [
  { id: 'external-1', name: '대한의사협회 협약서 20250101', href: '#' },
];

export const MaterialPanel = ({ onClose }: MaterialPanelProps) => {
  const [isSelectMode, setIsSelectMode] = useState(false);
  // 하단 푸터 노출 여부 제어를 위해 탭 상태를 부모로 끌어올림 (State Lifting)
  const [activeSubTab, setActiveSubTab] = useState<string>('internal');

  const toggleSelectMode = () => {
    setIsSelectMode((prev) => !prev);
  };

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

      <MaterialPanelContent
        isSelectMode={isSelectMode}
        activeSubTab={activeSubTab}
        onTabChange={setActiveSubTab}
      />
      {/* 내부 문서 탭일 때만 다운로드 버튼 영역 노출 */}
      {activeSubTab === 'internal' && (
        <div className="material-panel-footer">
          <MaterialPanelDownloadButton
            isSelectMode={isSelectMode}
            onToggleSelectMode={toggleSelectMode}
          />
        </div>
      )}
    </div>
  );
};

interface MaterialPanelDownloadButtonProps {
  isSelectMode: boolean;
  onToggleSelectMode: () => void;
}

export const MaterialPanelDownloadButton = ({
  isSelectMode,
  onToggleSelectMode,
}: MaterialPanelDownloadButtonProps) => {
  return (
    <div className="btn-wrap">
      <button
        type="button"
        className="btn-txt primary w-full ic-select-download "
        onClick={onToggleSelectMode}
        aria-pressed={isSelectMode}
      >
        <span>{isSelectMode ? '선택 다운로드 취소' : '선택 다운로드'}</span>
      </button>
      {
        isSelectMode ? (
          <button type="button" className="btn-txt primary w-full ic-download">
            <span>선택 다운로드</span>
          </button>
        ) : (
          <button type="button" className="btn-txt primary w-full ic-download">
            <span>전체 다운로드</span>
          </button>
        )
      }
    </div>
  );
};

interface MaterialPanelContentProps {
  isSelectMode: boolean;
  activeSubTab: string;
  onTabChange: (tab: string) => void;
}

export const MaterialPanelContent = ({
  isSelectMode,
  activeSubTab,
  onTabChange,
}: MaterialPanelContentProps) => {
  const internalCount = INTERNAL_DOCUMENTS.length;
  const externalCount = EXTERNAL_DOCUMENTS.length;

  return (
    <>
      <CommonSubTabs
        tabs={[...MATERIAL_SUB_TABS]}
        activeTab={activeSubTab}
        onChange={onTabChange}
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
                    <div className="min-w-0 flex flex-1 items-center gap-2">
                      {isSelectMode ? (
                        <CommonCheckbox
                          id={document.id}
                          aria-label={`${document.name} 선택`}
                        />
                      ) : null}
                      <p className="min-w-0 flex-1 truncate text-sm font-medium">
                        <span className="mr-1">{index + 1}.</span>
                        {document.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      className={`btn-download transition-colors ${
                        document.status === 'completed' ? 'completed' : ''
                      }`}
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
