"use client";

import React, { useState } from "react";

import styles from "@/components/PopupManagement/PopupManagement.module.css"; // CSS 모듈 임포트
import { useRouter } from "next/navigation";

export default function NewPopup() {
  const router = useRouter(); // 페이지 전환을 위한 useRouter
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    isVisible: true,
    position: "top", // 기본 팝업 위치
    content: "",
    width: 500, // 기본 팝업 창 가로 크기
    height: 300, // 기본 팝업 창 세로 크기
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, isVisible: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // `/api/admin/popup`로 POST 요청 전송
      const res = await fetch("/api/admin/popup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to create popup");
      }

      const data = await res.json();
      console.log("Successfully created popup:", data);

      // 등록 완료 후 목록 페이지로 이동
      router.push("/admin/popup");
    } catch (error) {
      console.error("Error submitting popup:", error);
    }
  };


  const handleCancel = () => {
    router.push("/admin/popup");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>팝업 등록</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* 제목 */}
        <div className={styles.formGroup}>
          <label>팝업 제목</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="팝업 제목을 입력하세요."
          />
        </div>

        {/* 날짜 입력 */}
        <div className={styles.formGroup}>
          <label>노출 기간</label>
          <div className={styles.dateInput}>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
            />
            <span>~</span>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* 사용 여부 */}
        <div className={styles.formGroup}>
          <label>사용 여부</label>
          <input
            type="checkbox"
            name="isVisible"
            checked={formData.isVisible}
            onChange={handleCheckboxChange}
          />
          <span>{formData.isVisible ? "활성화" : "비활성화"}</span>
        </div>

        {/* 팝업 위치 */}
        <div className={styles.formGroup}>
          <label>팝업 위치</label>
          <select
            name="position"
            value={formData.position}
            onChange={handleInputChange}
          >
            <option value="top">상단</option>
            <option value="center">가운데</option>
            <option value="bottom">하단</option>
          </select>
        </div>

        {/* 창 크기 설정 */}
        <div className={styles.formGroup}>
          <label>팝업 크기</label>
          <div className={styles.sizeInput}>
            <input
              type="number"
              name="width"
              value={formData.width}
              onChange={handleInputChange}
              placeholder="가로 (px)"
            />
            <span>x</span>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              placeholder="세로 (px)"
            />
          </div>
        </div>

        {/* 내용 입력 */}
        <div className={styles.formGroup}>
          <label>내용</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="팝업 내용을 입력하세요."
          />
        </div>

        {/* 파일 업로드 */}
        <div className={styles.formGroup}>
          <label>이미지 첨부</label>
          <input type="file" />
        </div>

        {/* 저장 및 취소 버튼 */}
        <div className={styles.buttonGroup}>
          <button type="submit" className={`${styles.button} ${styles.save}`}>
            저장
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.cancel}`}
            onClick={handleCancel}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
