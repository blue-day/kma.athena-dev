import nextDynamic from 'next/dynamic';
import { Suspense } from 'react';
import { ChatLayout } from '@/widgets/layout/ChatLayout';

export const dynamic = 'force-dynamic';

const KnowledgeChatPage = nextDynamic(() =>
  import('@/views/KnowledgeChatPage').then((mod) => mod.KnowledgeChatPage),
);

export default function Page() {
  return (
    <ChatLayout showHelp>
      <Suspense fallback={null}>
        <KnowledgeChatPage />
      </Suspense>
    </ChatLayout>
  );
}
