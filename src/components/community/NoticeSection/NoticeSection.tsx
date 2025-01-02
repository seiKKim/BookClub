import React, { useState } from "react";

import styles from "../../../../src/app/community/Community.module.css";

interface Notice {
  title: string;
  date: string;
  content: string;
  isImportant: boolean;
}

interface Props {
  notices: Notice[];
}

const NoticeSection: React.FC<Props> = ({ notices }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleClick = (index: number) =>
    setExpandedIndex(expandedIndex === index ? null : index);

  const importantNotices = notices.filter((notice) => notice.isImportant);
  const generalNotices = notices.filter((notice) => !notice.isImportant);

  return (
    <div className={styles.noticeContainer}>
      {/* 중요 공지사항 */}
      {importantNotices.map((notice, index) => (
        <div
          key={`important-${index}`}
          className={`${styles.noticeItem} ${styles.importantNotice}`}
          onClick={() => handleClick(index)}
        >
          <div className={styles.noticeHeader}>
            <span className={styles.noticeIcon}>📌</span>
            <div>
              <p className={styles.noticeTitle}>{notice.title}</p>
              <p className={styles.noticeDate}>{notice.date}</p>
            </div>
          </div>
          {expandedIndex === index && (
            <div className={styles.noticeDetail}>
              <p>{notice.content}</p>
              <a href="#" className={styles.noticeLink}>
                자세히 보기
              </a>
            </div>
          )}
        </div>
      ))}

      <hr className={styles.divider} />

      {/* 일반 공지사항 */}
      {generalNotices.map((notice, index) => (
        <div
          key={`general-${index}`}
          className={styles.noticeItem}
          onClick={() => handleClick(index + importantNotices.length)}
        >
          <div className={styles.noticeHeader}>
            <span className={styles.noticeIcon}>📄</span>
            <div>
              <p className={styles.noticeTitle}>{notice.title}</p>
              <p className={styles.noticeDate}>{notice.date}</p>
            </div>
          </div>
          {expandedIndex === index + importantNotices.length && (
            <div className={styles.noticeDetail}>
              <p>{notice.content}</p>
              <a href="#" className={styles.noticeLink}>
                자세히 보기
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NoticeSection;
