// pages/terms/[term].tsx
"use client"

import React from 'react';
import Terms1 from '../../../components/terms/Terms1'; // Terms1 컴포넌트 임포트
import Terms2 from '../../../components/terms/Terms2';
import Terms3 from '../../../components/terms/Terms3';
import Terms4 from '../../../components/terms/Terms4';
import Terms5 from '../../../components/terms/Terms5';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

const TermsDetail = () => {
  const router = useRouter();
  const pathname = usePathname();
  const term = pathname.split('/').pop(); // URL에서 term 파라미터 가져오기

  // 약관 내용 예시
  const termsContent = {
    terms1: <Terms1 />, // Terms1 컴포넌트를 사용
    terms2: <Terms2 />,
    terms3: <Terms3 />,
    terms4: <Terms4 />,
    terms5: <Terms5 />,
  };

  return (
    <div>
      <h1>{term} 상세 보기</h1>
      <div>
        {termsContent[term as keyof typeof termsContent] || "해당 약관이 존재하지 않습니다."}
      </div>
      <button onClick={() => router.back()}>뒤로가기</button>
    </div>
  );
};

export default TermsDetail;
