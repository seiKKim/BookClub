"use client";

import React, { useState } from "react";

import Image from "next/image";
import styles from "./BookRegistration.module.css"; // CSS 모듈 임포트

type BookData = {
  title: string;
  subTitle: string;
  author: string;
  publisher: string;
  publicationDate: string;
  isbn: string;
  categories: string[];
  description: string;
  thumbnail: File | null;
  pdf: File | null;
};

const availableCategories = [
  "소설",
  "시/에세이",
  "자기계발",
  "역사",
  "과학/기술",
  "여행",
  "건강",
  "경제/경영",
  "어린이/청소년",
];

const BookRegistration = () => {
  const initialBookData: BookData = {
    title: "",
    subTitle: "",
    author: "",
    publisher: "",
    publicationDate: "",
    isbn: "",
    categories: [],
    description: "",
    thumbnail: null,
    pdf: null,
  };

  const [bookData, setBookData] = useState<BookData>(initialBookData);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null); // 썸네일 미리보기 상태

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0] || null;

    if (name === "thumbnail" && file) {
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result as string); // 미리보기 URL 저장
      };
      reader.readAsDataURL(file);
    }

    setBookData((prev) => ({ ...prev, [name]: file }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !bookData.categories.includes(value)) {
      setBookData((prev) => ({
        ...prev,
        categories: [...prev.categories, value],
      }));
    }
  };

  const removeCategory = (category: string) => {
    setBookData((prev) => ({
      ...prev,
      categories: prev.categories.filter((item) => item !== category),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted Data:", bookData);
  };

  const handleCancel = () => {
    // 폼 초기화
    setBookData(initialBookData);
    setThumbnailPreview(null); // 미리보기 이미지 제거
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>전자책 등록하기</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 제목 */}
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            전자책 제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className={styles.input}
            placeholder="제목을 입력하세요"
            value={bookData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* 저자 */}
        <div className={styles.formGroup}>
          <label htmlFor="author" className={styles.label}>
            저자
          </label>
          <input
            type="text"
            id="author"
            name="author"
            className={styles.input}
            placeholder="저자를 입력하세요"
            value={bookData.author}
            onChange={handleChange}
            required
          />
        </div>

        {/* 카테고리 선택 */}
        <div className={styles.formGroup}>
          <label htmlFor="categories" className={styles.label}>
            카테고리 선택 (최대 다중 선택 가능)
          </label>
          <select
            id="categories"
            name="categories"
            className={styles.select}
            onChange={handleCategoryChange}
          >
            <option value="">-- 카테고리 선택 --</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <ul className={styles.categoryList}>
            {bookData.categories.map((category) => (
              <li key={category} className={styles.categoryItem}>
                {category}
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeCategory(category)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 썸네일 업로드 및 미리보기 */}
        <div className={styles.formGroup}>
          <label htmlFor="thumbnail" className={styles.label}>
            썸네일 이미지
          </label>
          <input
            type="file"
            id="thumbnail"
            name="thumbnail"
            className={styles.fileInput}
            accept="image/*"
            onChange={handleFileChange}
          />
          {thumbnailPreview && (
            <div className={styles.previewContainer}>
              <Image
                src={thumbnailPreview}
                alt="썸네일 미리보기"
                className={styles.thumbnailPreview}
                width={200}
                height={200}
              />
            </div>
          )}
        </div>

        {/* PDF 업로드 */}
        <div className={styles.formGroup}>
          <label htmlFor="pdf" className={styles.label}>
            PDF 파일
          </label>
          <input
            type="file"
            id="pdf"
            name="pdf"
            className={styles.fileInput}
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </div>

        {/* 책 설명 */}
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            책 설명
          </label>
          <textarea
            id="description"
            name="description"
            className={styles.textarea}
            placeholder="책에 대한 설명을 입력하세요."
            value={bookData.description}
            onChange={handleChange}
            rows={5}
          />
        </div>

        {/* 버튼 그룹 */}
        <div className={styles.buttons}>
          <button type="submit" className={styles.submitButton}>
            등록하기
          </button>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleCancel}
          >
            취소하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookRegistration;
