'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@kma/ui-components';
import { MemberEntity } from '@kma/api-interface';
// import { MemberEntity } from '@/shared/api/generated/graphql';

export type OrgModalProps = {
  open: boolean;
  items: MemberEntity[];
  onClose: () => void;
  onApply: (picked: MemberEntity[]) => void;
};

const PAGE_SIZE = 10;
const PAGE_GROUP = 5;

export function OrgModal({ open, items, onClose, onApply }: OrgModalProps) {
  const [q, setQ] = useState('');
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return items;
    return items.filter((m) => (m.userId + m.userName).toLowerCase().includes(kw));
  }, [items, q]);

  useEffect(() => {
    setPage(1);
  }, [q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const groupStart = Math.floor((page - 1) / PAGE_GROUP) * PAGE_GROUP + 1;
  const groupEnd = Math.min(totalPages, groupStart + PAGE_GROUP - 1);
  const pageButtons = useMemo(() => {
    const arr: number[] = [];
    for (let p = groupStart; p <= groupEnd; p++) arr.push(p);
    return arr;
  }, [groupStart, groupEnd]);

  const pickedList = useMemo(() => items.filter((m) => picked[m.userId]), [items, picked]);

  if (!open) return null;

  return (
    <div
      className="kma-modal-backdrop"
      role="dialog"
      aria-modal="true"
    >
      <div className="kma-modal">
        <div className="kma-modal-head">
          <div className="kma-modal-title">조직도</div>
          <button
            className="kma-modal-x"
            type="button"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="kma-modal-body">
          <div
            className="kma-modal-search"
            style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <span
              className="kma-label"
              style={{ marginBottom: 0 }}
            >
              검색
            </span>
            <input
              className="kma-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="이름/ID"
              style={{ width: '200px' }}
            />
          </div>
          <div
            className="kma-modal-tablewrap"
            style={{ minHeight: '420px' }}
          >
            <table className="kma-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>선택</th>
                  <th style={{ width: 120 }}>ID</th>
                  <th>이름</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((m) => (
                  <tr key={m.userId}>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={!!picked[m.userId]}
                        onChange={(e) => setPicked((p) => ({ ...p, [m.userId]: e.target.checked }))}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center' }}>{m.userId}</td>
                    <td style={{ textAlign: 'center' }}>{m.userName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="kma-paging"
            style={{ marginTop: '20px' }}
          >
            <button
              className="kma-pagebtn"
              type="button"
              disabled={page === 1}
              onClick={() => setPage(1)}
            >
              {'<<'}
            </button>
            <button
              className="kma-pagebtn"
              type="button"
              disabled={page === 1}
              onClick={() => setPage(Math.max(1, page - 1))}
            >
              {'<'}
            </button>
            {pageButtons.map((p) => (
              <button
                key={p}
                className={`kma-pagebtn ${p === page ? 'is-active' : ''}`}
                type="button"
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="kma-pagebtn"
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage(Math.min(totalPages, page + 1))}
            >
              {'>'}
            </button>
            <button
              className="kma-pagebtn"
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
            >
              {'>>'}
            </button>
          </div>
        </div>
        <div className="kma-modal-foot">
          <Button
            variant="primary"
            onClick={() => onApply(pickedList)}
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
