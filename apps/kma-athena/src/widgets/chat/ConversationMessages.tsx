import { CommonLoading } from '@/shared/common/ui/CommonLoading';
import { AssistantAnswerCard } from '@/features/chat/ui/AssistantAnswerCard';
import { ChatTabItem } from '@/entities/chat/config/chatTabConfig';

interface Props {
  conversation: ChatTabItem;
  onOpenMaterialPanel: (messageId: string) => void;
  onClickRecommendation?: (question: string) => void;
  onStorage?: (messageId: string) => void;
  isStorageLoading?: boolean;
  isLoading?: boolean;
}

export function ConversationMessages({
  conversation,
  onOpenMaterialPanel,
  onClickRecommendation,
  onStorage,
  isStorageLoading = false,
  isLoading = false,
}: Props) {
  // if (isLoading && conversation.messages.length === 0) {
  //   return <CommonLoading />;
  // }

  return (
    <div className="mx-auto flex w-full max-w-[852px] flex-col md:pt-6">
      <div className="chat-message-rise ml-auto max-w-[80%] rounded-[8px_0_8px_8px] bg-[var(--kma-badge-02)] px-3 py-2 text-sm leading-5 md:px-4 md:text-base md:leading-7">
        성분명 처방에 대한 협회의 공식 입장은 어때?
      </div>
      <AssistantAnswerCard onOpenMaterialPanel={() => onOpenMaterialPanel('material')} />
    </div>
  );
}
