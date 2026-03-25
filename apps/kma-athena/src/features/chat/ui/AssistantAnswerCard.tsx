import Lottie from 'lottie-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import chatLoadingLottie from '@/shared/assets/lottie/chat_loading.json';

interface AssistantAnswerCardProps {
  onOpenMaterialPanel?: () => void;
}

const markdownSample = `
안내문구가 들어갑니다. 해당 문구의 스타일을 정의합니다.  
안내문구가 들어갑니다. 해당 문구의 스타일을 정의합니다. 안내문구가 들어갑니다.

# Heading 1 - 가장 큰 제목
## Heading 2 - 주요 섹션 제목
### Heading 3 - 하위 섹션 제목
#### Heading 4 - 작은 섹션 제목
##### Heading 5 - 더 작은 제목
###### Heading 6 - 가장 작은 제목

**굵은 텍스트(strong)는 중요한 내용을 강조합니다.**  
*기울임(em)은 부드러운 강조를 표현합니다.*  
~~취소선(del)~~ 은 삭제되거나 더 이상 유효하지 않은 내용을 나타냅니다.

- 리스트 1 내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다.내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다.
- 리스트 2 내용이 들어갑니다.
- 리스트 3 내용이 들어갑니다.

1. 숫자 리스트 1 내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다.내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다. 내용이 들어갑니다.
2. 숫자 리스트 2 내용이 들어갑니다.
3. 숫자 리스트 3 내용이 들어갑니다.

[링크 텍스트](https://www.kma.org)

![이미지](https://cdn.informaticsview.com/news/photo/202412/1017_4493_2752.jpg)

---

> 인용구 텍스트

| 표 제목 1 | 표 제목 2 | 표 제목 3 |
| --- | --- | --- |
| 표 내용 1 | 표 내용 2 | 표 내용 3 |
| 표 내용 1 | 표 내용 2 | 표 내용 3 |

\`\`\`
코드 블록 샘플
</> HTML
<!-- HTML 예시 -->
<article class="content">
  <h2>챗봇 UI 가이드</h2>
  <p>사용자 친화적인 디자인</p>
</article>
\`\`\`
`;

export function AssistantAnswerCard({ onOpenMaterialPanel }: AssistantAnswerCardProps) {
  return (
    <article className="ai-answer-wrap">
      {/* 답변 생성중일때만 애니메이션 노출 */}
      <div
        className="answer-loading h-[28px] w-[28px]"
        role="status"
        aria-live="polite"
        aria-label="답변 로딩 중"
      >
        <Lottie animationData={chatLoadingLottie} loop autoplay className="h-full w-full" />
      </div>
      
      <h2>의협의 공식 입장</h2>
      <p>
        대한의사협회는 2025년 5월 29일에 성분명처방 관련 입장을 게시했습니다. 
        <br />의협은 성분명처방 제도화가 과학적 진료행위에 대한 침해이며, 성분명 처방이 약사의 대체조제 권한을 강화한다는 주장이 본질을 호도하고 있다는 입장입니다.
        <br />또한 성분명처방 제도화가 환자 중심의보건의료체계를 해칠수 있으며, 약사회의 주장이 더불어민주당의공약과 다르다는 점을 강조하고 있습니다.
      </p>

      <button
        type="button"
        className="btn-underline"
        onClick={onOpenMaterialPanel}
      >
        내부 자료 <span className="text-primary font-semibold">25건</span> &gt; /  외부 링크 <span className="text-primary font-semibold">7건</span> &gt;
      </button>

      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          className="btn-favorite transition-colors hover:bg-[var(--kma-bg-hover)]"
        >
          <span className="sr-only">보관함 저장</span>
        </button>
        <button
          type="button"
          className="btn-copy transition-colors hover:bg-[var(--kma-bg-hover)]"
        >
          <span className="sr-only">복사</span>
        </button>
      </div>

      <div className="recommend-box">
        <p>
          원하는 답변이 아니라면, 이렇게 질문해 보는건 어때요?
        </p>
        <div className="recommend-list">
          <button type="button">
            1. 성분명 처방 관련된 현행 의견</button>
          <button type="button">
            2. 성분명 반대
          </button>
          <button type="button">
            3. 외국에서 성분명 처방이 어떻게 하고 있나요?
          </button>
        </div>
      </div>

      {/* 마크다운 스타일 적용 영역 */}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownSample}</ReactMarkdown>

      {/* 버튼 아이콘 필요시 사용 */}
      <button
        type="button"
        className="btn-favorite transition-colors hover:bg-[var(--kma-bg-hover)]"
      >
        <span className="sr-only">보관함 저장</span>
      </button>
      <button
        type="button"
        className="btn-copy transition-colors hover:bg-[var(--kma-bg-hover)]"
      >
        <span className="sr-only">복사</span>
      </button>
      <button
          type="button"
          className="btn-good transition-colors hover:bg-[var(--kma-bg-hover)]"
        >
          <span className="sr-only">좋아요</span>
        </button>
        <button
          type="button"
          className="btn-bad transition-colors hover:bg-[var(--kma-bg-hover)]"
        >
          <span className="sr-only">별로임</span>
        </button>
        <button
          type="button"
          className="btn-retry transition-colors hover:bg-[var(--kma-bg-hover)]"
        >
          <span className="sr-only">다시시도</span>
        </button>
        <button
          type="button"
          className="btn-more transition-colors hover:bg-[var(--kma-bg-hover)]"
        >
          <span className="sr-only">더보기</span>
        </button>

    </article>
  );
}
