import nextDynamic from 'next/dynamic';
import { Suspense } from 'react';
import { ChatLayout } from '@/widgets/layout/ChatLayout';

export const dynamic = 'force-dynamic';

const MyAssistantPage = nextDynamic(() =>
  import('@/views/MyAssistantPage').then((mod) => mod.MyAssistantPage),
);

export default function Page() {
  return (
    <ChatLayout showHelp>
      <Suspense fallback={null}>
        <MyAssistantPage />
      </Suspense>
    </ChatLayout>
  );
}
