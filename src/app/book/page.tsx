"use client";

import { Book, fetchBooks } from "../../data/books";
import React, { useEffect, useState } from "react";

import BookList from "../../components/BookList";
import CategorySlider from "../../components/CategorySlider";
import styles from "./Book.module.css";

export default function BookPage() {
  const [bestBooks, setBestBooks] = useState<Book[]>([]);
  const [newBooks, setNewBooks] = useState<Book[]>([]);
  const [kidsBooks, setKidsBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 데이터 가져오기
  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true); // 로딩 시작
      try {
        const { bestBooks, newBooks, kidsBooks } = await fetchBooks(); // books 데이터 가져오기
        setBestBooks(bestBooks); // 상태 업데이트
        setNewBooks(newBooks);
        setKidsBooks(kidsBooks);
      } catch (error) {
        console.error("책 데이터를 가져오는 데 실패했습니다.", error);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    loadBooks();
  }, []);

  // 렌더링
  return (
    <div className={styles.mainContainer}>
      {/* 로딩 중 */}
      {isLoading ? (
        <div className={styles.loading}>로딩 중입니다...</div>
      ) : (
        <>
          {/* 우리 아이들을 위한 추천 도서 */}
          <div className={styles.sectionContainer}>
            <BookList
              title="우리 아이들을 위한 추천 도서"
              description="BookClub만의 추천 도서를 만나보세요."
              books={kidsBooks}
            />
          </div>

          {/* 이달의 베스트 도서 */}
          <div className={styles.sectionContainer}>
            <BookList
              title="이달의 베스트 도서"
              description="BookClub 회원들이 이번달에 가장 많이 읽은 책을 확인해 보세요."
              books={bestBooks}
            />
          </div>

          {/* 신규 도서 */}
          <div className={styles.sectionContainer}>
            <BookList
              title="신규 도서"
              description="새롭게 추가된 BookClub의 도서를 확인해 보세요."
              books={newBooks}
            />
          </div>

          {/* 카테고리 슬라이더 */}
          <div className={styles.sectionContainer}>
            <CategorySlider />
          </div>
        </>
      )}
    </div>
  );
}
