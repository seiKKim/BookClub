"use client";

import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import React, { useCallback, useEffect, useRef, useState } from "react";

import styles from "./PdfViewer.module.css"; // CSS 스타일링

GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

// RenderedPage 타입 정의
type RenderedPage = {
  leftImage: HTMLImageElement; // 왼쪽 캔버스 이미지
  rightImage: HTMLImageElement | null; // 오른쪽 캔버스 이미지
};

const PdfViewerPage: React.FC = () => {
  const [pdf, setPdf] = useState<any>(null); // PDF 객체 관리
  const [pageNumber, setPageNumber] = useState(2); // 시작 페이지 (2)
  const [error, setError] = useState<string | null>(null); // 에러 메시지
  const [isLoading, setIsLoading] = useState(false); // **로딩 상태 추가**
  const leftCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderTaskRef = useRef<any>(null);
  const renderedPages = useRef<Map<number, RenderedPage>>(new Map()); // useRef 타입 선언

  const loadPdf = async (file: File) => {
    setIsLoading(true); // PDF 로드 시작 시 로딩 표시
    try {
      const fileUrl = URL.createObjectURL(file);
      const pdfDoc = await getDocument(fileUrl).promise;
      setError(null);
      setPdf(pdfDoc);
      setPageNumber(pdfDoc.numPages >= 2 ? 2 : 1);
    } catch (err) {
      console.error("PDF 파일 로드 중 에러:", err);
      setError("Failed to load the PDF. Please check the file and try again.");
    } finally {
      setIsLoading(false); // PDF 로드 완료 시 로딩 종료
    }
  };

  const renderPage = useCallback(
    async (pageNum: number) => {
      if (!pdf || !leftCanvasRef.current || !rightCanvasRef.current) return;
      setIsLoading(true);

      const leftCanvas = leftCanvasRef.current;
      const leftContext = leftCanvas.getContext("2d");
      const rightCanvas = rightCanvasRef.current;
      const rightContext = rightCanvas.getContext("2d");

      if (!leftContext || !rightContext) return;

      const cachedPage = renderedPages.current.get(pageNum);
      if (cachedPage) {
        leftContext.drawImage(cachedPage.leftImage, 0, 0);
        if (cachedPage.rightImage) {
          rightContext.drawImage(cachedPage.rightImage, 0, 0);
        }
        setIsLoading(false);
        return;
      }

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      try {
        const page = await pdf.getPage(pageNum);
        const scale = window.innerWidth < 768 ? 0.8 : 1.5;
        const viewport = page.getViewport({ scale });

        if (pageNum === 1) {
          leftCanvas.width = viewport.width;
          leftCanvas.height = viewport.height;

          const renderContext = {
            canvasContext: leftContext,
            viewport,
          };

          renderTaskRef.current = page.render(renderContext);
          await renderTaskRef.current.promise;

          const leftImage = new Image();
          leftImage.src = leftCanvas.toDataURL();
          renderedPages.current.set(pageNum, { leftImage, rightImage: null });
        } else {
          const halfWidth = Math.floor(viewport.width / 2);
          leftCanvas.width = halfWidth;
          leftCanvas.height = viewport.height;
          rightCanvas.width = halfWidth;
          rightCanvas.height = viewport.height;

          const renderContextLeft = {
            canvasContext: leftContext,
            viewport,
            transform: [1, 0, 0, 1, 0, 0],
          };
          const renderContextRight = {
            canvasContext: rightContext,
            viewport,
            transform: [1, 0, 0, 1, -halfWidth, 0],
          };

          renderTaskRef.current = page.render(renderContextLeft);
          await renderTaskRef.current.promise;

          renderTaskRef.current = page.render(renderContextRight);
          await renderTaskRef.current.promise;

          const leftImage = new Image();
          leftImage.src = leftCanvas.toDataURL();
          const rightImage = new Image();
          rightImage.src = rightCanvas.toDataURL();
          renderedPages.current.set(pageNum, { leftImage, rightImage });
        }

        setError(null);
      } catch (err) {
        console.error("PDF 렌더링 중 에러:", err);
        setError("Failed to render the PDF. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [pdf] // pdf를 의존성 배열에 추가
  );

  const flipPage = (direction: "next" | "prev") => {
    if (!pdf) return;
    const newPageNumber =
      direction === "next"
        ? Math.min(pageNumber + 1, pdf.numPages)
        : Math.max(pageNumber - 1, 1);
    setPageNumber(newPageNumber);
  };

  return (
    <div className={styles.container}>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const files = e.target.files;
          if (files && files[0]) {
            loadPdf(files[0]);
          }
        }}
        className={styles.fileInput}
      />
      {error && <div className={styles.errorMessage}>{error}</div>}
      {isLoading && <div className={styles.loadingMessage}>Loading...</div>}
      <div className={styles.canvasContainer}>
        <canvas ref={leftCanvasRef} className={styles.canvas} />
        <canvas ref={rightCanvasRef} className={styles.canvas} />
      </div>
      <div className={styles.controls}>
        <button onClick={() => flipPage("prev")} disabled={pageNumber <= 2}>
          Previous
        </button>
        <p>
          Page {pageNumber} of {pdf?.numPages || 0}
        </p>
        <button
          onClick={() => flipPage("next")}
          disabled={pageNumber >= (pdf?.numPages || 0)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PdfViewerPage;
