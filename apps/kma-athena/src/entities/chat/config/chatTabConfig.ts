/**
 * 탭 메타데이터 단일 소스
 * - 탭 라우트/타입/코드/레이블 정의
 * - 모든 파생 타입은 CHAT_TAB_ITEMS에서 추론
 */

export const CHAT_TAB_ITEMS = [
  {
    key: '/general' as const,
    label: '일반 챗봇',
    chatType: 'general' as const,
    chatCode: 'GENERAL' as const,
  },
  {
    key: '/knowledge' as const,
    label: '내부 지식 챗봇',
    chatType: 'knowledge' as const,
    chatCode: 'KNOWLEDGE' as const,
  },
  {
    key: '/assistant' as const,
    label: '나만의 비서',
    chatType: 'assistant' as const,
    chatCode: 'ASSISTANT' as const,
  },
] as const;

export type ChatType = (typeof CHAT_TAB_ITEMS)[number]['chatType'];
export type ChatTabRoute = (typeof CHAT_TAB_ITEMS)[number]['key'];
export type ChatTabCode = (typeof CHAT_TAB_ITEMS)[number]['chatCode'];
export type ChatTabItem = (typeof CHAT_TAB_ITEMS)[number];

type ChatTabMap = { [K in ChatType]: Extract<ChatTabItem, { chatType: K }> };

export const chatTabMap = Object.fromEntries(CHAT_TAB_ITEMS.map((tab) => [tab.chatType, tab])) as ChatTabMap;
