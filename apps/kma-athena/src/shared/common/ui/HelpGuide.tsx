'use client';

import { useState } from 'react';
import { CommonPopup } from './CommonPopup';
import guideIcon01 from '@/shared/assets/images/icon-offer.svg';
import guideIcon02 from '@/shared/assets/images/icon-question-guide.svg';

export function HelpGuide() {
  const [isHelpPopupOpen, setIsHelpPopupOpen] = useState(false);
  const chatbotQuestionGuides = [
    {
      title: '일반 챗봇',
      content: '지역의사제 도입 등 정부의 공공·지역 의료 강화 법안에 대해 협회는 어떤 입장인가요?',
    },
    {
      title: 'KAM 내부 지식 챗봇',
      content: '협회에서 발행한 의료 관련 가이드라인 중 해당 주제와 관련된 내용을 찾아주세요',
    },
    {
      title: '나만의 비서',
      content: '업로드한 회의 자료를 기반으로 주요 논의 내용을 요약해 주세요',
    },
  ];

  return (
    <>
      <button
        type="button"
        className="btn-info-help"
        onClick={() => setIsHelpPopupOpen(true)}
      >
        <span className="sr-only">페이지 소개</span>
      </button>

      <CommonPopup
        open={isHelpPopupOpen}
        variant="custom"
        popupWidth={660}
        title="사용 가이드"
        content={
          <div>
            <div className="flex flex-col items-center mb-4">
              <h3 
                className="text-xl font-bold text-primary pl-[34px] mb-1 break-keep"
                style={{ background: `url(${guideIcon01.src}) left top / 24px auto no-repeat` }}
                >
                  AI 서비스는 사용 목적에 따라 3가지 AI기능을 제공합니다.
              </h3>
              <p className="text-sm leading-[1.29] text-center text-gray-400 break-keep">아래 비교표를 참고하여 질문 유형에 맞는 메뉴를 선택하여 사용하세요!</p>
            </div>
            <div className="tbl-wrap">
              <table className="tbl-col">
                <colgroup>
                  <col style={{ width: '20%' }} />
                </colgroup>
                <thead>
                  <tr>
                    <th className="!text-gray-300 !font-normal">구분</th>
                    <th>일반 챗봇</th>
                    <th>KMA 내부 지식 챗봇</th>
                    <th>나만의 비서</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>목적</th>
                    <td>일반적인 질문 답변</td>
                    <td>협회 내부 지식 검색</td>
                    <td>개인 첨부파일 기반 질문</td>
                  </tr>
                  <tr>
                    <th>활용 데이터</th>
                    <td>외부 AI 지식</td>
                    <td>협회 내부 문서 및 자료</td>
                    <td>사용자 자료 기반</td>
                  </tr>
                  <tr>
                    <th>주요 기능</th>
                    <td>다양한 주제 질문</td>
                    <td>내부 자료 기반 답변 제공</td>
                    <td>특정 문서 기반 질의 응답</td>
                  </tr>
                  <tr>
                    <th>근거 자료 제공</th>
                    <td>제공되지 않을 수 있음</td>
                    <td>답변 근거 자료 제공</td>
                    <td>업로드 문서 기반</td>
                  </tr>
                  <tr>
                    <th>추천 케이스</th>
                    <td>일반 정보 확인</td>
                    <td>내부 업무 자료 확인</td>
                    <td>개인 문서 활용 업무</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-center mt-10">
              <h3 
                className="text-xl font-bold text-primary pl-[34px] mb-3 break-keep"
                style={{ background: `url(${guideIcon02.src}) left top / 24px auto no-repeat` }}
                >
                  챗봇별 질문 가이드
                </h3>
              <ul className="flex flex-col gap-[14px] w-full">
                {chatbotQuestionGuides.map((guide) => (
                  <li key={guide.title}>
                    <span className="block mb-1 text-sm font-medium text-primary">{guide.title}</span>
                    <p className="flex items-start justify-center p-2.5 rounded-lg bg-[var(--kma-blue-bg)] text-sm">
                      <span className="flex-shrink-0 iht mr-2.5 text-gray-300">예시)</span>
                      <span className="iht">{guide.content}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        }
        showCancelButton={false}
        onClose={() => setIsHelpPopupOpen(false)}
        onConfirm={() => setIsHelpPopupOpen(false)}
      />
    </>
  );
}
