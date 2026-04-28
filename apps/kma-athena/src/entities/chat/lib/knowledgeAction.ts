/**
 * 지식 기반 챗봇 앱 조회/검증 함수
 */
import { KNOWLEDGE_ITEM, type KnowledgeActionKey } from '@/entities/chat/config/knowledgeConfig';

export function isKnowledgeActionKey(value: unknown): value is KnowledgeActionKey {
  return typeof value === 'string' && value in KNOWLEDGE_ITEM;
}

export function getKnowledgeAction(key: KnowledgeActionKey) {
  return KNOWLEDGE_ITEM[key];
}

export function getKnowledgeActionKeyByAppCode(appCode?: string | null): KnowledgeActionKey | null {
  if (!appCode?.trim()) {
    return null;
  }

  const normalizedAppCode = appCode.trim();

  const entry = Object.entries(KNOWLEDGE_ITEM).find(([, value]) => value.appCode === normalizedAppCode);

  return entry ? (entry[0] as KnowledgeActionKey) : null;
}
