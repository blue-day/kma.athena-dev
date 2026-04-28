import nextDynamic from 'next/dynamic';
import { Suspense } from 'react';
import { ChatLayout } from '@/widgets/layout/ChatLayout';

export const dynamic = 'force-dynamic';

const ChatConversationView = nextDynamic(() =>
  import('@/views/chat/ChatConversationView').then((mod) => mod.ChatConversationView),
);


export default function Page() {
  return (
    <ChatLayout>
      <Suspense fallback={null}>
        <ChatConversationView />
      </Suspense>
    </ChatLayout>
  );
}
