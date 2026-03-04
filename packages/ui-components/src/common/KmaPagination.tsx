import React, { useMemo } from 'react';

interface KmaPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageGroupSize?: number; // 페이지 그룹 크기 (기본값: 10)
}

export function KmaPagination({ page, totalPages, onPageChange, pageGroupSize = 10 }: KmaPaginationProps) {
  const groupStart = Math.floor((page - 1) / pageGroupSize) * pageGroupSize + 1;
  const groupEnd = Math.min(totalPages, groupStart + pageGroupSize - 1);

  const pageButtons = useMemo(() => {
    return Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => groupStart + i);
  }, [groupStart, groupEnd]);

  if (totalPages <= 0) return null;

  return (
    <div className="kma-paging">
      <button
        className="kma-pagebtn"
        disabled={page === 1}
        onClick={() => onPageChange(1)}
      >
        {'<<'}
      </button>
      <button
        className="kma-pagebtn"
        disabled={page === 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        {'<'}
      </button>

      {pageButtons.map((p) => (
        <button
          key={p}
          className={`kma-pagebtn ${p === page ? 'is-active' : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        className="kma-pagebtn"
        disabled={page === totalPages}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      >
        {'>'}
      </button>
      <button
        className="kma-pagebtn"
        disabled={page === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        {'>>'}
      </button>
    </div>
  );
}
