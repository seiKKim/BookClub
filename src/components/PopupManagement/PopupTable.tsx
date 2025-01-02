"use client";

import React, { useEffect, useState } from "react";

import { Popup } from "@/types/popup"; // 팝업 타입 가져오기
import styles from "./PopupManagement.module.css"; // CSS 모듈 임포트

type Props = {
  popups: Popup[]; // popups prop 추가
  onEdit: (popup: Popup) => void;
  onDelete: (ids: number[]) => void;
};

export default function PopupTable({ onEdit, onDelete }: Props) {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 데이터 조회 함수
  const fetchPopups = async () => {
    try {
      const response = await fetch("/api/admin/popup"); // API 엔드포인트를 적절히 수정하세요
      if (!response.ok) {
        throw new Error("네트워크 응답이 좋지 않습니다.");
      }
      const data = await response.json();
      setPopups(data);
    } catch (error) {
      console.error("팝업 데이터를 가져오는 데 오류가 발생했습니다:", error);
      alert("팝업 데이터를 가져오는 데 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchPopups(); // 컴포넌트가 마운트될 때 데이터 조회
  }, []);

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteClick = () => {
    if (selectedIds.length === 0) {
      alert("삭제할 항목을 선택하세요.");
      return;
    }
    onDelete(selectedIds);
    setSelectedIds([]); // 삭제 후 선택 해제
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${styles.delete}`}
        onClick={handleDeleteClick}
        disabled={selectedIds.length === 0} // 선택된 항목이 없으면 비활성화
      >
        삭제
      </button>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>선택</th>
            <th>팝업 제목</th>
            <th>기간</th>
            <th>사용 여부</th>
            <th>등록일</th>
            <th>기능</th>
          </tr>
        </thead>
        <tbody>
          {popups.length > 0 ? (
            popups.map((popup) => (
              <tr key={popup.id}>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleSelect(popup.id)} // popup.id! 대신 popup.id 사용
                    checked={selectedIds.includes(popup.id)}
                  />
                </td>
                <td>{popup.title}</td>
                <td>
                  {formatDate(popup.startDate)} ~ {formatDate(popup.endDate)}
                </td>
                <td>{popup.isVisible ? "활성화" : "비활성화"}</td>
                <td>{formatDate(popup.createdAt)}</td>
                <td>
                  <button
                    className={`${styles.button} ${styles.register}`}
                    onClick={() => onEdit(popup)}
                  >
                    수정
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className={styles.noData}>
                등록된 팝업이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
