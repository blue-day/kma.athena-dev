import React, { useRef } from 'react';
import { AttachDto } from '@kma/api-interface';
import { attachDownloadUrl } from '@kma/utils';

// AttachItem 타입을 여기서 정의하고 export (다른 파일에서 import해서 사용)
export type AttachItem = AttachDto & {
  file?: File;
  name: string;
  size: number;
};

interface Props {
  files: AttachItem[];
  onAdd: (files: FileList | null) => void;
  onRemove: (idx: number) => void | Promise<void>;
  readonly?: boolean;
}

export function MemberAttachment({ files, onAdd, onRemove, readonly = false }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDownload = (f: AttachItem) => {
    if (!f.fileGrpId || !f.fileId) return;
    window.open(attachDownloadUrl(f.fileGrpId, f.fileId), '_blank');
  };

  return (
    <div className="kma-attach">
      <div className="kma-attach-head">첨부파일</div>
      <div className="kma-attach-body">
        {!readonly && (
          <div
            className="kma-attach-drop"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onAdd(e.dataTransfer.files);
            }}
          >
            <div className="kma-attach-icon">📁</div>
            <div className="kma-attach-text">
              파일을 드래그하거나 <span className="kma-attach-link">클릭</span>하여 첨부하세요.
            </div>
            <input
              ref={inputRef}
              type="file"
              multiple
              className="kma-hidden"
              onChange={(e) => onAdd(e.target.files)}
            />
          </div>
        )}

        {files.length > 0 && (
          <div className="kma-attach-list">
            {files.map((f, idx) => (
              <div
                key={`${f.fileId || 'new'}_${idx}`}
                className="kma-attach-item"
              >
                <div className="kma-attach-name">
                  <span className="kma-fileicon">📄</span>
                  <button
                    className="kma-link"
                    type="button"
                    onClick={() => handleDownload(f)}
                    disabled={!f.fileGrpId}
                    style={{
                      textDecoration: 'none',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#007bff',
                    }}
                  >
                    {f.name}
                  </button>
                  <span className="kma-attach-size">({Math.round(f.size / 1024)} KB)</span>
                </div>
                {!readonly && (
                  <button
                    className="kma-btn kma-btn-danger kma-btn-xs"
                    type="button"
                    onClick={() => onRemove(idx)}
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
