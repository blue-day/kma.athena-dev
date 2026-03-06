export interface ConversationSummary {
  category: string;
  title: string;
}

export interface ConversationResourceLink {
  id: string;
  label: string;
  href: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  links?: ConversationResourceLink[];
  recommendations?: string[];
}
