export const STORAGE_PREFIX = 'kma';

export const STORAGE_KEYS = {
  athenaTokens: `${STORAGE_PREFIX}:auth:tokens:v1`,
  user: `${STORAGE_PREFIX}:auth:user:v1`,
  ui: {
    theme: `${STORAGE_PREFIX}:ui:theme:v1`,
    language: `${STORAGE_PREFIX}:ui:language:v1`,
  },
  chat: {
    activeConversationId: `${STORAGE_PREFIX}:chat:active-conversation-id:v1`, // 프론트 저장용 식별자
    activeSessionId: `${STORAGE_PREFIX}:chat:active-session-id:v1`, // Athena 서버에 넘기는 대화 세션 식별자
    conversations: `${STORAGE_PREFIX}:chat:conversations:v1`,
  },
} as const;
