"use client";

import React, { useState } from "react";

import styles from "./Search.module.css";

interface Content {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

interface Category {
  name: string;
  items: Content[];
}

const CategoryPage: React.FC = () => {
  // 카테고리 데이터
  const categories: Category[] = [
    {
      name: "eBook",
      items: [
        {
          id: 1,
          title: "부자 아빠 가난한 아빠",
          description: "돈에 대한 새로운 관점을 제시하는 책.",
          imageUrl: "/rich_dad_poor_dad.jpg",
        },
        {
          id: 2,
          title: "1984",
          description: "조지 오웰의 반유토피아 소설.",
          imageUrl: "/1984.jpg",
        },
      ],
    },
    {
      name: "학습영상",
      items: [
        {
          id: 3,
          title: "Atomic Habits",
          description: "작은 습관이 큰 변화를 만든다.",
          imageUrl: "/atomic_habits.jpg",
        },
      ],
    },
    {
      name: "VR 영화관 모드",
      items: [
        {
          id: 4,
          title: "인셉션",
          description: "꿈속의 꿈으로 들어가는 스릴러 영화.",
          imageUrl: "/inception.jpg",
        },
      ],
    },
  ];

  // 상태 관리
  const [activeTab, setActiveTab] = useState<string>("전체");

  // 필터링된 카테고리 데이터
  const filteredCategories =
    activeTab === "전체"
      ? categories
      : categories.filter((category) => category.name === activeTab);

  return (
    <div className={styles.container}>
      {/* 헤더 영역 */}
      <header className={styles.header}>
        <input
          type="text"
          placeholder="검색어를 입력하세요..."
          className={styles.searchBar}
        />
        <div className={styles.tabs}>
          {["전체", "eBook", "학습영상", "VR 영화관 모드"].map((tab, index) => (
            <button
              key={index}
              className={`${styles.tabButton} ${activeTab === tab ? styles.active : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* 카테고리 콘텐츠 */}
      <div className={styles.categoryContainer}>
        {filteredCategories.map((category, categoryIndex) => (
          <section key={categoryIndex} className={styles.categorySection}>
            <h2 className={styles.categoryTitle}>{category.name}</h2>
            <div className={styles.contentList}>
              {category.items.map((item) => (
                <div key={item.id} className={styles.card}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className={styles.cardImage}
                  />
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardDescription}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
