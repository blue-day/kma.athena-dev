'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CommonSelect } from '@/shared/ui/CommonSelect';

const MODEL_OPTIONS = ['Gemini', 'Gemini 2.5 Flash', 'Gemini 2.5 Pro (2025.12)'];

interface ChatPromptInputProps {
  // 부모에서 전송 이벤트를 처리할 수 있도록 메시지 콜백을 받습니다.
  onSubmit?: (message: string) => void;
  // true면 하단 도킹 상태(대화 모드)로 간주해 상단 여백을 제거합니다.
  docked?: boolean;
  // 입력창 placeholder를 부모에서 주입할 수 있습니다.
  placeholder?: string;
  // true면 컴포넌트가 마운트될 때 슬라이드업 효과를 적용합니다.
  animateOnMount?: boolean;
}

export const ChatPromptInput = ({
  onSubmit,
  docked = false,
  placeholder = '자유롭게 질문해 보세요.',
  animateOnMount = false,
}: ChatPromptInputProps) => {
  const [message, setMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0]);
  const [isMountAnimationReady, setIsMountAnimationReady] = useState(!animateOnMount);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isSubmittingRef = useRef(false);
  // TODO: 실제 프롬프트 실행 상태에 따라서 값을 변경시켜주세요.
  const isPromptRunning = false; //true 인경우 [전송버튼] 상태변경
  const sendButtonStateClass = isPromptRunning
    ? 'btn-chat-send-stop'
    : message.trim().length > 0
      ? 'btn-chat-send-active'
      : 'btn-chat-send-disabled';
  // 실행 중이 아니고 텍스트가 있을 때만 전송 버튼 활성화
  const canSend = message.trim().length > 0 && !isPromptRunning;

  const handleSend = () => {
    const nextMessage = message.trim();

    if (!nextMessage || isPromptRunning || isSubmittingRef.current) {
      return;
    }

    // Enter/Click 이벤트가 연달아 들어와도 한 번만 전송되도록 보호합니다.
    isSubmittingRef.current = true;
    onSubmit?.(nextMessage);
    // 전송 후 입력창 초기화
    setMessage('');
    setTimeout(() => {
      isSubmittingRef.current = false;
    }, 120);
  };

  useLayoutEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = 'auto';

    const computedLineHeight = Number.parseFloat(
      window.getComputedStyle(textarea).lineHeight,
    );
    const lineHeight = Number.isFinite(computedLineHeight) ? computedLineHeight : 28;
    const maxHeight = lineHeight * 10;
    const nextHeight = Math.min(textarea.scrollHeight, maxHeight);

    // 최대 10줄까지 자동 확장하고, 넘치면 내부 스크롤로 처리합니다.
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [message]);

  useEffect(() => {
    if (!animateOnMount) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      setIsMountAnimationReady(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [animateOnMount]);

  return (
    <div
      className={`${docked ? '' : 'mt-[30px] md:mt-20'} w-full max-w-[860px] mx-auto transition-all duration-500 ease-out ${
        isMountAnimationReady ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      <div
        className="self-stretch flex min-h-[108px] md:min-h-[136px] flex-col items-stretch justify-start rounded-[22px] border-4 border-solid border-transparent py-2 md:py-4 shadow-[0_25px_50px_-12px_#dbeafe]"
        style={{
          background:
            'linear-gradient(#fff 0 0) padding-box, linear-gradient(to right, #00d3f3, #2b7fff 50%, #f6339a) border-box',
        }}
      >
        <div className="flex pt-3 md:pt-4 flex-col justify-between px-3">
          <textarea
            ref={textareaRef}
            placeholder={placeholder}
            rows={1}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              // 한글 IME 조합 중 Enter는 전송으로 처리하지 않습니다.
              if (event.nativeEvent.isComposing) {
                return;
              }

              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            className="block w-full min-h-6 px-1 resize-none overflow-y-hidden bg-transparent text-base leading-6 outline-none"
          />
          <div className="mt-2 md:mt-2.5 flex items-center">
            <button
              type="button"
              className="btn-chat-attach mr-auto inline-flex h-10 w-10 rounded-full transition-colors hover:bg-[#f8fafc]"
              aria-label="첨부파일"
            >
              <span className="sr-only">첨부파일</span>
            </button>
            <div className="ml-auto flex flex-1 items-center justify-end gap-[1px] md:gap-2.5">
              {/* <CommonSelect
                options={MODEL_OPTIONS}
                value={selectedModel}
                onChange={setSelectedModel}
                ariaLabel="모델 선택"
              /> */}
              <span className="inline-block h-10 py-2.5 px-4 text-sm leading-[1.43]">Gemini</span>
              <button
                type="button"
                className={`btn-chat-send ${sendButtonStateClass}`}
                aria-label="질문 전송"
                onClick={handleSend}
                disabled={!canSend}
              />
            </div>
          </div>
        </div>
      </div>
      <p className="mt-2.5 text-center text-xs text-gray-300">
        AI는 명확하지 않은 정보를 줄 수 있으니 한 번 더 확인하세요.
      </p>
    </div>
  );
};
