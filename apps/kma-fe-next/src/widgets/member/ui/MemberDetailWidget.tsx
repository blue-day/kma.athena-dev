import React from 'react';
import { MemberFormValueType } from '@kma/api-interface';
import { MemberInfoTable } from '@/entities/member/ui/MemberInfoTable';
import { MemberContentEditor } from '@/entities/member/ui/MemberContentEditor';
import { MemberAttachment, AttachItem } from '@/features/member/ui/MemberAttachment';
import { Button } from '@kma/ui-components';

interface Props {
  memberDetail: MemberFormValueType;
  files: AttachItem[];
  onEdit: () => void;
  onDelete: () => Promise<void> | void;
  onList: () => void;
}

export function MemberDetailWidget({ memberDetail, files, onEdit, onDelete, onList }: Props) {
  return (
    <div className="kma-card">
      <MemberInfoTable
        mode="view"
        value={memberDetail}
        onChange={() => {}}
        readonlyId
      />
      <MemberContentEditor
        value={memberDetail.content}
        onChange={() => {}}
        readonly
      />
      <MemberAttachment
        files={files}
        onAdd={() => {}}
        onRemove={() => {}}
        readonly
      />

      <div className="kma-actions-center mt-6">
        <Button
          variant="dark"
          onClick={onEdit}
        >
          수정
        </Button>
        <Button
          variant="danger"
          onClick={onDelete}
        >
          삭제
        </Button>
        <Button
          variant="secondary"
          onClick={onList}
        >
          목록
        </Button>
      </div>
    </div>
  );
}
