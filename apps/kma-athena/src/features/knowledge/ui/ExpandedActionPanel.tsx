import { useRef, useState } from 'react';
import { ChatPromptInput, type ChatPromptInputHandle } from '@/features/chat/ui/ChatPromptInput';

interface ExpandedActionPanelProps {
  title: string;
  description: string;
  className?: string;
  isExpandedStage: boolean;
  isSubmitting?: boolean;
  showPrompt: boolean;
  examplePrompts?: readonly string[];
  onSubmit: (message: string) => void;
}

export const ExpandedActionPanel = ({
  title,
  description,
  className = '',
  isExpandedStage,
  isSubmitting = false,
  showPrompt,
  examplePrompts,
  onSubmit,
}: ExpandedActionPanelProps) => {
  const [expressExample] = useState(() => {
    if (!examplePrompts || examplePrompts.length === 0) return '';
    return examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
  });
  const promptRef = useRef<ChatPromptInputHandle>(null);

  const expandedSizeClassName = isExpandedStage
    ? 'min-h-[350px] md:min-h-[414px] md:rounded-[50px]'
    : 'min-h-[100px] ring-[6px] md:ring-8 ring-[var(--kma-card-border)]';

  return (
    <div
      className={`pt-[108px] px-2.5 pb-[34px] rounded-[24px] border border-gray-border md:p-[30px] md:pt-[126px] text-center transition-all duration-[680ms] ${expandedSizeClassName} ${className}`}
    >
      <h3 className="text-base md:text-xl font-bold leading-tight">{title}</h3>
      <p className="mt-1.5 md:mt-4 text-xs md:text-[13px] leading-[1.25] md:text-sm text-gray-300">
        {description}
      </p>
      {showPrompt && (
        <>
          {expressExample && (
            <div className="mt-8 md:mt-9 flex flex-wrap gap-2 max-w-[860px] mx-auto justify-center animate-fade-in-up">
              <button
                key={expressExample}
                type="button"
                onClick={() => { }}
                className={`${expressExample ? 'block' : 'hidden md:inline-block'} md:flex-1 w-full px-4 py-2.5 text-sm leading-[1.43] font-medium rounded-lg border border-gray-border bg-(--kma-card-border) text-left transition-all duration-200 hover:translate-y-[-4px]`}
              >
                <span className="text-primary">[예시] </span>
                <span className="">{expressExample}</span>
              </button>
            </div>
          )}
          <div className={`${expressExample ? 'mt-2.5 ' : 'mt-10 md:mt-9'}`}>
            <ChatPromptInput
              ref={promptRef}
              onSubmit={onSubmit}
              docked
              animateOnMount
              placeholder="질문을 입력해주세요."
            />
          </div>
        </>
      )}
    </div>
  );
};
