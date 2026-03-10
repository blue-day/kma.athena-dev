interface AssistantAnswerCardProps {
  onOpenMaterialPanel?: () => void;
}

export function AssistantAnswerCard({ onOpenMaterialPanel }: AssistantAnswerCardProps) {
  return (
    <article className="ai-answer-wrap">
      <p className="answer-loading">...</p> {/* 추후 답변로딩 애니메이션 작업 예정 */}
      <h3>의협의 공식 입장</h3>
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
          className="btn-favorite transition-colors hover:bg-[#ebf3fd]"
        >
          <span className="sr-only">보관함 저장</span>
        </button>
        <button
          type="button"
          className="btn-copy transition-colors hover:bg-[#ebf3fd]"
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
    </article>
  );
}
