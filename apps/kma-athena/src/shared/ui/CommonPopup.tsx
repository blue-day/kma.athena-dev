'use client';

type CommonPopupProps = {
  open: boolean;
  title?: string;
  message: string;
  onClose: () => void;
};

export function CommonPopup({ open, title, message, onClose }: CommonPopupProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="athena-popup-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="athena-popup"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'popup'}
      >
        {title ? <h3 className="athena-popup-title">{title}</h3> : null}
        <p className="athena-popup-message">{message}</p>
        <button
          type="button"
          className="athena-popup-button"
          onClick={onClose}
        >
          {'\ud655\uc778'}
        </button>
      </div>
    </div>
  );
}
