// src/components/Popup.tsx

import Image from "next/image"; // next/image 임포트
import React from "react";
import styles from "./PopupUserManagement.module.css";

interface PopupProps {
  data: {
    title: string;
    description: string;
    image?: string;
  };
  onClose: () => void; // 닫기 이벤트 핸들러
}

const Popup: React.FC<PopupProps> = ({ data, onClose }) => {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {/* image 속성을 <Image /> 컴포넌트로 변경 */}
        {data.image && (
          <div className={styles.imageWrapper}>
            <Image
              src={data.image} // 이미지 소스
              alt={data.title} // 대체 텍스트
              width={300} // 이미지를 고정 크기로 제공 (너비)
              height={300} // 고정 크기로 제공 (높이)
              layout="intrinsic" // 고유 비율 유지 (기본값)
              className={styles.popupImage}
            />
          </div>
        )}
        <h2 className={styles.popupTitle}>{data.title}</h2>
        <p className={styles.popupDescription}>{data.description}</p>
      </div>
    </div>
  );
};

export default Popup;
