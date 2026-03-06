'use client';

import { useMemo, useState } from 'react';
import type { ConversationResourceLink } from '@/features/chat/model/conversation';
import { RecommendedQuestions } from '@/features/chat/ui/RecommendedQuestions';

interface AssistantAnswerCardProps {
  content: string;
  links: ConversationResourceLink[];
  recommendations: string[];
  onSelectRecommendation: (question: string) => void;
  onOpenMaterialPanel?: () => void;
}

export function AssistantAnswerCard({
  content,
  links,
  recommendations,
  onSelectRecommendation,
  onOpenMaterialPanel,
}: AssistantAnswerCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'done'>('idle');

  const formattedContent = useMemo(
    () =>
      content.split('\n').map((line, index) => (
        <p key={`${line}-${index}`} className={index === 0 ? '' : 'mt-2'}>
          {line}
        </p>
      )),
    [content],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopyState('done');
      window.setTimeout(() => setCopyState('idle'), 1200);
    } catch {
      setCopyState('idle');
    }
  };

  return (
    <article className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-6 py-5 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.5)]">
      <h3 className="text-2xl font-bold text-[#111827]">의협의 공식 입장</h3>
      <div className="mt-3 text-sm leading-7 text-[#374151]">{formattedContent}</div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-md border border-[#dbe1eb] bg-[#f8fafc] px-3 py-1.5 text-xs text-[#334155] transition-colors hover:bg-[#eef2ff]"
            onClick={(event) => {
              event.preventDefault();
              onOpenMaterialPanel?.();
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setIsSaved((prev) => !prev)}
          className={`inline-flex h-8 items-center rounded-md border px-2.5 text-xs transition-colors ${
            isSaved
              ? 'border-[#bfd2ff] bg-[#eef3ff] text-[#1e40af]'
              : 'border-[#d1d5db] text-[#4b5563] hover:bg-[#f8fafc]'
          }`}
        >
          {isSaved ? '보관함 저장됨' : '보관함 저장'}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex h-8 items-center rounded-md border border-[#d1d5db] px-2.5 text-xs text-[#4b5563] transition-colors hover:bg-[#f8fafc]"
        >
          {copyState === 'done' ? '복사 완료' : '복사'}
        </button>
      </div>

      <RecommendedQuestions questions={recommendations} onSelect={onSelectRecommendation} />
    </article>
  );
}
