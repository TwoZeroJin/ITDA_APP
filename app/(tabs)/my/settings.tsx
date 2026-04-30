import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SettingsPreview() {
  const [isPushEnabled, setIsPushEnabled] = useState(true);

  // 리스트 아이템 데이터
  const items = [
    { title: '공지사항' },
    { title: '개선 및 의견 남기기' },
    { title: '서비스 이용 약관' },
    { title: '개인정보 처리방침' },
  ];

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen py-10 font-sans">
      {/* 가상의 모바일 프레임 */}
      <div className="w-[375px] h-[812px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative border-[12px] border-gray-900">
        
        {/* 상단 노치/상태바 영역 (가상) */}
        <div className="w-full h-12 flex items-center justify-between px-6 pt-2">
            <span className="text-xs font-bold">9:41</span>
            <div className="flex space-x-1.5">
                <div className="w-4 h-3 bg-black rounded-sm"></div>
                <div className="w-3 h-3 bg-black rounded-full"></div>
            </div>
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-2">
          <button className="p-2 -ml-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={26} strokeWidth={2.5} />
          </button>
          <h1 className="text-[17px] font-bold text-gray-900">설정</h1>
          <div className="w-10"></div> {/* 중앙 정렬을 위한 여백 */}
        </div>

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto px-5 pb-10" style={{ scrollbarWidth: 'none' }}>
          
          {/* 알림받기 (스위치 토글) */}
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <span className="text-[16px] font-medium text-gray-800">알림받기</span>
            <button
              onClick={() => setIsPushEnabled(!isPushEnabled)}
              className={`w-[48px] h-[28px] flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out ${
                isPushEnabled ? 'bg-[#ff8c8c]' : 'bg-gray-200'
              }`}
            >
              <div
                className={`bg-white w-[22px] h-[22px] rounded-full shadow-sm transform duration-300 ease-in-out ${
                  isPushEnabled ? 'translate-x-[20px]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 리스트 아이템들 */}
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer active:bg-gray-50 transition-colors"
            >
              <span className="text-[16px] font-medium text-gray-800">{item.title}</span>
              <ChevronRight size={22} className="text-gray-400" />
            </div>
          ))}

          {/* 로그아웃 버튼 */}
          <button className="w-full mt-10 py-[14px] rounded-[12px] border border-gray-200 text-[15px] font-semibold text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors">
            로그아웃
          </button>
          
        </div>

        {/* 하단 홈 인디케이터 (가상) */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center pb-2">
            <div className="w-1/3 h-1.5 bg-black rounded-full"></div>
        </div>

      </div>
    </div>
  );
}