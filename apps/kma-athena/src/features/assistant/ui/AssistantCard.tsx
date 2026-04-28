'use client';

/**
 * 나만의 비서 데이터 존재할 경우 ui
 */

interface AssistantCardCreateProps {
  kind: 'create';
  onClick: () => void;
}

interface AssistantCardAssistantProps {
  kind: 'assistant';
  id: string;
  title: string;
  onAssistantClick: (id: string, title: string) => void;
}

type AssistantCardProps = AssistantCardCreateProps | AssistantCardAssistantProps;

export function AssistantCard(props: AssistantCardProps) {
  if (props.kind === 'create') {
    return (
      <button
        type="button"
        onClick={props.onClick}
        className="btn-assistant-create w-full min-h-[102px] md:min-h-[240px] rounded-2xl md:rounded-[24px] border border-gray-border bg-white p-4"
      >
        <strong className="text-sm md:text-base font-semibold">만들기</strong>
      </button>
    );
  }

  return (
    <article className="relative flex flex-col w-full min-h-[102px] md:min-h-[240px] rounded-2xl md:rounded-[24px] border border-gray-border bg-white md:px-2 pb-4 md:pb-[26px]">
      <button
        type="button"
        disabled
        className="btn-assistant flex md:justify-center w-full flex-1 px-4 pl-[82px] pt-6 pb-10 md:pt-[122px] md:pb-0 md:px-4"
        onClick={() => props.onAssistantClick(props.id, props.title)}
      >
        <strong className="block text-[15px] md:text-base font-semibold break-keep">{props.title}</strong>
      </button>
      <div className="mt-4 flex justify-center gap-1.5 absolute bottom-4 right-4 md:static z-10">
        <button
          type="button"
          className="min-w-[70px] md:min-w-20 h-[30px] md:h-8 rounded-full border border-[var(--kma-gray-button-border)] bg-[var(--kma-white-02)] px-4 text-sm font-medium"
        >
          편집
        </button>
        <button
          type="button"
          className="min-w-[70px] md:min-w-20 h-[30px] md:h-8 rounded-full border border-[var(--kma-gray-button-border)] bg-[var(--kma-white-02)] px-4 text-sm font-medium"
        >
          삭제
        </button>
      </div>
    </article>
  );
}
