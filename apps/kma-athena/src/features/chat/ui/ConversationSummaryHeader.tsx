import type { ConversationSummary } from '@/features/chat/model/conversation';

interface ConversationSummaryHeaderProps {
  summary: ConversationSummary;
  onEdit?: () => void;
}

export function ConversationSummaryHeader({
  summary,
  onEdit,
}: ConversationSummaryHeaderProps) {
  return (
    <div className="sticky top-0 z-20 border-b border-[#e5e7eb] bg-white/95 px-2.5 py-3 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[860px] items-center gap-2">
        <span className="inline-flex h-7 items-center rounded-md bg-[#eef3ff] px-2.5 text-xs font-medium text-[#1f3f92]">
          {summary.category}
        </span>
        <p className="min-w-0 flex-1 truncate text-sm text-[#334155]">{summary.title}</p>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-8 items-center rounded-md border border-[#d1d5db] px-2.5 text-xs text-[#374151] transition-colors hover:bg-[#f8fafc]"
        >
          수정
        </button>
      </div>
    </div>
  );
}
