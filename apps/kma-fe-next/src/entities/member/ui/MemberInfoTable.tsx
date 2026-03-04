import React from 'react';
import { MemberFormValueType } from '@kma/api-interface';
import { formatDateTime } from '@kma/utils';

interface Props {
  mode: 'create' | 'new' | 'edit' | 'view';
  value: MemberFormValueType;
  onChange: (v: MemberFormValueType) => void;
  readonlyId?: boolean;
  rightElement?: React.ReactNode;
}

export function MemberInfoTable({ mode, value, onChange, readonlyId, rightElement }: Props) {
  const isView = mode === 'view';
  const Read = ({ v }: { v: any }) => <div className="kma-readonly">{v || ''}</div>;

  return (
    <table className="kma-form-table">
      <tbody>
        <tr>
          <th style={{ width: '150px' }}>
            ID {(mode === 'create' || mode === 'new') && <span className="kma-required">*</span>}
          </th>
          <td style={{ width: '350px' }}>
            {isView ? (
              <Read v={value.userId} />
            ) : (
              <input
                className="kma-input"
                value={value.userId}
                readOnly={readonlyId}
                placeholder="ID 입력"
                onChange={(e) => onChange({ ...value, userId: e.target.value })}
              />
            )}
          </td>
          <th style={{ width: '150px' }}>
            이름 <span className="kma-required">*</span>
          </th>
          <td>
            {isView ? (
              <Read v={value.userName} />
            ) : (
              <div className="kma-inline w-full">
                <input
                  className="kma-input"
                  value={value.userName}
                  placeholder="이름 입력"
                  onChange={(e) => onChange({ ...value, userName: e.target.value })}
                />
                {rightElement}
              </div>
            )}
          </td>
        </tr>
        <tr>
          <th>나이</th>
          <td colSpan={3}>
            {isView ? (
              <Read v={value.age} />
            ) : (
              <input
                className="kma-input"
                style={{ width: '120px' }}
                value={value.age}
                placeholder="나이"
                onChange={(e) => onChange({ ...value, age: e.target.value.replace(/[^0-9]/g, '') })}
              />
            )}
          </td>
        </tr>
        {(mode === 'edit' || mode === 'view') && value.joinDate && (
          <tr>
            <th>가입일</th>
            <td colSpan={3}>
              <Read v={formatDateTime(value.joinDate)} />
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
