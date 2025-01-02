import React, { useState } from "react";

import styles from "../../../../src/app/community/Community.module.css";

const FaqSection: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleClick = (index: number) =>
    setExpandedIndex(expandedIndex === index ? null : index);

  return (
    <div className={styles.faqContainer}>
      {/* 섹션 헤더 */}
      <div className={styles.faqHeader}>
        <div>
          <h2>무엇을 도와드릴까요?</h2>
          <p>원하는 주제를 검색하거나, FAQ에서 자주 묻는 질문을 확인해보세요.</p>
        </div>
        <img src="/faq_icon.png" alt="FAQ 아이콘" className={styles.faqIcon} />
      </div>

      {/* 구분선 */}
      <hr className={styles.divider} />

      {/* 자주 묻는 질문 TOP 5 */}
      <h3 className={styles.sectionTitle}>자주 묻는 질문 TOP 5</h3>
      <ul className={styles.faqList}>
        {["서비스 이용 방법은?", "결제는 어떻게 진행하나요?", "환불 정책은 무엇인가요?", "앱은 어디에서 다운로드할 수 있나요?"].map(
          (question, index) => (
            <li key={index} className={styles.accordionItem} onClick={() => handleClick(index)}>
              <div className={styles.accordionHeader}>
                <p>{index + 1}. {question}</p>
                <span>{expandedIndex === index ? "-" : "+"}</span>
              </div>
              {expandedIndex === index && (
                <div className={styles.accordionContent}>
                  <p>여기에 답변 내용을 작성하세요.</p>
                </div>
              )}
            </li>
          )
        )}
      </ul>

      <hr className={styles.divider} />

      {/* 하단 버튼 섹션 */}
      <div className={styles.inquiryActions}>
        <p className={styles.inquiryText}>
          찾으시는 내용이 없으신가요?<br />
          1:1 문의하기 또는 채팅 문의하기를 이용해보세요.
        </p>
        <div className={styles.buttonGroup}>
          <button className={styles.inquiryButton} onClick={() => alert("1:1 문의 페이지로 이동")}>
            1:1 문의하기
          </button>
          <button className={styles.inquiryButton} onClick={() => alert("채팅 문의 페이지로 이동")}>
            채팅 문의하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
