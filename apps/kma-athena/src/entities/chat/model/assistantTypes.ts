import { LlmType } from './chatTypes';

export type ChatAssistantRequest = {
  appId?: string;
  appName: string;
  persona: string;
  llmName: LlmType;
  files: File[];
  deleteFileIds?: string[];
};

export type ChatAssistantFormMode = 'create' | 'update';

export type ChatAssistantFormInitialData = {
  appId: string;
  appName: string;
  persona: string;
  llmName: LlmType;
  files: AssistantFile[];
};

export type AssistantProgressData = {
  knowledgeId: string;
  totalDocuments: number;
  successDocuments: number;
  failedDocuments: number;
  progressingDocuments: number;
  progress: number;
};

type AssistantPromptUser = {
  id: string;
  traits: {
    name: string;
    email: string;
    roles: string[];
    nickname: string;
    agreements: {
      marketing: unknown[];
      privacyPolicy: boolean;
      termsOfService: boolean;
    };
    phoneNumber: string;
  };
  state: string;
  available: boolean;
};

type AssistantPromptVersion = {
  id: string;
  modelAlias: string | null;
  version: number;
  disabled: boolean;
  createdBy: string;
  createdAt: string;
  config: Record<string, unknown>;
  promptId: string;
  contents: { role: string; msg: string }[];
  modelParamConfig: {
    temperature: number;
    topP: number | null;
    topK: number | null;
    maxOutTokens: number;
    stopSequence: string | null;
  };
  projectId: string;
  updatedBy: string;
  updatedAt: string;
};

type AssistantPrompt = {
  id: string;
  name: string;
  description: string | null;
  tags: string[] | null;
  favorite: boolean;
  projectId: string;
  createdBy: AssistantPromptUser;
  updatedBy: AssistantPromptUser;
  createdAt: string;
  updatedAt: string;
  recentVersion: AssistantPromptVersion;
};

export type AssistantFile = {
  id: string;
  status: string;
  size: number;
  favorite: boolean;
  createdBy: string;
  createdAt: string;
  directoryId: string;
  path: string;
  errMsg: string | null;
  mediaType: string;
  projectId: string;
  updatedBy: string;
  updatedAt: string;
  fileName: string;
};

export type AssistantAttachedFile =
  | {
      source: 'server';
      id: string;
      name: string;
      size: number;
      raw: AssistantFile;
      deleted?: boolean;
    }
  | {
      source: 'local';
      id: string;
      name: string;
      size: number;
      file: File;
    };

export type AssistantListItem = {
  key: string;
  name: string;
};

export type AssistantDetailData = {
  appId: string;
  appVersionId: string;
  modelAlias: string;
  llmName: LlmType;
  knowledgeId: string;
  prompts: AssistantPrompt[];
  persona: string;
  files: AssistantFile[];
};
