'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { memberGet, memberDelete } from '@/entities/member/api/memberApi';
import { attachList, uiError, uiConfirm, uiAlert } from '@kma/utils';
import { MemberDetailWidget } from '@/widgets/member/ui/MemberDetailWidget';
import { AttachItem } from '@/features/member/ui/MemberAttachment';

export function MemberDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const backQS = searchParams?.size ? `?${searchParams.toString()}` : '';

  const [memberDetail, setMemberDetail] = useState<any>(null);
  const [detailFiles, setDetailFiles] = useState<AttachItem[]>([]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const resDetail = await memberGet(id);
        if (!resDetail) throw new Error('회원 정보를 찾을 수 없습니다.');

        let loadedFiles: AttachItem[] = [];
        if (resDetail.fileGrpId) {
          const list = await attachList(resDetail.fileGrpId);
          loadedFiles = list.map((f) => ({ ...f, name: f.fileNm, size: f.fileSize }));
        }
        setDetailFiles(loadedFiles);
        setMemberDetail({ ...resDetail, age: String(resDetail.age ?? '') });
      } catch (e: any) {
        uiError('오류', e.message);
        router.push(`/members${backQS}`);
      }
    })();
  }, [id, router, backQS]);

  const handleDelete = async () => {
    if (!(await uiConfirm('회원 삭제', '정말 삭제하시겠습니까?'))) return;
    try {
      await memberDelete(id);
      await uiAlert('삭제 성공', '정상적으로 삭제되었습니다.');
      router.push(`/members${backQS}`);
    } catch (e: any) {
      uiError('삭제 실패', e.message);
    }
  };

  if (!memberDetail) return <div className="p-10 text-center">데이터 로딩 중...</div>;

  return (
    <div className="kma-page">
      <div className="kma-title">회원 상세 정보</div>
      <div className="kma-divider" />
      <MemberDetailWidget
        memberDetail={memberDetail}
        files={detailFiles}
        onEdit={() => router.push(`/members/${id}/edit${backQS}`)}
        onDelete={handleDelete}
        onList={() => router.push(`/members${backQS}`)}
      />
    </div>
  );
}
