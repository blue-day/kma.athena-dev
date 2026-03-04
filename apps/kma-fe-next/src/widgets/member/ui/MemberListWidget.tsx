'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MemberType, MemberSearchFilter } from '@kma/api-interface';
import { formatDateTime } from '@kma/utils';
import { MemberSearchBox } from '@/features/member/ui/MemberSearchBox';
import { Button } from '@kma/ui-components';

const KendoGrid = dynamic(() => import('@kma/ui-components').then((mod) => mod.KendoGrid), { ssr: false });
const KmaPagination = dynamic(() => import('@kma/ui-components').then((mod) => mod.KmaPagination), {
  ssr: false,
});

interface Props {
  memberList: MemberType[];
  filter: MemberSearchFilter;
  onFilterChange: (updates: Partial<MemberSearchFilter>) => void;
  onSearchClick: () => void;
  onReset: () => void;
  onRowClick: (userId: string) => void;
  onCreateClick: () => void;
  maxRows?: number;
}

const PAGE_SIZE = 10;

export function MemberListWidget({
  memberList,
  filter,
  onFilterChange,
  onSearchClick,
  onReset,
  onRowClick,
  onCreateClick,
  maxRows = 10,
}: Props) {
  const columns = useMemo(
    () => [
      { field: 'displayNum', title: 'No.', width: 60, align: 'center' as const },
      { field: 'userId', title: 'ID', width: 160, align: 'center' as const },
      { field: 'userName', title: '이름 (클릭)', align: 'left' as const },
      { field: 'age', title: '나이', width: 120, align: 'center' as const },
      { field: 'joinDateFmt', title: '가입일시', width: 200, align: 'center' as const },
    ],
    [],
  );

  const totalPages = Math.max(1, Math.ceil(memberList.length / PAGE_SIZE));

  const pageItems = useMemo(() => {
    const start = (filter.page - 1) * PAGE_SIZE;
    return memberList.slice(start, start + PAGE_SIZE).map((it: any, idx) => {
      return {
        ...it,
        displayNum: start + idx + 1,
        joinDateFmt: formatDateTime(it.joinDate),
      };
    });
  }, [memberList, filter.page]);

  return (
    <div className="kma-card">
      <MemberSearchBox
        filter={filter}
        onFilterChange={onFilterChange}
        onSearchClick={onSearchClick}
        onReset={onReset}
      />

      <KendoGrid
        columns={columns}
        data={pageItems}
        rowKey="userId"
        maxRows={maxRows}
        onClickCell={(row, field) => {
          if (field === 'userName') onRowClick(row.userId);
        }}
      />

      <div className="mt-5">
        <KmaPagination
          page={filter.page}
          totalPages={totalPages}
          onPageChange={(p) => onFilterChange({ page: p })}
        />
      </div>
      <div className="kma-actions-right">
        <Button
          variant="primary"
          onClick={onCreateClick}
        >
          등록
        </Button>
      </div>
    </div>
  );
}
