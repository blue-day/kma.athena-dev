import { LlmType } from '../model/chatTypes';

export type RecommendationAssistant = {
  key: string;
  label: string;
  name: string;
  persona: string;
  model: LlmType;
};

// 추후 서버에서 가져올 데이터
export const recommendationAssistant = [
  {
    key: 'A',
    label: '추천 비서 A',
    name: '지식 아카이브 매니저',
    persona: '지식 아카이브 매니저',
    model: 'Gemini',
  },
  {
    key: 'B',
    label: '추천 비서 B',
    name: '베테랑 의협 사무국장',
    persona: '베테랑 의협 사무국장',
    model: 'Claude',
  },
  {
    key: 'C',
    label: '추천 비서 C',
    name: '스마트한 법률/세무 컨설턴트',
    persona: '스마트한 법률/세무 컨설턴트',
    model: 'ChatGPT',
  },
] satisfies RecommendationAssistant[];
