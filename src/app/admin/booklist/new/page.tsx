"use client";

import React, { useReducer, useState } from "react";

import Image from "next/image";
import styles from "./BookRegistration.module.css";
import { useRouter } from "next/navigation";

// 전자책 포맷 타입
type BookFormat = "EBOOK" | "AUDIOBOOK";

// 카테고리 및 장르 리스트
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
const genres = ["로맨스", "스릴러", "판타지", "SF", "역사", "철학", "문학", "기타"];

// BookData 타입 정의
interface BookData {
  title: string; // 책 제목
  author: string; // 저자
  description: string; // 책 설명
  format: BookFormat; // EBOOK 또는 AUDIOBOOK
  genre: string; // 장르
  categories: string[]; // 카테고리 배열
  thumbnail: File | null; // 썸네일 이미지 파일
  pdf: File | null; // PDF 파일
}

// 초기 상태 정의
const initialBookData: BookData = {
  title: "",
  author: "",
  description: "",
  format: "EBOOK", // 기본값: EBOOK
  genre: "",
  categories: [],
  thumbnail: null,
  pdf: null,
};

// 액션 타입 정의
type Action =
  | { type: "SET_FIELD"; field: string; value: string }
  | { type: "SET_FORMAT"; format: BookFormat }
  | { type: "ADD_CATEGORY"; category: string }
  | { type: "REMOVE_CATEGORY"; category: string }
  | { type: "SET_FILE"; field: string; file: File | null }
  | { type: "RESET_FORM" };

// 리듀서 함수
const bookReducer = (state: BookData, action: Action): BookData => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_FORMAT":
      return { ...state, format: action.format };
    case "ADD_CATEGORY":
      return {
        ...state,
        categories: state.categories.includes(action.category)
          ? state.categories
          : [...state.categories, action.category],
      };
    case "REMOVE_CATEGORY":
      return {
        ...state,
        categories: state.categories.filter((cat) => cat !== action.category),
      };
    case "SET_FILE":
      return { ...state, [action.field]: action.file };
    case "RESET_FORM":
      return initialBookData;
    default:
      return state;
  }
};

// NewBook 컴포넌트
const NewBook = () => {
  const [bookData, dispatch] = useReducer(bookReducer, initialBookData);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const router = useRouter();

  // 핸들러: 텍스트 필드 값 변경
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_FIELD", field: name, value });
  };

  // 핸들러: 파일 업로드 변경
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0] || null;

    if (name === "thumbnail" && file) {
      if (!file.type.startsWith("image")) {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }

    dispatch({ type: "SET_FILE", field: name, file });
  };

  // 핸들러: 카테고리 추가
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) dispatch({ type: "ADD_CATEGORY", category: value });
  };

  // 핸들러: 카테고리 제거
  const removeCategory = (category: string) => {
    dispatch({ type: "REMOVE_CATEGORY", category });
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookData.title || !bookData.author || !bookData.genre || !bookData.pdf) {
      alert("필수 입력 필드를 확인해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", bookData.title);
    formData.append("author", bookData.author);
    formData.append("description", bookData.description);
    formData.append("format", bookData.format);
    formData.append("genre", bookData.genre);
    formData.append("categories", JSON.stringify(bookData.categories));
    if (bookData.thumbnail) formData.append("thumbnail", bookData.thumbnail);
    if (bookData.pdf) formData.append("pdf", bookData.pdf);

    try {
      const response = await fetch("/api/admin/books", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("책이 성공적으로 등록되었습니다.");
        dispatch({ type: "RESET_FORM" });
        setThumbnailPreview(null);
        router.push("/admin/booklist");
      } else {
        const error = await response.json();
        alert(`책 등록에 실패했습니다: ${error.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("책 등록 중 오류가 발생했습니다.");
    }
  };

  // 폼 초기화 및 목록 페이지로 이동
  const handleCancel = () => {
    dispatch({ type: "RESET_FORM" });
    setThumbnailPreview(null);
    router.push("/admin/booklist");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>전자책 등록하기</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 제목 */}
        <FormGroup
          label="전자책 제목"
          id="title"
          name="title"
          type="text"
          placeholder="책 제목을 입력하세요"
          value={bookData.title}
          onChange={handleChange}
          required
        />
        {/* 저자 */}
        <FormGroup
          label="저자"
          id="author"
          name="author"
          type="text"
          placeholder="저자 이름 입력"
          value={bookData.author}
          onChange={handleChange}
          required
        />
        {/* 설명 */}
        <FormGroup
          label="책 설명"
          id="description"
          name="description"
          type="textarea"
          placeholder="책에 대한 설명을 입력하세요"
          value={bookData.description}
          onChange={handleChange}
        />
        {/* 포맷 */}
        <div className={styles.formGroup}>
          <label htmlFor="format" className={styles.label}>
            포맷
          </label>
          <select
            id="format"
            name="format"
            className={styles.select}
            value={bookData.format}
            onChange={(e) => dispatch({ type: "SET_FORMAT", format: e.target.value as BookFormat })}
          >
            <option value="EBOOK">EBOOK</option>
            <option value="AUDIOBOOK">AUDIOBOOK</option>
          </select>
        </div>
        {/* 장르 */}
        <div className={styles.formGroup}>
          <label htmlFor="genre" className={styles.label}>
            장르
          </label>
          <select
            id="genre"
            name="genre"
            className={styles.select}
            value={bookData.genre}
            onChange={(e) => dispatch({ type: "SET_FIELD", field: "genre", value: e.target.value })}
            required
          >
            <option value="">-- 장르 선택 --</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
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
        {/* 썸네일 업로드 */}
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
            책 파일 (PDF)
          </label>
          <input
            type="file"
            id="pdf"
            name="pdf"
            className={styles.fileInput}
            accept="application/pdf"
            onChange={handleFileChange}
            required
          />
        </div>
        {/* 버튼 */}
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

// 반복되는 폼 컴포넌트
const FormGroup = ({
  label,
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  id: string;
  name: string;
  type: string;
  placeholder?: string;
  value?: string | null;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  required?: boolean;
}) => (
  <div className={styles.formGroup}>
    <label htmlFor={id} className={styles.label}>
      {label}
    </label>
    {type === "textarea" ? (
      <textarea
        id={id}
        name={name}
        className={styles.textarea}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        rows={5}
        required={required}
      />
    ) : (
      <input
        id={id}
        name={name}
        type={type}
        className={styles.input}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        required={required}
      />
    )}
  </div>
);

export default NewBook;
