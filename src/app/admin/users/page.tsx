"use client";

import React, { useEffect, useState } from "react";

import { User } from "@/types/User"; // User 타입 정의
import styles from "./Users.module.css";

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // 사용자 상태
  const [searchQuery, setSearchQuery] = useState<string>(""); // 검색 상태
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태
  const [page, setPage] = useState<number>(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState<number>(1); // 전체 페이지 수

  const pageSize = 10; // 한 번에 표시할 사용자 수

  // 사용자 데이터를 API에서 가져온다
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/users?page=${page}&limit=${pageSize}${searchQuery ? `&searchQuery=${searchQuery}` : ""}`);
      if (!response.ok) {
        throw new Error("사용자 데이터를 가져오는 중 오류가 발생했습니다.");
      }

      const data = await response.json();
      setUsers(data.data.users);
      setTotalPages(data.data.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchQuery]); // 페이지와 검색어 변경 시 데이터 다시 가져오기

  // 검색 상태 변경
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // 검색할 때 첫 페이지로 이동
  };

  // 사용자 삭제 핸들러
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        setLoading(true);
        const response = await fetch(`/api/users?id=${id}`, { method: "DELETE" });

        if (!response.ok) {
          throw new Error("사용자 삭제 중 오류가 발생했습니다.");
        }

        // 성공적으로 삭제되었으므로 사용자 목록 갱신
        fetchUsers();
      } catch (err: any) {
        setError(err.message || "삭제 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }
  };

  // 이전 페이지로 이동
  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // 다음 페이지로 이동
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className={styles.contentWrap}>
      <h1 className={styles.title}>사용자 관리</h1>

      {/* 에러 메시지 */}
      {error && <div className={styles.error}>{error}</div>}

      {/* 로딩 상태 */}
      {loading ? (
        <div className={styles.loading}>로딩 중...</div>
      ) : (
        <>
          {/* 검색 바 */}
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="사용자 검색..."
              value={searchQuery}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </div>

          {/* 사용자 목록 */}
          <div className={styles.userList}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>이름</th>
                  <th>이메일</th>
                  <th>가입 날짜</th>
                  <th>구독 상태</th>
                  <th>최근 로그인</th>
                  <th>전화번호</th>
                  <th>동작</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.joinDate}</td>
                    <td>{user.subscriptionStatus}</td>
                    <td>{user.lastLogin}</td>
                    <td>{user.phone || "N/A"}</td>
                    <td>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(user.id)}>
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
                {!users.length && (
                  <tr>
                    <td colSpan={8} className={styles.noData}>
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className={styles.pagination}>
            <button onClick={handlePreviousPage} disabled={page === 1}>
              이전
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={page === totalPages}>
              다음
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Users;
