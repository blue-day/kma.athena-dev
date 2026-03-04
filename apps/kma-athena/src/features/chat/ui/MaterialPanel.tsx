'use client';

import React from 'react';

interface Material {
  id: number;
  title: string;
  type: 'pdf' | 'doc' | 'link';
  date: string;
}

const SAMPLE_MATERIALS: Material[] = [
  { id: 1, title: '2024년 의협 정기총회 회의록', type: 'pdf', date: '2024.02.20' },
  { id: 2, title: '사내 보안 가이드라인 v1.2', type: 'doc', date: '2024.01.15' },
  { id: 3, title: '의료법 개정안 관련 참고자료', type: 'pdf', date: '2024.03.01' },
  { id: 4, title: '내부 전산망 사용법 안내', type: 'link', date: '2023.12.10' },
];

interface MaterialPanelProps {
  onClose: () => void;
}

/**
 * 자료 리스트 패널 컴포넌트
 */
export const MaterialPanel = ({ onClose }: MaterialPanelProps) => {
  return (
    <div className="w-64 p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-gray-800">참고 자료</h3>
        {/* 패널 내부 닫기 버튼 */}
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-md transition-colors"
          title="자료 패널 닫기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {SAMPLE_MATERIALS.map((material) => (
          <div 
            key={material.id} 
            className="p-3 text-sm rounded-xl bg-white border border-gray-100 shadow-sm cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-start mb-2">
              <div className={`p-1.5 rounded-lg mr-2 ${
                material.type === 'pdf' ? 'bg-red-50 text-red-500' : 
                material.type === 'doc' ? 'bg-blue-50 text-blue-500' : 'bg-gray-50 text-gray-500'
              }`}>
                {material.type === 'pdf' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )}
                {material.type !== 'pdf' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
              </div>
              <p className="font-medium text-gray-700 leading-tight group-hover:text-blue-600 transition-colors">
                {material.title}
              </p>
            </div>
            <p className="text-[11px] text-gray-400 pl-8">{material.date}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium rounded-lg transition-colors">
          자료 더보기
        </button>
      </div>
    </div>
  );
};
