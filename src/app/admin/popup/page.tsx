"use client";

import React, { useEffect, useState } from "react";

import FilterBar from "@/components/PopupManagement/FilterBar";
import Pagination from "@/components/PopupManagement/Pagination";
import { Popup } from "@/types/popup";
import PopupTable from "@/components/PopupManagement/PopupTable";
import styles from "@/components/PopupManagement/PopupManagement.module.css";
import { useRouter } from "next/navigation"; // 라우터 훅 추가

export default function PopupManagementPage() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPopups, setTotalPopups] = useState(0);
  const router = useRouter(); // useRouter 훅 사용

  // 데이터 조회 함수
  const fetchPopups = async () => {
    try {
      const response = await fetch("/api/popups"); // API 엔드포인트를 적절히 수정하세요
      const data = await response.json();
      setPopups(data);
      setTotalPopups(data.length); // 총 팝업 수 설정
    } catch (error) {
      console.error("팝업 데이터를 가져오는 데 오류가 발생했습니다:", error);
    }
  };

  useEffect(() => {
    fetchPopups(); // 컴포넌트가 마운트될 때 데이터 조회
  }, []);

  const handleSearch = (filters: any) => {
    console.log("Searching with filters:", filters);
    // 필터링 로직 추가 필요
  };

  const handleDelete = (ids: number[]) => {
    console.log("Deleting popups with ids:", ids);
    // 삭제 로직 추가 필요
  };

  const handleEdit = (popup: Popup) => {
    router.push(`/admin/popup/${popup.id}`); // 수정 페이지로 이동
  };

  const handleRegister = () => {
    // 신규 등록 버튼 클릭 시 신규 등록 페이지로 이동
    router.push("/admin/popup/new");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>팝업 관리</h1>
      <FilterBar onSearch={handleSearch} />
      <div className={styles.actionBar}>
        <button onClick={handleRegister}>신규 등록</button>
      </div>

      <PopupTable popups={popups} onEdit={handleEdit} onDelete={handleDelete} />
      <Pagination total={totalPopups} currentPage={currentPage} onPageChange={(page) => setCurrentPage(page)} />
    </div>
  );
}
