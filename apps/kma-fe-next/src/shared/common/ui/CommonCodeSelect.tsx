'use client';

import React, { useEffect, useMemo } from 'react';
// kma-comn 라이브러리에서 제공하는 전역 캐싱 훅 사용
import { useCommonCode } from '@kma/comn';

interface CommonCodeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  upCd: string;
  label?: string;
  showAll?: boolean;
  allText?: string;
  filterFn?: (code: any) => boolean;
  isRequired?: boolean;
}

export function CommonCodeSelect({
  upCd,
  label,
  showAll = true,
  allText = '전체',
  filterFn,
  isRequired,
  className = '',
  ...props
}: CommonCodeSelectProps) {
  // 라이브러리 내부 Zustand 스토어에서 중복 호출을 자동 방지함
  const { loadCodes, getList } = useCommonCode();
  const rawOptions = getList(upCd);

  const options = useMemo(() => {
    return filterFn ? rawOptions.filter(filterFn) : rawOptions;
  }, [rawOptions, filterFn]);

  useEffect(() => {
    if (upCd) {
      loadCodes(upCd);
    }
  }, [upCd, loadCodes]);

  return (
    <div className="kma-select-wrapper w-full">
      {label && (
        <label className="kma-label">
          {label} {isRequired && <span className="kma-required">*</span>}
        </label>
      )}
      <select
        className={`kma-input ${className}`}
        {...props}
      >
        {showAll && <option value="">{allText}</option>}
        {options.map((opt) => (
          <option
            key={opt.comnCd}
            value={opt.comnCd}
          >
            {opt.comnNm}
          </option>
        ))}
      </select>
    </div>
  );
}
