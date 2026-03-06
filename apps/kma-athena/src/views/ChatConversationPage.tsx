import { ChatConversationView } from '@/views/chat/ChatConversationView';

interface ChatConversationPageProps {
  initialMessages?: string[];
}

export function ChatConversationPage({
  initialMessages = [],
}: ChatConversationPageProps) {
  return <ChatConversationView mode="history" initialMessages={initialMessages} />;
}
