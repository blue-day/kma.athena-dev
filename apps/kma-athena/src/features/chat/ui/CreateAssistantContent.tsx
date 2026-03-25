'use client';

import { useId, useState } from 'react';
import { CommonSelect } from '@/shared/ui/CommonSelect';
import { CommonInput } from '@/shared/ui/CommonInput';

const MODEL_OPTIONS = ['Gemini', 'Gemini 2.5 Flash', 'Gemini 2.5 Pro (2025.12)'];

export function CreateAssistantContent() {
  const uniqueId = useId();
  const radioGroupName = `assistant-type-${uniqueId}`;
  const [selectedAssistantType, setSelectedAssistantType] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0]);
  const [assistantName, setAssistantName] = useState('');

  const handleAssistantTypeChange = (type: string) => {
    setSelectedAssistantType(type);
  };

  return (
    <div className="form-box pt-1.5 md:pt-0">
      <div className="form-item">
        <span className="form-title required">비서 선택</span>
        <div className="form-content">
          <ul className="assistant-type-list">
            <li>
              <input 
                type="radio" 
                name={radioGroupName}
                id={`${uniqueId}-assistant-type-1`}
                checked={selectedAssistantType === '1'}
                onChange={() => handleAssistantTypeChange('1')}
              />
              <label htmlFor={`${uniqueId}-assistant-type-1`}>
                <span className="text-sm text-gray-400 md:mb-2">추천 비서 A</span>
                <strong className="text-sm md:text-base font-semibold break-keep">지식 아카이브 매니저</strong>
              </label>
            </li>
            <li>
              <input 
                type="radio" 
                name={radioGroupName}
                id={`${uniqueId}-assistant-type-2`}
                checked={selectedAssistantType === '2'}
                onChange={() => handleAssistantTypeChange('2')}
              />
              <label htmlFor={`${uniqueId}-assistant-type-2`}>
                <span className="text-sm text-gray-400 md:mb-2">추천 비서 B</span>
                <strong className="text-sm md:text-base font-semibold break-keep">베테랑 의협 사무국장</strong>
              </label>
            </li>  
            <li>
              <input 
                type="radio" 
                name={radioGroupName}
                id={`${uniqueId}-assistant-type-3`}
                checked={selectedAssistantType === '3'}
                onChange={() => handleAssistantTypeChange('3')}
              />
              <label htmlFor={`${uniqueId}-assistant-type-3`}>
                <span className="text-sm text-gray-400 md:mb-2">추천 비서 C</span>
                <strong className="text-sm md:text-base font-semibold break-keep">스마트한 법률/세무 컨설턴트</strong>
              </label>
            </li>
            <li>
              <input 
                type="radio" 
                name={radioGroupName}
                id={`${uniqueId}-assistant-type-4`}
                checked={selectedAssistantType === '4'}
                onChange={() => handleAssistantTypeChange('4')}
              />
              <label htmlFor={`${uniqueId}-assistant-type-4`}>
                <strong className="text-sm md:text-base font-semibold break-keep">직접입력</strong>
              </label>
            </li>
          </ul>
        </div>
      </div>

      <div className="form-item">
        <span className="form-title required">비서 이름</span>
        <div className="form-content">
          <CommonInput
            value={assistantName}
            onChange={setAssistantName}
            onClear={() => setAssistantName('')}
            placeholder="비서의 이름을 입력하세요 (최대 12자)"
            className="disabled" //비활성화 스타일
            disabled //비활성화 속성
          />
        </div>
      </div>

      <div className="form-item">
        <span className="form-title">캐릭터 및 역할</span>
        <div className="form-content">
          <div className="textarea-box">
            <textarea
              placeholder={`비서의 역할, 성격, 임무, 말투 등 나만의 비서에게 페르소나를 지정하세요. \n구체적으로 정의할수록 원하는 답변을 얻을 확률이 높아집니다.`}
            />
            <p className="txt-count">0/200</p>
          </div>
        </div>
      </div>

      <div className="form-item">
        <span className="form-title required">사용할 AI 모델</span>
        <div className="form-content">
          <CommonSelect
            options={MODEL_OPTIONS}
            value={selectedModel}
            onChange={setSelectedModel}
            ariaLabel="사용할 AI 모델"
            className="ipt-select"
          />
        </div>
      </div>

      <div className="form-item">
        <div className="form-title-wrap">
          <span className="form-title required">대답에 참고할 파일들</span>
          <button className="btn-file-add">
            <span className="sr-only">파일 추가</span>
          </button>
        </div>
        <div className="form-content">
          <div className="file-add-area">
            {/* 파일드래그 영역 */}
            <div className="file-add-box">
              <p className="txt">+ 클릭 또는 드래그하여 파일 첨부</p>
            </div>
            {/* 파일 목록 */}
            <ul className="file-add-list">
              <li>
                <span className="name">파일명.pdf</span>
                <button className="btn-file-del">
                  <span className="sr-only">파일 삭제</span>
                </button>
              </li>
              <li>
                <span className="name">파일명.pdf</span>
                <button className="btn-file-del">
                  <span className="sr-only">파일 삭제</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <p className="form-info">
          첨부된 파일을 참고로 답을 해줍니다.
          <br />(파일 형식은 PDF만 가능하며, 최대 10개, 10MB 이하로 제한됩니다.)
        </p>
      </div>
    </div>
  );
}
