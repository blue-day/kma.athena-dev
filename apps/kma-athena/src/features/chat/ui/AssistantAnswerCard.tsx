export function AssistantAnswerCard() {
  return (
    <article className="w-full rounded-2xl border border-[#e5e7eb] bg-white px-6 py-5 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.5)]">
      <h3 className="text-2xl font-bold text-[#111827]">의협의 공식 입장</h3>
      <div className="mt-3 text-sm leading-7 text-[#374151]">
        <p>대한의사협회는 2025년 5월 29일 성분명처방 관련 입장을 제시했습니다.</p>
        <p className="mt-2">
          현행 처방체계를 유지하면서도 환자 안전과 진료 연속성을 우선해야 하며, 준비 없는 제도
          전환은 신중해야 한다는 내용입니다.
        </p>
        <p className="mt-2">
          또한 불가피한 변경이 필요할 경우 의료현장과 환자단체의 충분한 협의가 선행돼야 한다고
          강조했습니다.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-[#dbe1eb] bg-[#f8fafc] px-3 py-1.5 text-xs text-[#334155] transition-colors hover:bg-[#eef2ff]"
        >
          보도자료 바로가기
        </button>
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-[#dbe1eb] bg-[#f8fafc] px-3 py-1.5 text-xs text-[#334155] transition-colors hover:bg-[#eef2ff]"
        >
          노무근거자료
        </button>
      </div>

      <div className="mt-5 flex items-center justify-end gap-2">
        <button
          type="button"
          className="inline-flex h-8 items-center rounded-md border border-[#d1d5db] px-2.5 text-xs text-[#4b5563] transition-colors hover:bg-[#f8fafc]"
        >
          보관함 저장
        </button>
        <button
          type="button"
          className="inline-flex h-8 items-center rounded-md border border-[#d1d5db] px-2.5 text-xs text-[#4b5563] transition-colors hover:bg-[#f8fafc]"
        >
          복사
        </button>
      </div>

      <div className="mt-5 border-t border-[#e5e7eb] pt-5">
        <p className="mb-3 text-sm text-[#4b5563]">
          관심있는 주제가 있다면, 이렇게 물어볼 수 있어요.
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="inline-flex w-fit max-w-full items-center rounded-md bg-[#eef3ff] px-3 py-2 text-left text-sm text-[#1e3a8a] transition-colors hover:bg-[#dbeafe]"
          >
            <span className="truncate">1. 성분명 처방 관련된 현행 의견</span>
          </button>
          <button
            type="button"
            className="inline-flex w-fit max-w-full items-center rounded-md bg-[#eef3ff] px-3 py-2 text-left text-sm text-[#1e3a8a] transition-colors hover:bg-[#dbeafe]"
          >
            <span className="truncate">2. 성분명 반대</span>
          </button>
          <button
            type="button"
            className="inline-flex w-fit max-w-full items-center rounded-md bg-[#eef3ff] px-3 py-2 text-left text-sm text-[#1e3a8a] transition-colors hover:bg-[#dbeafe]"
          >
            <span className="truncate">3. 외국에서 성분명 처방이 어떻게 하고 있나요?</span>
          </button>
        </div>
      </div>
    </article>
  );
}
