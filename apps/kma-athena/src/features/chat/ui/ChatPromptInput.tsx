'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { CommonSelect } from '@/shared/ui/CommonSelect';

const MODEL_OPTIONS = ['Gemini', 'Gemini 2.5 Flash', 'Gemini 2.5 Pro (2025.12)'];

export const ChatPromptInput = () => {
  const [message, setMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // TODO: 실제 프롬프트 실행 상태에 따라서 값을 변경시켜주세요.
  const isPromptRunning = false;
  const sendButtonStateClass = isPromptRunning
    ? 'btn-chat-send-stop'
    : message.trim().length > 0
      ? 'btn-chat-send-active'
      : 'btn-chat-send-disabled';

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

    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [message]);

  return (
    <div className="mt-20 w-full max-w-[860px]">
      <div
        className="self-stretch flex min-h-[136px] flex-col items-stretch justify-start rounded-[22px] border-4 border-solid border-transparent py-4 shadow-[0_25px_50px_-12px_#dbeafe]"
        style={{
          background:
            'linear-gradient(#fff 0 0) padding-box, linear-gradient(to right, #00d3f3, #2b7fff 50%, #f6339a) border-box',
        }}
      >
        <div className="flex pt-4 flex-col justify-between px-4">
          <textarea
            ref={textareaRef}
            placeholder="자유롭게 질문해 보세요."
            rows={1}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="block w-full min-h-6 resize-none overflow-y-hidden bg-transparent text-base font-mono leading-6 placeholder:text-[#9ca3af] outline-none"
          />
          <div className="mt-2 flex items-center">
            <button
              type="button"
              className="btn-chat-attach mr-auto inline-flex h-10 w-10 rounded-full transition-colors hover:bg-[#f8fafc]"
              aria-label="첨부파일"
            >
              <span className="sr-only">첨부파일</span>
            </button>
            <div className="ml-auto flex items-center gap-2.5">
              <CommonSelect
                options={MODEL_OPTIONS}
                value={selectedModel}
                onChange={setSelectedModel}
                ariaLabel="모델 선택"
              />
              <button
                type="button"
                className={`btn-chat-send ${sendButtonStateClass}`}
                aria-label="질문 전송"
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
