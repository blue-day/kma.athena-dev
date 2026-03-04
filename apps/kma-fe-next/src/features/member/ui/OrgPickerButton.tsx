'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { memberList } from '@/entities/member/api/memberApi';
import { MemberType } from '@kma/api-interface';

const MemberSearchModal = dynamic(() => import('@kma/ui-components').then((mod) => mod.MemberSearchModal), {
  ssr: false,
  loading: () => <div>로딩 중...</div>,
});

export function OrgPickerButton({ onPickedNames }: { onPickedNames: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MemberType[]>([]);

  const load = async () => {
    try {
      const res = await memberList(undefined);
      setItems(res.memberList ?? []);
    } catch (err) {
      console.error('데이터 로드 실패', err);
    }
  };

  const handleClick = async () => {
    await load();
    setOpen(true);
  };

  return (
    <>
      <button
        className="kma-btn kma-btn-outline"
        type="button"
        onClick={handleClick}
      >
        조직도
      </button>

      {open && (
        <MemberSearchModal
          open={open}
          items={items}
          title="조직도 검색"
          maxRows={10}
          onClose={() => setOpen(false)}
          onApply={(picked) => {
            const name = picked.map((p) => p.userName).join(', ');
            onPickedNames(name);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}
