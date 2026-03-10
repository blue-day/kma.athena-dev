'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatPromptInput } from '@/features/chat/ui/ChatPromptInput';
import { ChatLayout } from '@/widgets/layout/ChatLayout';
import { ChatWelcomeHero } from '@/features/chat/ui/ChatWelcomeHero';

const CONVERSATION_ROUTE = '/chat/conversation?source=knowledge-chat';
// 1단계: 비선택 카드 fade-out, 2단계: 선택 카드 확장
const FADE_DURATION_MS = 180;
const EXPAND_DURATION_MS = 280;

type KnowledgeActionKey =
  | 'association-material'
  | 'board-material'
  | 'license-report'
  | 'credit-point';

interface KnowledgeActionCard {
  key: KnowledgeActionKey;
  title: string;
  description: string;
  isEnabled: boolean;
}

const KNOWLEDGE_ACTION_CARDS: KnowledgeActionCard[] = [
  {
    key: 'association-material',
    title: '협회 자료 검색',
    description: '지식 저장소 자료를 기반으로 검색할 수 있습니다.',
    isEnabled: true,
  },
  {
    key: 'board-material',
    title: '상임 이사회 자료 검색',
    description: '상임이사회 관련 내용을 검색할 수 있습니다.',
    isEnabled: true,
  },
  {
    key: 'license-report',
    title: '면허 신고',
    description: '준비중인 기능입니다.',
    isEnabled: false,
  },
  {
    key: 'credit-point',
    title: '연수 평점',
    description: '준비중인 기능입니다.',
    isEnabled: false,
  },
];

interface ActionCardProps {
  title: string;
  description: string;
  isDisabled?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

const ActionCard = ({ title, description, isDisabled = false, isSelected = false, onClick }: ActionCardProps) => {
  const baseClassName =
    'rounded-[28px] border border-[#dbe6f8] bg-white/80 px-6 py-7 text-center shadow-[0_16px_40px_-30px_rgba(43,127,255,0.7)]';
  const selectedClassName = isSelected
    ? 'min-h-[300px] md:min-h-[340px]'
    : 'min-h-[220px] hover:-translate-y-0.5 hover:border-[#c9dcff]';
  const disabledClassName = isDisabled ? 'cursor-not-allowed opacity-45' : '';
  const cardClassName = `${baseClassName} ${selectedClassName} ${disabledClassName} transition-all duration-300`;

  const iconPlaceholder = (
    <div className="mx-auto h-[84px] w-[84px] rounded-[26px] border border-[#d6e2f8] bg-gradient-to-br from-[#eef4ff] to-[#f7f9fd]" />
  );

  // 활성/비활성 모두 button으로 통일하고, 비활성은 disabled로 처리합니다.
  return (
    <button type="button" className={cardClassName} onClick={onClick} disabled={isDisabled}>
      {iconPlaceholder}
      <h3 className="mt-5 text-xl font-bold leading-tight">{title}</h3>
      <p className="mt-2 text-sm text-gray-300">{description}</p>
    </button>
  );
};

interface ExpandedActionPanelProps {
  title: string;
  description: string;
  isExpandedStage: boolean;
  showPrompt: boolean;
  onSubmit: (message: string) => void;
}

const ExpandedActionPanel = ({
  title,
  description,
  isExpandedStage,
  showPrompt,
  onSubmit,
}: ExpandedActionPanelProps) => {
  return (
    //확장된 카드 영역
    <div
      className={`rounded-[30px] border border-[#dbe6f8] bg-white/90 px-6 py-7 text-center shadow-[0_20px_55px_-35px_rgba(43,127,255,0.75)] transition-all duration-[280ms] ${
        isExpandedStage ? 'min-h-[460px] md:min-h-[500px]' : 'min-h-[220px]'
      }`}
    >
      <div className="mx-auto h-[84px] w-[84px] rounded-[26px] border border-[#d6e2f8] bg-gradient-to-br from-[#eef4ff] to-[#f7f9fd]" />
      <h3 className="mt-5 text-xl font-bold leading-tight">{title}</h3>
      <p className="mt-2 text-sm text-gray-300">{description}</p>

      {showPrompt && (
        <div className="mt-8 md:mt-10">
          <ChatPromptInput onSubmit={onSubmit} />
        </div>
      )}
    </div>
  );
};

type TransitionPhase = 'idle' | 'fading' | 'expanding' | 'expanded';

export function KnowledgeChatPage() {
  const router = useRouter();
  const [selectedActionKey, setSelectedActionKey] = useState<KnowledgeActionKey | null>(null);
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>('idle');

  useEffect(() => {
    // 선택 카드가 없거나 fading 단계가 아니면 아무 전이도 시작하지 않습니다.
    if (!selectedActionKey || transitionPhase !== 'fading') {
      return;
    }

    // 비선택 카드가 먼저 사라진 뒤 확장 단계로 넘어갑니다.
    const fadeTimer = window.setTimeout(() => {
      setTransitionPhase('expanding');
    }, FADE_DURATION_MS);

    return () => {
      window.clearTimeout(fadeTimer);
    };
  }, [selectedActionKey, transitionPhase]);

  useEffect(() => {
    // expanding 단계에서만 확장 완료 타이머를 동작시킵니다.
    if (transitionPhase !== 'expanding') {
      return;
    }

    // 선택 카드의 폭 확장 애니메이션 완료 시 입력창 노출 단계로 전환합니다.
    const expandTimer = window.setTimeout(() => {
      setTransitionPhase('expanded');
    }, EXPAND_DURATION_MS);

    return () => {
      window.clearTimeout(expandTimer);
    };
  }, [transitionPhase]);

  const selectedCard = useMemo(
    () => KNOWLEDGE_ACTION_CARDS.find((card) => card.key === selectedActionKey),
    [selectedActionKey],
  );

  const subtitle = selectedCard
    ? `"${selectedCard.title}" 을 하려고 하시는군요.`
    : '어떤 업무를 처리하고 싶으신가요?';

  const handleActionCardClick = (actionKey: KnowledgeActionKey) => {
    // 이미 선택됐거나 idle이 아니면 중복 클릭을 무시합니다.
    if (selectedActionKey || transitionPhase !== 'idle') {
      return;
    }

    setSelectedActionKey(actionKey);
    // 클릭 직후에는 카드 확장보다 비선택 카드 숨김을 우선 수행합니다.
    setTransitionPhase('fading');
  };

  const handleSubmit = (message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    router.push(CONVERSATION_ROUTE);
  };

  const firstEnabledCard = KNOWLEDGE_ACTION_CARDS[0];
  const secondEnabledCard = KNOWLEDGE_ACTION_CARDS[1];
  const disabledCards = KNOWLEDGE_ACTION_CARDS.slice(2);
  const hasSelection = selectedActionKey !== null;
  const isFading = transitionPhase === 'fading';
  const isExpanding = transitionPhase === 'expanding';
  const isExpanded = transitionPhase === 'expanded';
  const shouldHideOtherCards = isFading || isExpanding || isExpanded;

  const getCardBlockClassName = (cardKey: KnowledgeActionKey) => {
    const isSelected = selectedActionKey === cardKey;
    const widthClassName =
      hasSelection && isSelected && (isExpanding || isExpanded) ? 'w-full md:w-[980px]' : 'w-full md:w-[220px]';

    // 선택 전이거나 선택 카드인 경우: 본래/확장 폭만 적용합니다.
    if (!hasSelection || isSelected) {
      return widthClassName;
    }

    if (isFading) {
      // 1단계: 비선택 카드는 투명/축소 처리로 사라지는 느낌을 만듭니다.
      return `${widthClassName} pointer-events-none opacity-0 scale-[0.95]`;
    }

    // 2단계 이후: 레이아웃 간섭을 막기 위해 DOM은 유지하되 hidden 처리합니다.
    return `${widthClassName} pointer-events-none hidden`;
  };

  // 비활성 카드 그룹도 동일하게 fading에서는 보이며 사라지고, 이후에는 hidden 처리합니다.
  const disabledGroupClassName = shouldHideOtherCards
    ? isFading
      ? 'pointer-events-none w-full opacity-0 scale-[0.95] md:w-[460px]'
      : 'pointer-events-none hidden'
    : 'w-full md:w-[460px]';

  const renderEnabledCard = (card: KnowledgeActionCard) => {
    const isSelected = selectedActionKey === card.key;
    const shouldHide =
      isExpanded && selectedActionKey !== card.key;

    // 확장 완료 후 비선택 활성 카드는 DOM에서 제거합니다.
    if (shouldHide) {
      return null;
    }

    return (
      <div
        className={`transition-all ease-out ${
          isExpanding ? 'duration-[280ms]' : 'duration-[180ms]'
        } ${
          getCardBlockClassName(card.key)
        }`}
      >
        {/* 선택 직후부터는 버튼 대신 확장 전용 패널로 전환해 "영역 확장" 인상을 강화합니다. */}
        {isSelected && transitionPhase !== 'idle' ? (
          <ExpandedActionPanel
            title={card.title}
            description={card.description}
            isExpandedStage={isExpanding || isExpanded}
            showPrompt={isExpanded}
            onSubmit={handleSubmit}
          />
        ) : (
          <ActionCard
            title={card.title}
            description={card.description}
            isDisabled={false}
            isSelected={isSelected}
            onClick={() => handleActionCardClick(card.key)}
          />
        )}
      </div>
    );
  };

  return (
    <ChatLayout showHelp>
      <section className="relative z-10 mx-auto flex h-full w-full flex-col bg-kma-deco">
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 md:px-2.5">
          <div className="flex flex-col items-center pt-[100px] md:pt-[220px]">
            <ChatWelcomeHero subtitle={subtitle} />

            <div className="mt-8 flex w-full flex-wrap items-start justify-center gap-4 md:mt-10 md:gap-4">
              {renderEnabledCard(firstEnabledCard)}
              {renderEnabledCard(secondEnabledCard)}

              {!isExpanded && (
                <div
                  className={`transition-all ease-out ${
                    isFading ? 'duration-[180ms]' : 'duration-[280ms]'
                  } ${disabledGroupClassName}`}
                >
                  {/* 비활성 카드 2개는 하나의 그룹 div로 묶어 함께 전이합니다. */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-2">
                    {disabledCards.map((card) => (
                      <ActionCard
                        key={card.key}
                        title={card.title}
                        description={card.description}
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
    </ChatLayout>
  );
}
