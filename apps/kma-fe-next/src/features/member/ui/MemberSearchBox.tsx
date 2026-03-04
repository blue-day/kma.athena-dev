'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { CommonCodeSelect } from '@/shared/common/ui/CommonCodeSelect';
import { MemberSearchFilter } from '@kma/api-interface';
import { Button } from '@kma/ui-components';

const KmaDateRangePicker = dynamic(() => import('@kma/ui-components').then((mod) => mod.KmaDateRangePicker), {
  ssr: false,
});

interface Props {
  filter: MemberSearchFilter;
  onFilterChange: (updates: Partial<MemberSearchFilter>) => void;
  onSearchClick: () => void;
  onReset: () => void;
}

export function MemberSearchBox({ filter, onFilterChange, onSearchClick, onReset }: Props) {
  const excludeList = ['자유게시판', '학술자료조회'];

  return (
    <div className="member-search-box">
      {/* 첫 번째 행: 가입일 + 검색어 */}
      <div className="search-row">
        <div className="flex-none">
          <KmaDateRangePicker
            label="가입일 조회"
            value={filter.dateRange}
            onChange={(r) => onFilterChange({ dateRange: r })}
          />
        </div>
        <div className="search-keyword-area">
          <label className="kma-label">검색어</label>
          <input
            className="kma-input"
            placeholder="ID 또는 이름 입력"
            value={filter.keyword}
            onChange={(e) => onFilterChange({ keyword: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && onSearchClick()}
          />
        </div>
      </div>

      {/* 두 번째 행: 콤보박스 + 버튼들 */}
      <div className="search-row">
        <CommonCodeSelect
          label="지역본부"
          upCd="com00006"
          value={filter.areaCd}
          onChange={(e) => onFilterChange({ areaCd: e.target.value })}
        />
        <CommonCodeSelect
          label="등록예시"
          upCd="com00007"
          isRequired
          value={filter.payDiv}
          onChange={(e) => onFilterChange({ payDiv: e.target.value })}
        />
        <CommonCodeSelect
          label="필터예시"
          upCd="com00009"
          filterFn={(item) => !excludeList.includes(item.comnNm)}
          value={filter.boardDiv}
          onChange={(e) => onFilterChange({ boardDiv: e.target.value })}
        />

        {/* 버튼 영역 */}
        <div className="search-button-area">
          <Button
            variant="primary"
            onClick={onSearchClick}
          >
            조회
          </Button>
          <Button
            variant="reset"
            onClick={onReset}
          >
            초기화
          </Button>
        </div>
      </div>
    </div>
  );
}
