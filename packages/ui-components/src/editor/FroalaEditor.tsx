'use client';

import React, { forwardRef, useImperativeHandle, useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';

import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';

const FroalaEditorComponent = dynamic(() => import('react-froala-wysiwyg'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: '500px',
        background: '#f4f5f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      에디터를 불러오는 중...
    </div>
  ),
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
      if (typeof window !== 'undefined') {
        try {
          // 모든 플러그인 로드 (상용 기능 포함)
          require('froala-editor/js/plugins.pkgd.min.js');
          // 🇰🇷 한국어 언어팩 로드 (옵션: 불필요시에는 주석처리)
          require('froala-editor/js/languages/ko.js');
        } catch (e) {
          console.error('Froala plugins load error:', e);
        }
      }
      setIsMounted(true);
      setModel(initialValue);
    }, []);

    useEffect(() => {
      if (initialValue !== model) {
        setModel(initialValue);
      }
    }, [initialValue]);

    useImperativeHandle(
      ref,
      () => ({
        getHTML: () => model,
        setHTML: (html: string) => {
          setModel(html || '');
        },
      }),
      [model],
    );

    const handleModelChange = (event: any) => {
      if (readOnly) return;
      setModel(event);
      if (onChange) onChange(event);
    };

    const config = useMemo(
      () => ({
        key: 'cJC7bA4D3G2F2E2G1C4C6SmB-11gwd1DBKSPF1WKTUCQOa1OURPJ1KDe2F-11D2C2D2B2C3B3A2D6C1C2==',

        language: 'ko', // 한국어 UI 적용
        placeholderText: '내용을 입력해주세요.',
        charCounterCount: true,
        imagePaste: true,
        imagePasteProcess: true,
        imageUpload: false, // 별도 서버 연동 시 true로 변경
        fileUpload: false, // 파일 첨부 기능 (별도 서버 연동 필요 시 true)
        readonly: readOnly,

        //에디터 내 좌측 퀵 메뉴 활성화
        quickInsertEnabled: true,
        quickInsertButtons: ['image', 'video', 'embedly', 'table', 'ul', 'ol', 'hr'],

        events: {
          'image.beforeUpload': function (this: any, images: any[]) {
            const editor = this;
            if (images && images.length) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const result = e.target?.result;
                if (result) {
                  editor.image.insert(result, null, null, editor.image.get());
                }
              };
              reader.readAsDataURL(images[0]);
            }
            return false;
          },
          initialized: function (this: any) {
            if (readOnly && this.edit) {
              this.edit.off();
            }
          },
        },

        // 툴바 버튼 풀옵션 전진 배치
        toolbarButtons: readOnly
          ? []
          : {
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
                align: 'left',
                buttonsVisible: 4, // 밖으로 꺼내보일 버튼 개수 늘림
              },
              moreParagraph: {
                buttons: [
                  'alignLeft',
                  'alignCenter',
                  'alignRight',
                  'alignJustify',
                  'formatOL',
                  'formatUL',
                  'paragraphFormat',
                  'paragraphStyle',
                  'lineHeight',
                  'outdent',
                  'indent',
                  'quote',
                ],
                align: 'left',
                buttonsVisible: 4,
              },
              moreRich: {
                //'insertFile' 제거됨
                buttons: [
                  'insertLink',
                  'insertImage',
                  'insertVideo',
                  'insertTable',
                  'emoticons',
                  'specialCharacters',
                  'insertHR',
                ],
                align: 'left',
                buttonsVisible: 4,
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
                buttonsVisible: 3,
              },
            },
        height: parseInt(height),
        attribution: false,
      }),
      [height, readOnly],
    );

    if (!isMounted) {
      return <div style={{ height, background: '#f4f5f7' }} />;
    }

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
