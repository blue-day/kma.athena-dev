'use client';
import darkModeOffIcon from '@/shared/assets/images/icon-mode-dark-off.svg';
import darkModeOnIcon from '@/shared/assets/images/icon-mode-dark-on.svg';
import lightModeOffIcon from '@/shared/assets/images/icon-mode-light-off.svg';
import lightModeOnIcon from '@/shared/assets/images/icon-mode-light-on.svg';

interface ThemeModeSwitchProps {
  value: 'light' | 'dark';
  onChange: (mode: 'light' | 'dark') => void;
}

export const ThemeModeSwitch = ({ value, onChange }: ThemeModeSwitchProps) => {
  return (
    <div className="switch-theme-box ml-auto" role="radiogroup" aria-label="테마 선택">
      <div
        className={`switch-theme relative inline-grid h-10 w-[210px] grid-cols-2 items-center rounded-lg p-[3px] ${
          value === 'dark' ? 'bg-[#1a2433]' : 'bg-[#f8f9fc]'
        }`}
      >
        <span
          className={`pointer-events-none block absolute bottom-[3px] left-[3px] top-[3px] w-[calc((100%-6px)/2)] rounded-md shadow-[0_1px_2px_0_rgba(61,64,73,0.15)] transition-all duration-300 ${
            value === 'light' ? 'translate-x-0 bg-white' : 'translate-x-full bg-[#2c384a]'
          }`}
        />

        <button
          type="button"
          role="radio"
          aria-checked={value === 'light'}
          onClick={() => onChange('light')}
          className={`relative z-10 inline-flex h-full w-full items-center justify-center gap-1.5 rounded-md px-2 text-xs transition-colors ${
            value === 'light' ? 'text-[#2a3b56]' : 'text-[#7f8394] hover:text-[#7f8394]'
          }`}
        >
          <span
            className="h-[22px] w-[22px] shrink-0 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${value === 'light' ? lightModeOnIcon.src : lightModeOffIcon.src})` }}
            aria-hidden
          />
          <span>Light</span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={value === 'dark'}
          onClick={() => onChange('dark')}
          className={`relative z-10 inline-flex h-full w-full items-center justify-center gap-1.5 rounded-[8px] px-2 text-xs transition-colors ${
            value === 'dark' ? 'text-white' : 'text-[#7f8da3] hover:text-[#2a3b56]'
          }`}
        >
          <span
            className="h-[22px] w-[22px] shrink-0 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${value === 'dark' ? darkModeOnIcon.src : darkModeOffIcon.src})` }}
            aria-hidden
          />
          <span>Dark</span>
        </button>
      </div>
    </div>
  );
};
