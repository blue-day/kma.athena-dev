import editIcon from '@/shared/assets/images/icon-side-list.png';

export function ConversationSummaryHeader() {
  return (
    <div className="sticky top-0 z-20 bg-white/95 px-4 py-[9px]">
      <div className="flex items-center">
        <span className="inline-flex h-7 shrink-0 justify-center items-center py-[5px] px-2.5 text-sm rounded-md bg-[#eae7ff] mr-4">
          협회자료 검색
        </span>
        <div className="min-w-0 flex-1 flex items-center">
          <p
            className="truncate text-sm mr-1 bg-left0 bg-no-repeat bg-[length:20px_20px] pl-[26px] leading-5"
            style={{ backgroundImage: `url(${editIcon.src})` }}
          >
            성분명 처방에 대한 의협의 공식 입장은 어때?
          </p>
          <button
            type="button"
            className="btn-title-edit shrink-0 transition-colors hover:bg-[#ebf3fd]"
          >
            <span className="sr-only">수정</span>
          </button>
        </div>
      </div>
    </div>
  );
}
