import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isKnowledgeActionKey } from '@/entities/chat/lib/knowledgeAction';
import {
  knowledgeActionsCardList,
  type KnowledgeActionKey,
  FADE_DURATION_MS,
  EXPAND_DURATION_MS,
} from '@/entities/chat/config/knowledgeConfig';

export type TransitionPhase = 'idle' | 'fading' | 'expanding' | 'expanded';

export function useKnowledgeTransition() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const actionParam = searchParams.get('action');

  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>('idle');
  // router.replace는 비동기라 URL 반영 전 렌더에서 selectedActionKey가 null이 되는 gap이 생김.
  // 클릭 시 즉시 로컬 state에도 저장해 두어 hasSelection을 바로 true로 만들어 flash를 방지함.
  const [clickedKey, setClickedKey] = useState<KnowledgeActionKey | null>(null);

  const urlActionKey: KnowledgeActionKey | null = isKnowledgeActionKey(actionParam) ? actionParam : null;
  // 로컬 clickedKey를 우선 사용, URL이 따라오면 clickedKey는 초기화됨
  const selectedActionKey: KnowledgeActionKey | null = clickedKey ?? urlActionKey;

  const selectedCard = useMemo(
    () => knowledgeActionsCardList.find((card) => card.key === selectedActionKey) ?? null,
    [selectedActionKey],
  );

  useEffect(() => {
    // URL(action) → transition 상태 동기화
    if (!urlActionKey) {
      setTransitionPhase('idle');
      setClickedKey(null);
      return;
    }
    setClickedKey(null);
    setTransitionPhase((prev) => {
      // 카드 클릭 직후 animation 유지
      if (prev === 'fading' || prev === 'expanding') return prev;
      return 'expanded';
    });
  }, [urlActionKey]);

  useEffect(() => {
    // fading → expanding
    if (!selectedActionKey || transitionPhase !== 'fading') return;
    const timer = setTimeout(() => setTransitionPhase('expanding'), FADE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [selectedActionKey, transitionPhase]);

  useEffect(() => {
    // expanding → expanded
    if (transitionPhase !== 'expanding') return;
    const timer = setTimeout(() => setTransitionPhase('expanded'), EXPAND_DURATION_MS);
    return () => clearTimeout(timer);
  }, [transitionPhase]);

  const handleActionCardClick = (actionKey: KnowledgeActionKey) => {
    if (!!selectedActionKey || transitionPhase !== 'idle') return;
    setClickedKey(actionKey);
    setTransitionPhase('fading');
    router.replace(`?action=${actionKey}`, { scroll: false });
  };

  return {
    transitionPhase,
    selectedActionKey,
    selectedCard,
    handleActionCardClick,
  };
}
