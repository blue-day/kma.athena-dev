/**
 * -----------------------------
 * 아테나 ai 챗봇 도메인 공용 타입
 * -----------------------------
 */

import type { ChatType } from '@/entities/chat/config/chatTabConfig';

// 챗봇 타입
export type { ChatType };

export const MODEL_OPTIONS = ['Gemini', 'Claude', 'ChatGPT'] as const;
export type LlmType = (typeof MODEL_OPTIONS)[number];

// 대화방 화자 타입
export const CHAT_ROLE = {
  USER: 'user',
  AI_RESPONSE: 'aiResponse',
} as const;
export type ChatRole = (typeof CHAT_ROLE)[keyof typeof CHAT_ROLE];

// 대화 종료 사유 타입
export const STOP_REASON = {
  USER: 'user',
  ERROR: 'error',
  COMPLETE: 'complete',
} as const;
export type StopReason = (typeof STOP_REASON)[keyof typeof STOP_REASON];

// 지식 기반 챗봇의 자료 타입
export const MATERIAL_SOURCE_TAB = {
  INTERNAL: 'internal',
  EXTERNAL: 'external',
} as const;
export type MaterialSourceTab = (typeof MATERIAL_SOURCE_TAB)[keyof typeof MATERIAL_SOURCE_TAB];

// 지식 기반 챗봇 내부 자료의 상태 타입
export type InternalSourceStatus = 'pending' | 'completed' | null;

// 챗봇 요청
export type ChatbotRequest = {
  chatType: ChatType; // 질문 진입 탭으로 결정된 챗봇 타입
  subType?: string | null; // 질문 진입 카테고리
  id: string; // 세션 아이디
  inputValue: string; // 질문 요청
  tweaks?: Record<string, string>; // 지식 기반 챗봇 내/외부
};

// 지식 기반 챗봇 response message 데이터
export type KnowledgeResponseMeta = {
  answer?: string;
  recommendations: string[];
  internalSearchSources: InternalMaterialSource[]; // 내부 문서 목록
  externalSearchSources: ExternalMaterialSource[]; // 외부 링크 목록
  rawResponseText?: string;
  fallback?: boolean;
  activeSourceTab?: MaterialSourceTab;
};

export type InternalMaterialSource = {
  fileId?: string | null;
  name: string;
  downloadUrl?: string | null;
  status?: InternalSourceStatus;
};

export type ExternalMaterialSource = {
  title: string;
  url: string;
};

// 대화 내역 타입
export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: string;
  isStreaming?: boolean;
  error?: boolean;
  isCompleted?: boolean;
  stopReason?: StopReason;
  backendMessageId?: string | null; // 서버 스트림 메시지 id 매핑

  // 지식형 응답 전용 메타
  knowledgeMeta?: KnowledgeResponseMeta | null;
};

// 대화방 타입
export type ChatConversation = {
  id: string;
  sessionId: string | null;
  chatType: ChatType;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  needsInitialResponse?: boolean;
  streamingMessageId?: string | null;

  // UI 표시용
  titleLabel?: string | null;
  // API 분기용
  subType?: string | null;
  // 선택된 LLM 모델
  llmName?: LlmType | null;
};

export type ChatConversationSummary = {
  id: string;
  sessionId: string | null;
  chatType: ChatConversation['chatType'];
  title: string;
  updatedAt: string;
  subType?: string | null;
};

export type ChatTitleRequest = {
  conversationId: string;
  userQuery: string;
  llmAnswer: string;
};

export type ChatResponse = {
  role: string;
  text: string;
};

export type ChatAssistantRequest = {
  appName: string;
  persona: string;
  llmName: LlmType;
  files: File[];
};
