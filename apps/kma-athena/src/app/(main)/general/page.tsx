import nextDynamic from 'next/dynamic';
import { Suspense } from 'react';
import { ChatLayout } from '@/widgets/layout/ChatLayout';

export const dynamic = 'force-dynamic';

const GeneralChatPage = nextDynamic(() =>
  import('@/views/GeneralChatPage').then((mod) => mod.GeneralChatPage),
);

export default function Page() {
  return (
    <ChatLayout showHelp>
      <Suspense fallback={null}>
        <GeneralChatPage />
      </Suspense>
    </ChatLayout>
  );
}
