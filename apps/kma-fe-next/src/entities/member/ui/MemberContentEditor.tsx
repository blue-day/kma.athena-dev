'use client';

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { FroalaEditor } from '@kma/ui-components';

interface Props {
  value: string;
  onChange?: (v: string) => void;
  toolbar?: React.ReactNode;
  readonly?: boolean;
}

export const MemberContentEditor = forwardRef<any, Props>(
  ({ value, onChange, toolbar, readonly = false }, ref) => {
    const editorInstanceRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      getHTML: () => editorInstanceRef.current?.getHTML() || '',
      setHTML: (html: string) => editorInstanceRef.current?.setHTML(html || ''),
    }));

    return (
      <div className="kma-editor-wrap mt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="kma-label font-bold text-gray-700">내용</label>
        </div>

        {readonly ? (
          /* 상세 보기 모드: 에디터 없이 내용만 출력 */
          <div className="kma-view-container p-5 border rounded-md bg-white min-h-[300px]">
            {/* fr-view 클래스는 Froala에서 작성된 스타일(폰트, 정렬 등)을 
               외부에서도 동일하게 유지시켜주는 필수 클래스
            */}
            <div
              className="fr-view"
              dangerouslySetInnerHTML={{ __html: value || '<p class="text-gray-400">내용이 없습니다.</p>' }}
            />
          </div>
        ) : (
          /* 작성/수정 모드: 에디터 출력 */
          <>
            {!readonly && toolbar && (
              <div
                className="kma-editor-tools"
                style={{ marginBottom: '10px' }}
              >
                {toolbar}
              </div>
            )}
            <FroalaEditor
              ref={editorInstanceRef}
              initialValue={value}
              height="500px"
              onChange={onChange}
              readOnly={readonly}
            />
          </>
        )}
      </div>
    );
  },
);

MemberContentEditor.displayName = 'MemberContentEditor';
