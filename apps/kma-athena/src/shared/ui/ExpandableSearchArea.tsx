'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import searchIcon from '@/shared/assets/images/icon-menu-search.svg';
import { CommonInput } from './CommonInput';
import { CommonSelect } from './CommonSelect';

type ExpandableSearchAreaProps = {
  options?: string[];
  defaultOption?: string;
  inputPlaceholder?: string;
  selectAriaLabel?: string;
  inputAriaLabel?: string;
  onSearch?: (params: { type: string; keyword: string }) => void;
};

const DEFAULT_OPTIONS = ['보관일순', '생성일순'];

export function ExpandableSearchArea({
  options = DEFAULT_OPTIONS,
  defaultOption,
  inputPlaceholder = '제목으로 검색해주세요.',
  selectAriaLabel = '검색 조건',
  inputAriaLabel = '검색어',
  onSearch,
}: ExpandableSearchAreaProps) {
  const initialOption = defaultOption ?? options[0] ?? '';
  const [selectedType, setSelectedType] = useState(initialOption);
  const [keyword, setKeyword] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSearch = () => {
    onSearch?.({ type: selectedType, keyword: keyword.trim() });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isExpanded) {
      setIsExpanded(true);
      return;
    }

    handleSearch();
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setKeyword('');
  };

  useEffect(() => {
    if (!isExpanded || !formRef.current) {
      return;
    }

    // width transition이 시작된 직후 input 포커스를 주면 체감이 더 자연스럽습니다.
    const focusTimer = window.setTimeout(() => {
      const input = formRef.current?.querySelector<HTMLInputElement>(
        `input[aria-label="${inputAriaLabel}"]`,
      );
      input?.focus();
    }, 140);

    return () => {
      window.clearTimeout(focusTimer);
    };
  }, [isExpanded, inputAriaLabel]);

  return (
    <div className="px-4 md:px-0 w-full flex-1 ">
      <form
        ref={formRef}
        className={`search-box flex h-10 flex-1 items-center justify-end ${
          isExpanded ? 'overflow-hidden rounded-full border border-[#ddd]' : ''
        }`}
        onSubmit={handleSubmit}
      >
        <div
          className={`relative h-10 transition-all duration-300 ease-out ${
            isExpanded ? 'w-full' : 'w-[140px] mr-2'
          }`}
        >
          <div
            className={`absolute inset-0 transition-all duration-200 ease-out ${
              isExpanded
                ? 'pointer-events-none translate-x-1.5 scale-[0.98] opacity-0'
                : 'translate-x-0 scale-100 opacity-100'
            }`}
          >
            <CommonSelect
              options={options}
              value={selectedType}
              onChange={setSelectedType}
              ariaLabel={selectAriaLabel}
              className="ipt-select w-[140px] !flex-none"
            />
          </div>

          <div
            className={`absolute inset-0 transition-all duration-200 ease-out ${
              isExpanded
                ? 'translate-x-0 scale-100 opacity-100'
                : 'pointer-events-none -translate-x-1.5 scale-[0.98] opacity-0'
            }`}
          >
            <CommonInput
              value={keyword}
              onChange={setKeyword}
              placeholder={inputPlaceholder}
              aria-label={inputAriaLabel}
              disabled={!isExpanded}
            />
          </div>
        </div>

        <button
          type="submit"
          className={`btn-search inline-flex h-10 w-10 shrink-0 items-center justify-center
            ${isExpanded
              ? ''
              : 'border border-[#ddd] rounded-full'
          }`}
          aria-label={isExpanded ? '검색' : '검색영역 펼치기'}
        >
          <span className="sr-only">검색</span>
        </button>

        <button
          type="button"
          className={`inline-flex h-full shrink-0 items-center whitespace-nowrap text-sm transition-all duration-250 ease-out ${
            isExpanded
              ? 'pointer-events-auto mr-4 opacity-100 w-10 px-2'
              : 'pointer-events-none w-0 overflow-hidden border-transparent px-0 opacity-0'
          }`}
          onClick={handleCancel}
          tabIndex={isExpanded ? 0 : -1}
        >
          취소
        </button>
      </form>
    </div>
  );
}
