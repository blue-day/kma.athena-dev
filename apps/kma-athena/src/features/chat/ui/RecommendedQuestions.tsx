interface RecommendedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export function RecommendedQuestions({ questions, onSelect }: RecommendedQuestionsProps) {
  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 border-t border-[#e5e7eb] pt-5">
      <p className="mb-3 text-sm text-[#4b5563]">관심있는 주제가 있다면, 이렇게 물어볼 수 있어요.</p>
      <div className="flex flex-col gap-2">
        {questions.map((question, index) => (
          <button
            key={`${question}-${index}`}
            type="button"
            onClick={() => onSelect(question)}
            className="inline-flex w-fit max-w-full items-center rounded-md bg-[#eef3ff] px-3 py-2 text-left text-sm text-[#1e3a8a] transition-colors hover:bg-[#dbeafe]"
          >
            <span className="truncate">{`${index + 1}. ${question}`}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
