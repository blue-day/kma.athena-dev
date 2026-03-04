'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { memberGet } from '@/entities/member/api/memberApi';
import { attachList, uiError } from '@kma/utils';
import { MemberFormWidget } from '@/widgets/member/ui/MemberFormWidget';
import { MemberFormValueType } from '@kma/api-interface';
import { AttachItem } from '@/features/member/ui/MemberAttachment';

export function MemberEditPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const backQS = `?${searchParams?.toString() ?? ''}`;

  const [memberForm, setMemberForm] = useState<MemberFormValueType | null>(null);
  const [formFiles, setFormFiles] = useState<AttachItem[]>([]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const resEdit = await memberGet(id);
        if (!resEdit) throw new Error('회원 없음');

        let loadedFiles: AttachItem[] = [];
        if (resEdit.fileGrpId) {
          const list = await attachList(resEdit.fileGrpId);
          loadedFiles = list.map((f) => ({ ...f, name: f.fileNm, size: f.fileSize }));
        }

        setFormFiles(loadedFiles);
        setMemberForm({
          userId: resEdit.userId,
          userName: resEdit.userName,
          age: resEdit.age ? String(resEdit.age) : '',
          joinDate: resEdit.joinDate ?? '',
          content: resEdit.content ?? '',
          fileGrpId: resEdit.fileGrpId,
        });
      } catch (e: any) {
        uiError('오류', e.message);
        router.push(`/members${backQS}`);
      }
    })();
  }, [id, router, backQS]);

  if (!memberForm) return null;

  return (
    <div className="kma-page">
      <div className="kma-title">회원 수정</div>
      <div className="kma-divider" />
      <MemberFormWidget
        mode="edit"
        initialValues={memberForm}
        initialFiles={formFiles}
        onSuccess={(uid: string) => router.push(`/members/${uid}${backQS}`)}
        onCancel={() => router.push(`/members/${id}${backQS}`)}
      />
    </div>
  );
}
