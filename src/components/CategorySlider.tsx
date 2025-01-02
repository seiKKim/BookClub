"use client"; // Next.js에서 Swiper.js 사용 시 필수

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper/modules";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import styles from "./CategorySlider.module.css"; // 스타일 CSS 모듈

const CategorySlider: React.FC = () => {
  // 카테고리별 카드 데이터
  const allSlides = {
    날씨: [
      {
        id: 1,
        img: "https://example.com/image1.jpg",
        title: "김민 귀한 스트리밍!",
        subtitle: "직관 꼭 예약하세요!",
      },
      {
        id: 2,
        img: "https://example.com/image2.jpg",
        title: "다오 옵션 통해 체험!",
        subtitle: "마법 같은 공간 발견",
      },
      {
        id: 3,
        img: "https://example.com/image1.jpg",
        title: "김민 귀한 스트리밍!",
        subtitle: "직관 꼭 예약하세요!",
      },
      {
        id: 4,
        img: "https://example.com/image2.jpg",
        title: "다오 옵션 통해 체험!",
        subtitle: "마법 같은 공간 발견",
      },
    ],
    요리: [
      {
        id: 3,
        img: "https://example.com/image3.jpg",
        title: "당일 예약도 가능!",
        subtitle: "명제가 남긴 최고의 기록",
      },
      {
        id: 4,
        img: "https://example.com/image4.jpg",
        title: "천 책의 100일 요약기",
        subtitle: "어디에도 없는 추천!",
      },
    ],
    과학: [
      {
        id: 5,
        img: "https://example.com/image5.jpg",
        title: "문화 콘텐츠의 최고봉",
        subtitle: "우연한 참여를 기록하다!",
      },
      {
        id: 6,
        img: "https://example.com/image6.jpg",
        title: "명작 영화 완전 정복!",
        subtitle: "오늘의 시청 필수!",
      },
    ],
    일상: [
      {
        id: 5,
        img: "https://example.com/image5.jpg",
        title: "문화 콘텐츠의 최고봉",
        subtitle: "우연한 참여를 기록하다!",
      },
      {
        id: 6,
        img: "https://example.com/image6.jpg",
        title: "명작 영화 완전 정복!",
        subtitle: "오늘의 시청 필수!",
      },
    ],
  };

  // 선택된 카테고리를 관리하는 상태
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof allSlides>("날씨");

  // 선택된 카테고리에 따라 슬라이더 데이터를 변경
  const slides = allSlides[selectedCategory];

  return (
    <div className={styles.container}>
      {/* 설명 문구 추가 */}
      <div className={styles.description}>
        <h1>관심 분야만 선택하세요</h1>
        <p>원하는 분야에 맞춰 알아서 추천해드려요</p>
      </div>

      {/* 카테고리 선택 버튼 */}
      <div className={styles.categorySelector}>
        {Object.keys(allSlides).map((category) => (
          <button
            key={category}
            className={`${styles.categoryButton} ${
              selectedCategory === category ? styles.activeCategory : ""
            }`}
            onClick={() => setSelectedCategory(category as keyof typeof allSlides)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Swiper 슬라이더 */}
      <Swiper
        className={styles.swiper}
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={3}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation
        pagination={{ clickable: true }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className={styles.swiperSlide}>
            <div
              className={styles.card}
              style={{ backgroundImage: `url(${slide.img})` }}
            >
              <div className={styles.cardContent}>
                <h4 className={styles.cardTitle}>{slide.title}</h4>
                <p className={styles.cardSubtitle}>{slide.subtitle}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategorySlider;
