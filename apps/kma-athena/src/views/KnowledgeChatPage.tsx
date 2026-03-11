'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatPromptInput } from '@/features/chat/ui/ChatPromptInput';
import { ChatLayout } from '@/widgets/layout/ChatLayout';
import { ChatWelcomeHero } from '@/features/chat/ui/ChatWelcomeHero';

const CONVERSATION_ROUTE = '/chat/conversation?source=knowledge-chat';
// 1단계: 비선택 카드 fade-out, 2단계: 선택 카드 확장
const FADE_DURATION_MS = 180;
const EXPAND_DURATION_MS = 580;

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
  className: string;
}

const KNOWLEDGE_ACTION_CARDS: KnowledgeActionCard[] = [
  {
    key: 'association-material',
    title: '협회 자료 검색',
    description: '지식 저장소 자료를 기반으로\n검색할 수 있습니다.',
    isEnabled: true,
    className: 'ic-association',
  },
  {
    key: 'board-material',
    title: '상임 이사회 자료 검색',
    description: '명입력란에 입력된 내용이 보여집니다.\n30자 제한 두세요.',
    isEnabled: true,
    className: 'ic-board',
  },
  {
    key: 'license-report',
    title: '면허 신고',
    description: '설명입력란에 입력된 내용이 보여집니다.\n30자 제한 두세요.',
    isEnabled: false,
    className: 'ic-license',
  },
  {
    key: 'credit-point',
    title: '연수 평점',
    description: '명입력란에 입력된 내용이 보여집니다.\n30자 제한 두세요.',
    isEnabled: false,
    className: 'ic-credit',
  },
];

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
    'w-[calc(100%-12px)] md:max-w-[296px] md:min-h-[240px] rounded-2xl md:rounded-[24px] border border-gray-border ring-[6px] md:ring-8 ring-[#f7faff] m-1.5 md:m-2 p-4 pl-[86px] md:p-[30px] md:pt-[126px] text-left md:text-center bg-white';
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

interface ExpandedActionPanelProps {
  title: string;
  description: string;
  className?: string;
  isExpandedStage: boolean;
  showPrompt: boolean;
  onSubmit: (message: string) => void;
}

const ExpandedActionPanel = ({
  title,
  description,
  className = '',
  isExpandedStage,
  showPrompt,
  onSubmit,
}: ExpandedActionPanelProps) => {
  return (
    //확장된 카드 영역
    <div
      className={`pt-[108px] px-2.5 pb-[34px] rounded-[24px] border border-gray-border bg-white md:p-[30px] md:pt-[126px] text-center transition-all duration-[680ms] ${className} ${
        isExpandedStage ? 'min-h-[350px] md:min-h-[414px] md:rounded-[50px]' : 'min-h-[100px] ring-[6px] md:ring-8 ring-[#f7faff]'
      }`}
    >
      <h3 className="text-base md:text-xl font-bold leading-tight">{title}</h3>
      <p className="mt-1.5 md:mt-4 text-xs md:text-[13px] leading-[1.25] md:text-sm text-gray-300">{description}</p>

      {showPrompt && (
        <div className="mt-10 md:mt-9">
          <ChatPromptInput
            onSubmit={onSubmit}
            docked
            animateOnMount
            placeholder="질문 예시: 의대증원 수급추계위에서 제시하고 있는 방법론을 요약줘"
          />
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
      hasSelection && isSelected && (isExpanding || isExpanded) ? 'w-full md:w-[980px]' : 'w-full md:w-[296px]';

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
      ? 'pointer-events-none w-full opacity-0 scale-[0.95] md:w-[600px]'
      : 'pointer-events-none hidden'
    : 'w-full md:w-[600px] bg-[#f7faff] rounded-2xl md:rounded-[28px]';

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
          isExpanding ? 'duration-[180ms]' : 'duration-[280ms]'
        } ${
          getCardBlockClassName(card.key)
        }`}
      >
        {/* 선택 직후부터는 버튼 대신 확장 전용 패널로 전환해 "영역 확장" 인상을 강화합니다. */}
        {isSelected && transitionPhase !== 'idle' ? (
          <ExpandedActionPanel
            title={card.title}
            description={card.description}
            className={card.className}
            isExpandedStage={isExpanding || isExpanded}
            showPrompt={isExpanded}
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
    <ChatLayout showHelp>
      <section className="relative z-10 mx-auto flex h-full w-full flex-col bg-kma-deco">
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 md:px-2.5">
          <div className="flex flex-col items-center pt-[30px] md:pt-[220px] pb-10">
            <ChatWelcomeHero subtitle={subtitle} />

            <div className="category-card-wrap mt-5 md:mt-[34px] flex flex-wrap w-full items-start justify-center gap-1.5 md:gap-9">
              {renderEnabledCard(firstEnabledCard)}
              {renderEnabledCard(secondEnabledCard)}

              {!isExpanded && (
                <div
                  className={`transition-all ease-out ${
                    isFading ? 'duration-[180ms]' : 'duration-[280ms]'
                  } ${disabledGroupClassName}`}
                >
                  {/* 비활성 카드 2개는 하나의 그룹 div로 묶어 함께 전이합니다. */}
                  <div className="relative grid grid-cols-1 md:grid-cols-2 md:gap-2 after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:bg-white/40 after:content-['']">
                    {disabledCards.map((card) => (
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
    </ChatLayout>
  );
}
