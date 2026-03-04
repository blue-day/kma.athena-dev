'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MemberFormValueType } from '@kma/api-interface';
import { MemberContentEditor } from '@/entities/member/ui/MemberContentEditor';
import { MemberInfoTable } from '@/entities/member/ui/MemberInfoTable';
import { MemberAttachment } from '@/features/member/ui/MemberAttachment';
import { memberUpsert } from '@/entities/member/api/memberApi';
import { attachUpload, attachDelete, uiAlert, uiConfirm, uiError } from '@kma/utils';
import { OrgPickerButton } from '@/features/member/ui/OrgPickerButton';
import { UserPickerButton } from '@/features/member/ui/UserPickerButton';
import { HwpImportButton } from '@/features/member/ui/HwpImportButton';
import { Button } from '@kma/ui-components';
import type { AttachItem } from '@/features/member/ui/MemberAttachment';

interface Props {
  mode: 'create' | 'edit';
  initialValues: MemberFormValueType;
  initialFiles: AttachItem[];
  onSuccess: (id: string) => void;
  onCancel: () => void;
}

export function MemberFormWidget({ mode, initialValues, initialFiles, onSuccess, onCancel }: Props) {
  const editorRef = useRef<any>(null);
  const [form, setForm] = useState<MemberFormValueType>(initialValues);
  const [files, setFiles] = useState<AttachItem[]>(initialFiles);
  const isDataLoaded = useRef(false);

  useEffect(() => {
    if (!isDataLoaded.current && initialValues.userId) {
      setForm(initialValues);
      setFiles(initialFiles);
      isDataLoaded.current = true;

      if (initialValues.content && editorRef.current) {
        setTimeout(() => {
          editorRef.current?.setHTML(initialValues.content);
        }, 300);
      }
    }
  }, [initialValues, initialFiles]);

  const handleRemoveFile = async (idx: number) => {
    const target = files[idx];
    if (!(await uiConfirm('파일 삭제', `[${target.name}] 파일을 삭제하시겠습니까?`))) return;
    try {
      if (mode === 'edit' && target.fileGrpId && target.fileId) {
        await attachDelete(target.fileGrpId, target.fileId);
      }
      setFiles((p) => p.filter((_, i) => i !== idx));
    } catch (e: any) {
      uiError('삭제 실패', e.message);
    }
  };

  const handleSubmit = async () => {
    if (!form.userId?.trim() || !form.userName?.trim()) {
      return uiAlert('필수값', 'ID와 이름은 필수입니다.');
    }

    const latestContent = editorRef.current?.getHTML() || '';
    if (!latestContent.replace(/<[^>]*>/g, '').trim()) {
      return uiAlert('내용 미입력', '내용을 입력해주세요.');
    }

    if (!(await uiConfirm('저장', '저장하시겠습니까?'))) return;

    try {
      let fgi: string | null = form.fileGrpId ?? null;
      const pending = files.filter((f) => f.file).map((f) => f.file!) as File[];

      if (pending.length > 0) {
        const up = await attachUpload(fgi, pending);
        fgi = up.fileGrpId;
      }

      await memberUpsert({
        userId: form.userId,
        userName: form.userName,
        age: form.age ? Number(form.age) : null,
        content: latestContent,
        fileGrpId: fgi,
      });

      uiAlert('성공', '정상적으로 처리되었습니다.').then(() => {
        onSuccess(form.userId);
      });
    } catch (e: any) {
      uiError('저장 실패', e.message);
    }
  };

  return (
    <div className="kma-card">
      <MemberInfoTable
        mode={mode}
        value={form}
        onChange={setForm}
        readonlyId={mode === 'edit'}
        rightElement={<OrgPickerButton onPickedNames={(n) => setForm((p) => ({ ...p, userName: n }))} />}
      />

      <MemberContentEditor
        ref={editorRef}
        value={form.content ?? ''}
        onChange={(v) => setForm((p) => ({ ...p, content: v }))}
        // toolbar={
        //   <HwpImportButton
        //     onImport={(html) => {
        //       setForm((p) => ({ ...p, content: html }));
        //       editorRef.current?.setHTML(html);
        //     }}
        //   />
        // }
      />

      <MemberAttachment
        files={files}
        onAdd={(fl) => {
          if (!fl) return;
          const next = Array.from(fl).map((f) => ({ name: f.name, size: f.size, file: f }) as any);
          setFiles((p) => [...p, ...next]);
        }}
        onRemove={handleRemoveFile}
      />

      <div className="kma-actions-center">
        <Button
          variant="primary"
          onClick={handleSubmit}
        >
          저장
        </Button>
        <Button
          variant="secondary"
          onClick={onCancel}
        >
          취소
        </Button>
      </div>
    </div>
  );
}
