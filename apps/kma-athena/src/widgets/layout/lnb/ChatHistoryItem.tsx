'use client';
/**
 * 대화방 개별 항목 + 삭제 클릭 처리
 */

type ChatHistoryItemProps = {
  title: string;
  category: string;
  isDeleting: boolean;
};

export function ChatHistoryItem({
  title,
  category,
  isDeleting,
}: ChatHistoryItemProps) {

  return (
    <div className={`btn-lnb-history ${category === 'general' ? 'general' : category === 'knowledge' ? 'knowledge' : 'assistant'}`}>
      <button
        type="button"
        className="title"
        disabled={isDeleting}
      >
        <span className="truncate text-sm font-medium">{title}</span>
      </button>

      <button
        type="button"
        className="delete-btn"
        disabled={isDeleting}
        aria-busy={isDeleting}
      >
        <span className="sr-only">삭제</span>
      </button>
    </div>
  );
}