'use client';

import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Froala 스타일 임포트 (fr-view 스타일도 여기에 포함됨)
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';

const FroalaEditorComponent = dynamic(() => import('react-froala-wysiwyg'), {
  ssr: false,
  loading: () => <div style={{ height: '500px', background: '#f4f5f7' }}>에디터 로딩 중...</div>,
});

interface FroalaEditorProps {
  initialValue?: string;
  height?: string;
  onChange?: (html: string) => void;
  readOnly?: boolean;
}

const FroalaEditor = forwardRef<any, FroalaEditorProps>(
  ({ initialValue = '', height = '500px', onChange, readOnly = false }, ref) => {
    const [model, setModel] = useState(initialValue);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
      setModel(initialValue);
    }, [initialValue]);

    useImperativeHandle(ref, () => ({
      getHTML: () => model,
      setHTML: (html: string) => {
        setModel(html || '');
      },
    }));

    const handleModelChange = (event: any) => {
      setModel(event);
      if (onChange) {
        onChange(event);
      }
    };

    const config = {
      placeholderText: '내용을 입력해주세요.',
      charCounterCount: true,
      toolbarButtons: {
        moreText: {
          buttons: [
            'bold',
            'italic',
            'underline',
            'strikeThrough',
            'subscript',
            'superscript',
            'fontFamily',
            'fontSize',
            'textColor',
            'backgroundColor',
            'inlineClass',
            'inlineStyle',
            'clearFormatting',
          ],
        },
        moreParagraph: {
          buttons: [
            'alignLeft',
            'alignCenter',
            'formatOL',
            'formatUL',
            'paragraphFormat',
            'paragraphStyle',
            'lineHeight',
            'outdent',
            'indent',
            'quote',
          ],
        },
        moreRich: {
          buttons: [
            'insertLink',
            'insertImage',
            'insertVideo',
            'insertTable',
            'emoticons',
            'specialCharacters',
            'insertHR',
          ],
        },
        moreMisc: {
          buttons: [
            'undo',
            'redo',
            'fullscreen',
            'print',
            'getPDF',
            'spellChecker',
            'selectAll',
            'html',
            'help',
          ],
          align: 'right',
          buttonsVisible: 2,
        },
      },
      height: parseInt(height),
      quickInsertEnabled: false,
      attribution: false,
    };

    if (!isMounted) return null;

    return (
      <div className="kma-froala-editor">
        <FroalaEditorComponent
          tag="textarea"
          config={config}
          model={model}
          onModelChange={handleModelChange}
        />
      </div>
    );
  },
);

FroalaEditor.displayName = 'FroalaEditor';
export { FroalaEditor };
