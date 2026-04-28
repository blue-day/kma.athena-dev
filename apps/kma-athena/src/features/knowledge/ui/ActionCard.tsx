interface ActionCardProps {
  title: string;
  description: string;
  className?: string;
  isDisabled?: boolean;
  onClick?: () => void;
}

export const ActionCard = ({
  title,
  description,
  className = '',
  isDisabled = false,
  onClick,
}: ActionCardProps) => {
  const baseClassName =
    'w-[calc(100%-12px)] md:w-full md:max-w-[296px] md:min-h-[240px] rounded-2xl md:rounded-[24px] border border-gray-border ring-[6px] md:ring-8 ring-[var(--kma-card-border)] m-1.5 md:m-2 p-4 pl-[86px] md:p-[30px] md:pt-[126px] text-left md:text-center';
  const stateClassName = isDisabled
    ? 'cursor-not-allowed'
    : 'transition-all duration-300 hover:-translate-y-0.5';

  return (
    <button
      type="button"
      className={`${baseClassName} ${stateClassName} ${className}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      <h3 className="md:text-xl font-bold leading-tight">{title}</h3>
      <p className="mt-1.5 md:mt-4 text-[13px] leading-[1.25] md:text-sm text-gray-300 whitespace-pre-line">
        {description}
      </p>
    </button>
  );
};
