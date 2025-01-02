"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Book } from "@/types/Book"; // Book 타입 가져오기
import Image from "next/image";
import styles from "./BookList.module.css";
import { useRouter } from "next/navigation";

const BookList: React.FC = () => {
  const router = useRouter(); // 라우터 초기화
  const [books, setBooks] = useState<Book[]>([]); // 책 데이터 상태
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [sortOrder, setSortOrder] = useState("latest"); // 정렬 순서
  const [selectedBooks, setSelectedBooks] = useState<number[]>([]); // 선택된 책 ID
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(""); // 에러 메시지

  /** 책 데이터 가져오기 */
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/books");
      if (!response.ok)
        throw new Error("책 데이터를 가져오는 데 실패했습니다.");
      const data: Book[] = await response.json();
      setBooks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류입니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  /** 필터 및 정렬된 데이터 계산 */
  const filteredBooks = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return books
      .filter((book) => book.title.toLowerCase().includes(lowerCaseSearchTerm))
      .sort((a, b) => {
        if (sortOrder === "latest") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else if (sortOrder === "name") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [books, searchTerm, sortOrder]);

  /** 개별 선택 토글 */
  const toggleSelectBook = useCallback((bookId: number) => {
    setSelectedBooks(
      (prevSelected) =>
        prevSelected.includes(bookId)
          ? prevSelected.filter((id) => id !== bookId) // 선택 해제
          : [...prevSelected, bookId] // 선택 추가
    );
  }, []);

  /** 전체 선택/해제 */
  const toggleSelectAll = useCallback(() => {
    setSelectedBooks(
      (prevSelected) =>
        prevSelected.length === books.length
          ? [] // 선택 해제
          : books.map((book) => book.bookId) // 모두 선택
    );
  }, [books]);

  /** 선택된 책 삭제 */
  const deleteSelectedBooks = useCallback(async () => {
    if (selectedBooks.length === 0) {
      alert("삭제할 책을 선택해주세요.");
      return;
    }

    if (!confirm(`선택된 ${selectedBooks.length}개의 책을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/admin/books/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookIds: selectedBooks }),
      });

      if (!response.ok) throw new Error("선택한 책 삭제에 실패했습니다.");

      const deletedBooks = await response.json();
      setBooks((prevBooks) =>
        prevBooks.filter((book) => !deletedBooks.includes(book.bookId))
      );
      setSelectedBooks([]);
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "책 삭제 중 알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  }, [selectedBooks]);

  return (
    <div className={styles.contentWrap}>
      <div className={styles.whiteBg}>
        {/* 에러 메시지 출력 */}
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* 상단 검색/정렬/등록 버튼 */}
        <div className={styles.boEtc}>
          <div className={styles.inputList}>
            {/* 정렬 옵션 */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={styles.selectBox}
            >
              <option value="latest">최신 순</option>
              <option value="name">이름 순</option>
            </select>

            {/* 검색창 */}
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="책 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* 등록 버튼 */}
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => router.push("/admin/booklist/new")}
            >
              등록
            </button>

            {/* 삭제 버튼 */}
            <button
              className={`${styles.btn} ${styles.btnDanger}`}
              onClick={deleteSelectedBooks}
              disabled={loading}
            >
              {loading ? "삭제 중..." : "삭제"}
            </button>
          </div>
        </div>

        {/* 책 목록 테이블 */}
        <div className={styles.boardList}>
          <table>
            <thead>
              <tr>
                <th className={styles.wid100}>
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={selectedBooks.length === books.length}
                  />
                </th>
                <th className={styles.wid100}>번호</th>
                <th className={styles.wid180}>썸네일</th>
                <th className={styles.wid300}>제목</th>
                <th className={styles.wid180}>장르</th>
                <th className={styles.wid180}>카테고리</th>
                <th className={styles.wid180}>작성일</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book, index) => (
                <tr key={book.bookId}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedBooks.includes(book.bookId)}
                      onChange={() => toggleSelectBook(book.bookId)}
                    />
                  </td>
                  <td>{books.length - index}</td>
                  <td>
                    <Image
                      src={book.coverImage || "/no-thumbnail.png"}
                      alt={book.title}
                      width={80}
                      height={120}
                      style={{ objectFit: "cover" }}
                    />
                  </td>
                  <td>{book.title}</td>
                  <td>{book.genre}</td>
                  <td>
                    {book.categories.map((category, i) => (
                      <span key={i} className={styles.categoryTag}>
                        {category.name}
                      </span>
                    ))}
                  </td>
                  <td>
                    {new Intl.DateTimeFormat("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(book.createdAt))}
                  </td>
                </tr>
              ))}
              {filteredBooks.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center" }}>
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {loading && (
            <div className={styles.loadingOverlay}>로딩 중입니다...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookList;
