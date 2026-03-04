'use client';

import { ChatLayout } from '@/widgets/layout/ChatLayout';

/**
 * KMA 메인 페이지
 * - 전체 레이아웃 (Lnb)
 * - 채팅 전용 레이아웃 (ChatHeader + ChatHistoryPanel + ChatContent)
 */
export function KmaMainPage() {
  return (
    <ChatLayout>
      <div className="flex flex-col h-full p-6">
        {/* 채팅 콘텐츠 영역 (샘플 카드들) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold text-blue-900 mb-2">사내 지식 챗봇</h3>
            <p className="text-sm text-blue-700">무엇이든 물어보세요. 사내 문서를 기반으로 답변해 드립니다.</p>
          </div>
          <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-2">일반 챗봇</h3>
            <p className="text-sm text-gray-600">궁금한 정보를 빠르게 찾아보세요.</p>
          </div>
        </section>

        {/* 하단 채팅 입력창 구조 (레이아웃만) */}
        <div className="mt-auto pt-4 pb-8">
          <div className="relative">
            <div className="w-full h-24 p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-lg flex items-start">
              <span className="text-gray-400">질문을 입력해 주세요...</span>
            </div>
            {/* 전역 버튼 및 기능들 자리 */}
            <div className="absolute right-4 bottom-4 flex space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </ChatLayout>
  );
}
