// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";

import BookList from "../components/BookList";
import CategorySlider from "../components/CategorySlider";
import HighlightedSlider from "../components/HighlightedSlider";
import Popup from "@/components/PopupUserManagement/PopupUserManagement"; // 올바른 경로 확인하세요
import { booksData } from "../data/books"; // TypeScript 파일에서 데이터 가져오기
import styles from "./Home.module.css";

export default function Home() {
  const { bestBooks, newBooks, kidsBooks } = booksData;

  // 팝업 데이터를 상태로 관리
  const [popupData, setPopupData] = useState<{
    title: string;
    description: string;
    image?: string;
  } | null>(null);

  // API에서 팝업 데이터 가져오기
  useEffect(() => {
    async function fetchPopupData() {
      try {
        const res = await fetch("/api/admin/popup");

        if (!res.ok) {
          throw new Error("Failed to fetch popup data");
        }

        const data = await res.json();
        setPopupData(data);
      } catch (error) {
        console.error("Error fetching popup data:", error);
      }
    }

    fetchPopupData();
  }, []);

  // 팝업 닫기 핸들러
  const handleClosePopup = () => {
    setPopupData(null); // 팝업 데이터를 null로 설정하여 팝업 닫기
  };

  return (
    <>
      {/* Popup 컴포넌트 - popupData가 있을 경우만 표시 */}
      {popupData && <Popup data={popupData} onClose={handleClosePopup} />}

      {/* 메인 컨텐츠 */}
      <HighlightedSlider />
      <div className={styles.mainContainer}>
        {/* 우리 아이들을 위한 추천 도서 */}
        <div className={styles.sectionContainer}>
          <BookList
            title="우리 아이들을 위한 추천 도서"
            description="BookClub만의 추천 도서를 만나보세요"
            books={kidsBooks}
          />
        </div>

        {/* 이달의 베스트 도서 */}
        <div className={styles.sectionContainer}>
          <BookList
            title="이달의 베스트 도서"
            description="BookClub 회원들이 이번달에 가장 많이 읽은 책을 확인해 보세요"
            books={bestBooks}
          />
        </div>

        {/* 신규 도서 */}
        <div className={styles.sectionContainer}>
          <BookList
            title="신규 도서"
            description="새롭게 추가된 BookClub의 도서를 확인해 보세요"
            books={newBooks}
          />
        </div>

        {/* 카테고리 도서 */}
        <div className={styles.sectionContainer}>
          <CategorySlider />
        </div>
      </div>
    </>
  );
}
