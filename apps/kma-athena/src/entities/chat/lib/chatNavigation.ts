/**
 * 라우팅 유틸 단일 진입점
 * - 탭 메타데이터: @/entities/chat/config/chatTabConfig
 * - 라우트 파싱/생성 유틸 함수 정의
 */
import {
  CHAT_TAB_ITEMS,
  chatTabMap,
  ChatType,
  type ChatTabItem,
  type ChatTabRoute,
} from '@/entities/chat/config/chatTabConfig';
import { isKnowledgeActionKey } from './knowledgeAction';

type BuildNewChatNavigationParams = {
  chatType: ChatType | null;
  subType: string | null;
};

const CHAT_ROUTE_REGEX = /^\/(general|knowledge|assistant)(?:\/([^/?#]+))?/;

function isChatType(value: string): value is ChatType {
  return CHAT_TAB_ITEMS.some((item) => item.chatType === value);
}

/**
 * 진입 루트에 따른 챗봇 정보 반환
 */
export function getInfoByRoute(route: string): ChatTabItem {
  return CHAT_TAB_ITEMS.find((item) => item.key === route) ?? CHAT_TAB_ITEMS[0];
}

/**
 * 챗봇 타입에 따른 챗봇 정보 반환
 */
export function getInfoByChatType(chatType: ChatType | null | undefined): ChatTabItem {
  return CHAT_TAB_ITEMS.find((item) => item.chatType === chatType) ?? CHAT_TAB_ITEMS[0];
}

export function resolveChatRoute(pathname: string): {
  isConversationRoute: boolean;
  chatType: ChatType;
  chatTabRoute: ChatTabRoute;
  conversationId: string | null;
} {
  const match = pathname.match(CHAT_ROUTE_REGEX);

  if (!match) {
    const isItem = getInfoByRoute(pathname);
    return {
      isConversationRoute: false,
      chatType: isItem.chatType,
      chatTabRoute: isItem.key,
      conversationId: null,
    };
  }

  const [, rawChatType, conversationId] = match;

  const isRawItem = isChatType(rawChatType) ? chatTabMap[rawChatType] : CHAT_TAB_ITEMS[0];

  return {
    isConversationRoute: Boolean(conversationId),
    chatType: isRawItem.chatType,
    chatTabRoute: isRawItem.key,
    conversationId: conversationId ?? null,
  };
}

export function isSameTabNavigation(pathname: string, nextTabPath: string): boolean {
  return resolveChatRoute(pathname).chatTabRoute === nextTabPath;
}

// 대화방 진입
export function buildConversationRoute(conversationId: string, chatType: ChatType) {
  return `${getInfoByChatType(chatType).key}/${conversationId}`;
}

// 새 채팅 이동
export function buildNewChatNavigationUrl({ chatType, subType }: BuildNewChatNavigationParams): string {
  let returnRoute = getInfoByChatType(chatType).key;

  if (chatType === 'knowledge') {
    const actionKey = isKnowledgeActionKey(subType) ? subType : null;
    if (actionKey) {
      const searchParams = new URLSearchParams({ action: actionKey });
      returnRoute += `?${searchParams.toString()}`;
    }
  }
  return returnRoute;
}
