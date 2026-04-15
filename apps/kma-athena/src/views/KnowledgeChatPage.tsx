'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
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
  examplePrompts?: string[];
}

const KNOWLEDGE_ACTION_CARDS: KnowledgeActionCard[] = [
  {
    key: 'association-material',
    title: '협회 자료 검색',
    description: '지식 저장소 자료를 기반으로\n검색할 수 있습니다.',
    isEnabled: true,
    className: 'ic-association',
    examplePrompts: [
      '의대증원 수급추계위에서 제시하고 있는 방법론을 요약해줘',
      '최근 협회의 주요 공지사항을 알려줘',
      '협회 자료에서 의사 면허 관련 내용을 찾아줘',
    ],
  },
  {
    key: 'board-material',
    title: '상임 이사회 자료 검색',
    description: '설명입력란에 입력된 내용이 보여집니다.\n30자 제한 두세요.',
    isEnabled: true,
    className: 'ic-board',
    examplePrompts: [
      // '2024년 상임 이사회 주요 결정 사항을 정리해줘',
      // '최근 이사회에서 논의된 안건 목록을 알려줘',
      // '이사회 회의록에서 예산 관련 내용을 찾아줘',
    ],
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
    description: '설명입력란에 입력된 내용이 보여집니다.\n30자 제한 두세요.',
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

interface ExpandedActionPanelProps {
  title: string;
  description: string;
  className?: string;
  isExpandedStage: boolean;
  showPrompt: boolean;
  examplePrompts?: string[];
  onSubmit: (message: string) => void;
}

const ExpandedActionPanel = ({
  title,
  description,
  className = '',
  isExpandedStage,
  showPrompt,
  examplePrompts,
  onSubmit,
}: ExpandedActionPanelProps) => {
  const [injectedValue, setInjectedValue] = useState('');

  const handleExampleClick = useCallback((prompt: string) => {
    // 같은 예시를 연속으로 클릭해도 useEffect가 재실행되도록 빈 값을 거쳤다가 설정합니다.
    setInjectedValue('');
    requestAnimationFrame(() => setInjectedValue(prompt));
  }, []);

  return (
    //확장된 카드 영역
    <div
      className={`pt-[108px] px-2.5 pb-[34px] rounded-[24px] border border-gray-border md:p-[30px] md:pt-[126px] text-center transition-all duration-[680ms] ${className} ${
        isExpandedStage ? 'min-h-[350px] md:min-h-[414px] md:rounded-[50px]' : 'min-h-[100px] ring-[6px] md:ring-8 ring-[var(--kma-card-border)]'
      }`}
    >
      <h3 className="text-base md:text-xl font-bold leading-tight">{title}</h3>
      <p className="mt-1.5 md:mt-4 text-xs md:text-[13px] leading-[1.25] md:text-sm text-gray-300">{description}</p>

      {showPrompt && (
        <>
          {examplePrompts && examplePrompts.length > 0 && (
            <div className="mt-8 md:mt-9 flex flex-wrap gap-2 max-w-[860px] mx-auto justify-center animate-fade-in-up">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleExampleClick(prompt)}
                  className={`${index === 0 ? 'block' : 'hidden md:inline-block'} md:flex-1 w-full px-4 py-2.5 text-sm leading-[1.43] font-medium rounded-lg border border-gray-border bg-(--kma-card-border) text-left transition-all duration-200 hover:translate-y-[-4px]`}
                >
                    <span className="text-primary">[예시] </span> 
                    <span className="">{prompt}</span>
                </button>
              ))}
            </div>
          )}
          <div className={`${examplePrompts && examplePrompts.length > 0 ? 'mt-2.5 ' : 'mt-10 md:mt-9'}`}>
            <ChatPromptInput
              onSubmit={onSubmit}
              docked
              animateOnMount
              injectedValue={injectedValue}
              placeholder="질문 예시: 의대증원 수급추계위에서 제시하고 있는 방법론을 요약줘"
            />
          </div>
        </>
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
      hasSelection && isSelected && (isExpanding || isExpanded) ? 'w-full md:w-[980px]' : 'w-full md:w-[312px]';

    // 선택 전 상태: 기본 너비와 높이값 보존
    if (!hasSelection) {
      return `${widthClassName} max-h-[500px]`;
    }

    // 선택된 카드: 확장 단계에 맞춰 너비 조절
    if (isSelected) {
      return widthClassName;
    }

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
    <ChatLayout showHelp>
      <section className="relative z-10 mx-auto flex h-full w-full flex-col bg-kma-deco">
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 md:px-2.5">
          <div className="flex flex-col items-center pt-[30px] md:pt-[220px] pb-10">
            <ChatWelcomeHero subtitle={subtitle} />

            <div className="category-card-wrap mt-5 md:mt-[34px] flex flex-wrap w-full items-start justify-center gap-1.5 md:gap-5">
              {renderEnabledCard(firstEnabledCard)}
              {renderEnabledCard(secondEnabledCard)}

              <div
                className={`transition-all ease-in-out duration-[580ms] ${disabledGroupClassName}`}
              >
                {/* 비활성 카드 2개는 하나의 그룹 div로 묶어 함께 전이합니다. */}
                <div className="relative grid grid-cols-1 md:grid-cols-2 after:pointer-events-none after:absolute after:inset-0 after:w-full after:rounded-3xl after:bg-white/40 after:content-[''] bg-[var(--kma-card-border)] rounded-3xl md:rounded-[28px] dark:after:bg-[#1e2a3b]/40">
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
            </div>
          </div>
        </div>
      </section>
    </ChatLayout>
  );
}
