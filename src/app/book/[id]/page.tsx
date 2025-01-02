"use client";

import { Book, fetchBookById } from "../../../data/books";
import React, { useEffect, useState } from "react";

import styles from "./BookDetail.module.css";
import { useParams } from "next/navigation";

const BookDetailPage = () => {
  const { id } = useParams(); // URL에서 `id` 가져오기
  const [book, setBook] = useState<Book | null>(null); // 책 데이터 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [isLiked, setIsLiked] = useState(false); // 좋아요 상태
  const [likesCount, setLikesCount] = useState(100); // 좋아요 초기값
  const [activeTab, setActiveTab] = useState<string>("summary"); // 기본 탭: 줄거리

  // 책 데이터 로드
  useEffect(() => {
    const loadBookData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const fetchedBook = await fetchBookById(Number(id));
        setBook(fetchedBook || null); // 데이터 없으면 null 저장
      } catch (error) {
        console.error("책 데이터를 불러오는 중 에러 발생:", error);
        setBook(null); // 에러 발생 시 null
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };
    loadBookData();
  }, [id]);

  // 좋아요 핸들러
  const handleLikeClick = () => {
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1)); // 좋아요 수 업데이트
    setIsLiked((prev) => !prev); // 좋아요 상태 토글
  };

  // 렌더링할 탭 콘텐츠 매핑
  const tabContent: { [key: string]: React.ReactNode } = {
    summary: <p>{book?.description || "줄거리 정보가 없습니다"}</p>,
    reviews: <p>리뷰가 준비 중입니다.</p>,
    purchase: <p>구매 관련 정보가 준비 중입니다.</p>,
  };

  if (isLoading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (!book) {
    return <div className={styles.error}>책 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className={styles.detailPage}>
      {/* 좌측 이미지 섹션 */}
      <div className={styles.imageSection}>
        <img className={styles.bookImage} src={book.cover} alt={book.title} />
      </div>

      {/* 우측 책 정보 섹션 */}
      <div className={styles.infoSection}>
        <h1 className={styles.title}>{book.title}</h1>
        {book.subtitle && <p className={styles.subtitle}>{book.subtitle}</p>}
        <p className={styles.meta}>
          <span className={styles.author}>저자: {book.author}</span>
          <span> · 출판일: {book.publishDate || "알 수 없음"}</span>
        </p>

        {/* 평점 & 리뷰 */}
        <div className={styles.rating}>
          <span className={styles.star}>⭐ 4.5</span>
          <span className={styles.reviewCount}>(100 리뷰)</span>
        </div>

        {/* 좋아요 */}
        <p className={styles.stat}>
          이 책이 담긴 서재 총 <strong>{likesCount.toLocaleString()}</strong>
        </p>

        {/* 바로 읽기 & 추가 버튼 (수평 정렬로 통합) */}
        <div className={styles.actionButtons}>
          <button className={styles.primaryButton}>바로 읽기</button>
          <button className={styles.secondaryButton}>내서재에 담기</button>
          <button
            className={`${styles.likeButton} ${isLiked ? styles.liked : ""}`}
            onClick={handleLikeClick}
            aria-label="좋아요"
          >
            {isLiked ? "❤️" : "🤍"} {likesCount}
          </button>
        </div>
      </div>

      {/* 하단 탭 섹션 */}
      <div className={styles.bottomSection}>
        {/* 탭 메뉴 */}
        <div className={styles.tabContainer}>
          {["summary", "reviews", "purchase"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? styles.activeTab : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "summary" && "줄거리"}
              {tab === "reviews" && "리뷰"}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className={styles.tabContent}>{tabContent[activeTab]}</div>
      </div>
    </div>
  );
};

export default BookDetailPage;
