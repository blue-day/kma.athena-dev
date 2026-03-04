'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MemberFormValueType } from '@kma/api-interface';

const MemberFormWidget = dynamic(
  () => import('@/widgets/member/ui/MemberFormWidget').then((mod) => mod.MemberFormWidget),
  { ssr: false, loading: () => <div className="kma-loading">폼 로딩 중...</div> },
);

export function MemberCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const backQS = searchParams?.size ? `?${searchParams.toString()}` : '';

  const [memberForm, setMemberForm] = useState<MemberFormValueType | null>(null);

  useEffect(() => {
    setMemberForm({
      userId: '',
      userName: '',
      age: '',
      content: '',
      fileGrpId: null,
    });
  }, []);

  if (!memberForm) return null;

  return (
    <div className="kma-page">
      <div className="kma-title">회원 등록</div>
      <div className="kma-divider" />
      <MemberFormWidget
        mode="create"
        initialValues={memberForm}
        initialFiles={[]}
        onSuccess={() => router.push(`/members${backQS}`)}
        onCancel={() => router.push(`/members${backQS}`)}
      />
    </div>
  );
}
