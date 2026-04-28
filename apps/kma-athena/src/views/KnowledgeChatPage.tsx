'use client';

import { useRouter } from 'next/navigation';
import { ChatWelcomeHero } from '@/features/chat/ui/ChatWelcomeHero';
import { DISABLED_KNOWLEDGE_ACTION_CARDS, ENABLED_KNOWLEDGE_ACTION_CARDS, KnowledgeActionCard, KnowledgeActionKey, knowledgeActionsCardList } from '@/entities/chat/config/knowledgeConfig';
import { ExpandedActionPanel } from '@/features/knowledge/ui/ExpandedActionPanel';
import { useKnowledgeTransition } from '@/features/knowledge/hooks/useKnowledgeTransition';
import { buildConversationRoute } from '@/entities/chat/lib/chatNavigation';
import { generateSessionId } from '@/entities/chat/lib/chatUtil';

interface ActionCardProps {
  title: string;
  description: string;
  className?: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

const ActionCard = ({
  title,
  description,
  className = '',
  isDisabled = false,
  isSelected = false,
  onClick,
}: ActionCardProps) => {
  const commonClassName =
    'w-[calc(100%-12px)] md:w-full md:max-w-[296px] md:min-h-[240px] rounded-2xl md:rounded-[24px] border border-gray-border ring-[6px] md:ring-8 ring-[var(--kma-card-border)] m-1.5 md:m-2 p-4 pl-[86px] md:p-[30px] md:pt-[126px] text-left md:text-center';
  const enabledClassName = 'transition-all duration-300 hover:-translate-y-0.5';
  const disabledClassName = 'cursor-not-allowed';
  const stateClassName = isDisabled ? disabledClassName : enabledClassName;
  const cardClassName = `${commonClassName} ${stateClassName} ${className}`;

  // 활성/비활성 모두 button으로 통일하고, 비활성은 disabled로 처리합니다.
  return (
    <button type="button" className={cardClassName} onClick={onClick} disabled={isDisabled}>
      <h3 className="md:text-xl font-bold leading-tight">{title}</h3>
      <p className="mt-1.5 md:mt-4 text-[13px] leading-[1.25] md:text-sm text-gray-300 whitespace-pre-line">{description}</p>
    </button>
  );
};

export function KnowledgeChatPage() {
  const router = useRouter();


  const handleSubmit = (message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }
    const conversationId = generateSessionId()

    router.push(buildConversationRoute(conversationId, 'knowledge'));
  };

  const { transitionPhase, selectedActionKey, selectedCard, handleActionCardClick } =
    useKnowledgeTransition();
  const hasSelection = selectedActionKey !== null;
  const isFading = transitionPhase === 'fading';
  const isExpanding = transitionPhase === 'expanding';
  const isExpanded = transitionPhase === 'expanded';
  const shouldHideOtherCards = isFading || isExpanding || isExpanded;

  const subtitle = selectedCard
    ? `"${selectedCard.title}" 을 하려고 하시는군요.`
    : '어떤 업무를 처리하고 싶으신가요?';

  const getCardBlockClassName = (cardKey: KnowledgeActionKey) => {
    const isSelected = selectedActionKey === cardKey;
    const widthClassName =
      hasSelection && isSelected && (isExpanding || isExpanded)
        ? 'w-full md:w-[980px]'
        : 'w-full md:w-[312px]';

    if (!hasSelection) return `${widthClassName} max-h-[500px]`;
    if (isSelected) return widthClassName;

    // 비선택 카드: 클릭 직후(isFading)부터 즉시 높이와 마진을 줄여 부드러운 슬라이드 유도
    return `${widthClassName} pointer-events-none opacity-0 max-h-0 !m-0 !p-0 overflow-hidden md:hidden`;
  };

  // 비활성 카드 그룹: 전환 도중에도 w-full을 유지하며 모바일에서 부드럽게 사라지도록 설정
  const disabledGroupClassName = shouldHideOtherCards
    ? 'w-full pointer-events-none opacity-0 max-h-0 !m-0 overflow-hidden md:hidden'
    : 'w-full md:w-[616px] rounded-2xl md:rounded-[28px] max-h-[500px] opacity-100';

  const renderEnabledCard = (card: KnowledgeActionCard) => {
    const isSelected = selectedActionKey === card.key;
    const shouldHideForPC = isExpanded && !isSelected;

    return (
      <div
        key={card.key}
        className={`transition-all ease-in-out duration-[580ms] ${getCardBlockClassName(card.key)} ${shouldHideForPC ? 'md:hidden' : ''}`}
      >
        {isSelected && transitionPhase !== 'idle' ? (
          <ExpandedActionPanel
            title={card.title}
            description={card.description}
            className={card.className}
            isExpandedStage={isExpanding || isExpanded}
            showPrompt={isExpanded}
            examplePrompts={card.examplePrompts}
            onSubmit={handleSubmit}
          />
        ) : (
          <ActionCard
            title={card.title}
            description={card.description}
            className={card.className}
            isDisabled={false}
            isSelected={isSelected}
            onClick={() => handleActionCardClick(card.key)}
          />
        )}
      </div>
    );
  };

  return (
    <section className="relative z-10 mx-auto flex h-full w-full flex-col bg-kma-deco">
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 md:px-2.5">
        <div className="flex flex-col items-center pt-[30px] md:pt-[220px] pb-10">
          <ChatWelcomeHero subtitle={subtitle} />

          <div className="category-card-wrap mt-5 md:mt-[34px] flex flex-wrap w-full items-start justify-center gap-1.5 md:gap-5">

            {ENABLED_KNOWLEDGE_ACTION_CARDS.map(renderEnabledCard)}

            {DISABLED_KNOWLEDGE_ACTION_CARDS.length > 0 && (
              <div className={`transition-all ease-in-out duration-[580ms] ${disabledGroupClassName}`}>
                <div className="relative grid grid-cols-1 md:grid-cols-2 after:pointer-events-none after:absolute after:inset-0 after:w-full after:rounded-3xl after:bg-white/40 after:content-[''] bg-[var(--kma-card-border)] rounded-3xl md:rounded-[28px] dark:after:bg-[#1e2a3b]/40">
                  {DISABLED_KNOWLEDGE_ACTION_CARDS.map((card) => (
                    <ActionCard
                      key={card.key}
                      title={card.title}
                      description={card.description}
                      className={card.className}
                      isDisabled
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
