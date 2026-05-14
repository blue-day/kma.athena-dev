'use client';

import { ChatWelcomeHero } from '@/widgets/chat/ChatWelcomeHero';
import { AssistantFormWidget } from '@/widgets/assistant/AssistantFormWidget';
import { recommendationAssistant } from '@/entities/chat/config/assistantConfig';

export function MyAssistantPage() {
  const assistants = recommendationAssistant;
  const hasAssistants = assistants.length > 0;

  return (
    <>
      {/* 페이지 배경/스크롤 영역 */}
      <section className="relative z-10 mx-auto flex h-full w-full flex-col bg-kma-deco">
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 md:px-2.5">
          <div className={`flex flex-col items-center ${hasAssistants ? 'pt-[30px]' : 'pt-[100px]'} md:pt-[220px] pb-10 md:px-12`}>
            {/* 상단 인사/설명 영역 */}
            <ChatWelcomeHero
              subtitle={
                <>
                  참고할 자료를 업로드하고
                  <br className="md:hidden" />
                  {' '}
                  AI 역할을 설정하면 나만의 비서가 됩니다.
                </>
              }
            />

            <AssistantFormWidget
              assistants={assistants}
              hasAssistants={hasAssistants}
            />
          </div>
        </div>
      </section>
    </>
  );
}