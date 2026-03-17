'use client';

interface AttachmentPanelProps {
  onClose: () => void;
}

export const AttachmentPanel = ({ onClose }: AttachmentPanelProps) => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="p-4 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="btn-panel-close"
          title="첨부파일 패널 닫기"
          aria-label="첨부파일 패널 닫기"
        />
      </div>

      <AttachmentPanelContent />
      <div className="material-panel-footer">
        <AttachmentPanelDownloadButton />
      </div>
    </div>
  );
};

export const AttachmentPanelDownloadButton = () => {
  return (
    <div className="btn-wrap">
      <button type="button" className="btn-txt primary w-full ic-download">
        <span>전체 다운</span>
      </button>
    </div>
  );
};

export const AttachmentPanelContent = () => {
  return (
    <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pt-5 md:py-5  md:px-5">
      <section>
       <div className="flex items-center justify-between">
          <p className="pb-1.5 flex-1 text-sm font-bold">
            첨부 자료 <span className="iht text-primary">1</span>건
          </p>
        </div>
        <ol>
          <li className="flex items-center justify-between gap-2 pl-1">
            <p className="name min-w-0 truncate text-sm font-medium">
              <span className="mr-1">1.</span>
              진료 가이드라인_2026.pdf
            </p>
            <button type="button" className="btn-download transition-colors hover:bg-[#ebf3fd]">
              <span className="sr-only">다운로드</span>
            </button>
          </li>
        </ol>
      </section>
    </div>
  );
};


