import Link from "next/link"; // Next.js에서 이동 구현
import React from "react";
import styles from "./BookList.module.css"; // CSS 모듈 적용

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
}

interface BookListProps {
  title: string;
  description?: string;
  books: Book[];
}

const BookList: React.FC<BookListProps> = ({ title, description, books }) => {
  return (
    <div className={styles.container}>
      {/* 섹션 제목 */}
      <h2 className={styles.title}>{title}</h2>
      {/* 섹션 설명 */}
      {description && <p className={styles.description}>{description}</p>}

      {/* 책 리스트 그리드 */}
      <div className={styles.bookGrid}>
        {books.map((book) => (
          <Link
            href={`/book/${book.id}`} // 책 상세 페이지로 이동
            key={book.id} // 고유 키 추가
            className={styles.bookItemLink} // 링크 스타일링
          >
            <div className={styles.bookItem}>
              {/* 책 이미지 */}
              <img
                src={book.cover}
                alt={`${book.title} 표지`}
                className={styles.bookCover}
              />
              {/* 책 제목 */}
              <h3 className={styles.bookTitle}>{book.title}</h3>
              {/* 책 저자 */}
              <p className={styles.bookAuthor}>{book.author}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BookList;
