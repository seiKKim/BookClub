"use client";

import React, { useRef, useState } from "react";

import axios from "axios"; // axios를 사용하여 파일 업로드
import styles from "./FileUpload.module.css";

interface FileUploadProps {
  onFileSelect?: (file: File | null, isValid: boolean) => void; // onFileSelect 정의
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false); // 드래그 상태 관리
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (selectedFile: File) => {
    // 유효한 파일 확장자를 설정
    const validExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".hwp", ".xls", ".xlsx"];
    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();

    if (fileExtension && validExtensions.includes(`.${fileExtension}`)) {
      setFile(selectedFile);
      setError(null);
      if (onFileSelect) {
        onFileSelect(selectedFile, true); // 유효한 파일일 때 호출
      }
    } else {
      setError("유효하지 않은 파일 형식입니다.");
      if (onFileSelect) {
        onFileSelect(null, false); // 유효하지 않은 파일일 때 호출
      }
    }
  };

  const handleFileDelete = () => {
    setFile(null);
    setError(null);
    if (onFileSelect) {
      onFileSelect(null, false); // 삭제 이벤트 전송
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError("업로드할 파일이 없습니다.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // 파일 추가

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer YOUR_API_KEY`, // 인증 키
        },
      });

      if (response.status === 200) {
        alert("파일 업로드 성공!");
        handleFileDelete(); // 완료 후 초기화
      } else {
        setError("파일 업로드 실패");
      }
    } catch (error) {
      console.error(error);
      setError("파일 업로드 중 오류가 발생했습니다.");
    }
  };

  // 드래그 앤 드롭 이벤트 핸들러
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // 기본 동작 방지
    setIsDragging(true); // 드래그 중 상태 활성화
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // 기본 동작 방지
    setIsDragging(false); // 드래그 중 상태 비활성화
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // 기본 동작 방지
    setIsDragging(false); // 드래그 상태 해제
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.fileUpload} ${
          isDragging ? styles.dragging : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file && (
          <div className={styles.fileInfo}>
            <span>{file.name}</span>
            <button
              className={styles.uploadButton}
              onClick={handleFileDelete}
              style={{ marginLeft: "10px" }}
            >
              X
            </button>
          </div>
        )}

        {error && <p className={styles.errorMessage}>{error}</p>}
        {!file && (
          <button
            type="button"
            className={styles.customFileInputButton}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            찾아보기
          </button>
        )}
        <button
          type="button"
          className={styles.uploadButton}
          onClick={handleFileUpload}
          disabled={!file} // 파일 확인 전까지 비활성화
        >
          확인
        </button>
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".jpg, .jpeg, .png, .pdf, .hwp, .xls, .xlsx"
        className={styles.fileInput}
        onChange={(event) => {
          const selectedFile = event.target.files?.[0];
          if (selectedFile) {
            handleFileChange(selectedFile);
          }
        }}
        aria-hidden="true"
      />
    </div>
  );
};

export default FileUpload;
