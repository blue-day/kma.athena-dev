'use client';

import { useId, useRef, useState } from 'react';
import { CommonSelect } from '@/shared/common/ui/CommonSelect';
import { CommonInput } from '@/shared/common/ui/CommonInput';
import { ChatAssistantRequest, LlmType, MODEL_OPTIONS } from '@/entities/chat/model/chatTypes';
import { recommendationAssistant } from '@/entities/chat/config/assistantConfig';

type CreateAssistantContentProps = {
  onChange?: (value: ChatAssistantRequest | null) => void;
};

const MAX_PERSONA_LENGTH = 200;

export function CreateAssistantContent() {
  const radioGroupName = useId();
  const fileInputId = useId();
  const assistantNameRef = useRef<HTMLInputElement>(null);
  const [selectedModel, setSelectedModel] = useState<LlmType>(MODEL_OPTIONS[0]);
  const [selectedAssistantType, setSelectedAssistantType] = useState('');
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
            {recommendationAssistant.map((item) => {
              const inputId = `${radioGroupName}-${item.key}`;

              return (
                <li key={item.key}>
                  <input
                    type="radio"
                    name={radioGroupName}
                    id={inputId}
                    checked={selectedAssistantType === item.key}
                    onChange={() => handleAssistantTypeChange(item.key)}
                  />
                  <label htmlFor={inputId}>
                    <span className="text-sm text-gray-400 md:mb-2">{item.label}</span>
                    <strong className="text-sm md:text-base font-semibold break-keep">{item.name}</strong>
                  </label>
                </li>
              );
            })}

            <li>
              <input
                type="radio"
                name={radioGroupName}
                id={`${radioGroupName}-new`}
                checked={selectedAssistantType === 'new'}
                onChange={() => handleAssistantTypeChange('new')}
              />
              <label htmlFor={`${radioGroupName}-'new}`}>
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
            ref={assistantNameRef}
            id="assistant-name"
            name="assistant-name"
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
            options={[...MODEL_OPTIONS]}
            value={selectedModel}
            onChange={(value) => setSelectedModel(value as LlmType)}
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
          <br />
          (파일 형식은 PDF만 가능하며, 최대 10개, 10MB 이하로 제한됩니다.)
        </p>
      </div>
    </div>
  );
}
