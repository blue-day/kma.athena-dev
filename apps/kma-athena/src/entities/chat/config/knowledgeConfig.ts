/**
 * 지식 기반 챗봇 앱 정적 데이터 및 파생 타입
 */

export const FADE_DURATION_MS = 180;
export const EXPAND_DURATION_MS = 580;
import { chatTabMap } from '@/entities/chat/config/chatTabConfig';

const KNOWLEDGE_PARENT_TITLE = chatTabMap.knowledge.label;

export const KNOWLEDGE_ITEM = {
  associationMaterial: {
    title: '협회 자료 검색',
    parentTitle: KNOWLEDGE_PARENT_TITLE,
    description: '지식 저장소 자료를 기반으로\n검색할 수 있습니다.',
    isEnabled: true,
    className: 'ic-association',
    appId: process.env.NEXT_PUBLIC_ATHENA_APP_ID_KNOWLEDGE,
    appCode: 'KNOWLEDGE.ASSOCIATION_MATERIALS',
    examplePrompts: [
      '의료 현장에 특별사법경찰 도입을 반대하는 결정적인 이유는 무엇인가요?',
      '성분명처방 도입이 환자의 건강권에 어떤 영향을 주나요?',
      '한의사의 현대 의료기기 사용이 가져올 가장 큰 부작용은 무엇인가요?',
      '의료기사의 업무 범위 단독 규정이 왜 위험한가요?',
      '수급추계위원회의 문제점은 무엇이며 구성이나 운영방향등 어떤면의 개선이 시급하나요?',
      '의대 교육의 질을 유지하기 위해 원탁회의에서 가장 먼저 해결할 과제는 무엇인가요?',
      '군의관·공보의 지원율을 높이기 위해 복무 기간 단축은 필요한가요?',
      '정부와의 대화를 재개하기 위해 가장 필요한 신뢰 회복 조치는 무엇인가요?',
      '정부의 비급여 관리 강화 정책이 의료 현장에 주는 가장 큰 부담은 무엇인가요?',
      '검체검사 위탁 수가 관련 고시 개정의 가장 큰 문제점은 무엇인가요?',
      '중동 전쟁으로 인한 의료 소모품 수급 불안정에 대비할 대책은 무엇이 있나요?',
      '지역의의사제도 법안이 의료사각지역과 필수의료 해결을 위한 효율성과 실행력을 담보하기 위해서 어떤 점이 보완되어야 하나요?',
      '비대면진료 시범사업이 진행되고 있고, 머지않아 본사업으로 정착될텐데 환자안전과 의료 질 담보를 위한 필수조건이 무엇인가요?',
    ],
  },
  boardMaterial: {
    title: '상임 이사회 자료 검색',
    parentTitle: KNOWLEDGE_PARENT_TITLE,
    description: '상임 이사회 자료를 기반으로\n검색할 수 있습니다.',
    isEnabled: true,
    className: 'ic-board',
    appId: process.env.NEXT_PUBLIC_ATHENA_APP_ID_KNOW_PERM,
    appCode: 'KNOWLEDGE.EXECUTIVE_BOARD_MATERIALS',
    examplePrompts: [
      '의료 현장에 특별사법경찰 도입을 반대하는 결정적인 이유는 무엇인가요?',
      '성분명처방 도입이 환자의 건강권에 어떤 영향을 주나요?',
      '한의사의 현대 의료기기 사용이 가져올 가장 큰 부작용은 무엇인가요?',
      '의료기사의 업무 범위 단독 규정이 왜 위험한가요?',
      '수급추계위원회의 문제점은 무엇이며 구성이나 운영방향등 어떤면의 개선이 시급하나요?',
      '의대 교육의 질을 유지하기 위해 원탁회의에서 가장 먼저 해결할 과제는 무엇인가요?',
      '군의관·공보의 지원율을 높이기 위해 복무 기간 단축은 필요한가요?',
      '정부와의 대화를 재개하기 위해 가장 필요한 신뢰 회복 조치는 무엇인가요?',
      '정부의 비급여 관리 강화 정책이 의료 현장에 주는 가장 큰 부담은 무엇인가요?',
      '검체검사 위탁 수가 관련 고시 개정의 가장 큰 문제점은 무엇인가요?',
      '중동 전쟁으로 인한 의료 소모품 수급 불안정에 대비할 대책은 무엇이 있나요?',
      '지역의의사제도 법안이 의료사각지역과 필수의료 해결을 위한 효율성과 실행력을 담보하기 위해서 어떤 점이 보완되어야 하나요?',
      '비대면진료 시범사업이 진행되고 있고, 머지않아 본사업으로 정착될텐데 환자안전과 의료 질 담보를 위한 필수조건이 무엇인가요?',
    ],
  },
  licenseReport: {
    title: '면허 신고',
    parentTitle: KNOWLEDGE_PARENT_TITLE,
    description: '면허 신고 자료를 기반으로\n검색할 수 있습니다.',
    isEnabled: false,
    className: 'ic-license',
    appId: '',
    appCode: 'KNOWLEDGE',
    examplePrompts: [],
  },
  creditPoint: {
    title: '연수 평점',
    parentTitle: KNOWLEDGE_PARENT_TITLE,
    description: '연수 평점 신고 자료를 기반으로\n검색할 수 있습니다.',
    isEnabled: false,
    className: 'ic-credit',
    appId: '',
    appCode: 'KNOWLEDGE',
    examplePrompts: [],
  },
} as const;

export type KnowledgeActionKey = keyof typeof KNOWLEDGE_ITEM;

export interface KnowledgeActionCard {
  key: KnowledgeActionKey;
  title: string;
  description: string;
  isEnabled: boolean;
  className: string;
  examplePrompts?: readonly string[];
}

export const knowledgeActionsCardList: KnowledgeActionCard[] = (
  Object.entries(KNOWLEDGE_ITEM) as [KnowledgeActionKey, (typeof KNOWLEDGE_ITEM)[KnowledgeActionKey]][]
).map(([key, value]) => ({
  key,
  title: value.title,
  description: value.description,
  isEnabled: value.isEnabled,
  className: value.className,
  examplePrompts: value.examplePrompts,
}));

export const ENABLED_KNOWLEDGE_ACTION_CARDS = knowledgeActionsCardList.filter((card) => card.isEnabled);
export const DISABLED_KNOWLEDGE_ACTION_CARDS = knowledgeActionsCardList.filter((card) => !card.isEnabled);
