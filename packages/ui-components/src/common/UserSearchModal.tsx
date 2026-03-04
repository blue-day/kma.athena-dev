'use client';

import React, { useMemo, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { MemberType } from '@kma/api-interface';
import { Button } from './Button';

const KendoGrid = dynamic(() => import('../grid/KendoGrid').then((mod) => mod.KendoGrid), { ssr: false });
const KmaPagination = dynamic(() => import('./KmaPagination').then((mod) => mod.KmaPagination), {
  ssr: false,
});

export type UserSearchModalProps = {
  open: boolean;
  items: MemberType[];
  onClose: () => void;
  onApply: (picked: MemberType[]) => void;
  title?: string;
  maxRows?: number;
};

const PAGE_SIZE = 10;

export function UserSearchModal({
  open,
  items,
  onClose,
  onApply,
  title = '사용자 검색',
  maxRows = 10,
}: UserSearchModalProps) {
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [pickedIds, setPickedIds] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);

  // 검색 로직
  const filtered = useMemo(() => {
    const kw = searchKeyword.trim().toLowerCase();
    if (!kw) return items;
    return items.filter((m) => ((m.userId || '') + (m.userName || '')).toLowerCase().includes(kw));
  }, [items, searchKeyword]);

  // 페이지네이션 계산
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const handleSearch = () => {
    setSearchKeyword(keyword);
    setPage(1);
  };

  const handleReset = () => {
    setKeyword('');
    setSearchKeyword('');
    setPage(1);
  };

  // 그리드 컬럼 정의
  const columns = useMemo(
    () => [
      { field: 'selected', title: ' ', width: 50, align: 'center' as const },
      { field: 'userId', title: 'ID', width: 150, align: 'center' as const },
      { field: 'userName', title: '이름', align: 'left' as const },
    ],
    [],
  );

  // 그리드 셀 렌더링
  const renderCell = useCallback(
    (props: any) => {
      const { field, dataItem, style } = props;
      const id = dataItem.userId;

      if (field === 'selected') {
        return (
          <td style={{ ...style, textAlign: 'center' }}>
            <input
              type="checkbox"
              checked={!!pickedIds[id]}
              onChange={(e) => {
                setPickedIds((prev) => ({ ...prev, [id]: e.target.checked }));
              }}
              style={{ cursor: 'pointer' }}
            />
          </td>
        );
      }

      return (
        <td
          style={{ ...style, cursor: 'pointer' }}
          onClick={() => {
            setPickedIds((prev) => ({ ...prev, [id]: !prev[id] }));
          }}
        >
          {dataItem[field] ?? ''}
        </td>
      );
    },
    [pickedIds],
  );

  if (!open) return null;

  return (
    <div
      className="kma-modal-backdrop"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="kma-modal"
        style={{ maxWidth: '600px' }}
      >
        <div className="kma-modal-head">
          <div className="kma-modal-title">{title}</div>
          <button
            className="kma-modal-x"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div
          className="kma-modal-body"
          style={{ padding: '20px 24px' }}
        >
          <div className="flex items-center gap-2 mb-4 p-4 bg-gray-50 rounded">
            <span className="font-bold text-sm">검색어</span>
            <input
              className="kma-input"
              style={{ width: '240px' }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="이름/ID 입력"
            />
            <div className="flex gap-1 ml-auto">
              <Button
                variant="primary"
                onClick={handleSearch}
              >
                조회
              </Button>
              <Button
                variant="secondary"
                onClick={handleReset}
              >
                초기화
              </Button>
            </div>
          </div>

          <KendoGrid
            columns={columns}
            data={pageItems}
            rowKey="userId"
            maxRows={maxRows}
            renderCell={renderCell}
          />

          <div className="mt-5">
            <KmaPagination
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </div>

        <div className="kma-modal-foot">
          <Button
            variant="primary"
            onClick={() => {
              const selectedUsers = items.filter((m) => pickedIds[m.userId]);
              onApply(selectedUsers);
            }}
            style={{ minWidth: '80px' }}
          >
            적용
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            style={{ minWidth: '80px' }}
          >
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
