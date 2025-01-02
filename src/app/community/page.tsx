"use client"

import React, { useState } from "react";

import FaqSection from "../../components/community/FaqSection/FaqSection";
import InquirySection from "../../components/community/InquirySection/InquirySection";
import NoticeSection from "../../components/community/NoticeSection/NoticeSection";
import { noticeData } from "../../data/data";
import styles from "./Community.module.css";

const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("faq");

  return (
    <div className={styles.communityContainer}>
      <h1 className={styles.pageTitle}>
        {activeTab === "faq" ? "고객센터" : activeTab === "inquiry" ? "1:1 문의" : "공지사항"}
      </h1>

      <div className={styles.tabContainer}>
        <button className={`${styles.tab} ${activeTab === "faq" ? styles.active : ""}`} onClick={() => setActiveTab("faq")}>
          FAQ
        </button>
        <button className={`${styles.tab} ${activeTab === "inquiry" ? styles.active : ""}`} onClick={() => setActiveTab("inquiry")}>
          1:1 문의
        </button>
        <button className={`${styles.tab} ${activeTab === "notice" ? styles.active : ""}`} onClick={() => setActiveTab("notice")}>
          공지사항
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === "faq" && <FaqSection />}
        {activeTab === "inquiry" && <InquirySection />}
        {activeTab === "notice" && <NoticeSection notices={noticeData} />}
      </div>
    </div>
  );
};

export default CommunityPage;
