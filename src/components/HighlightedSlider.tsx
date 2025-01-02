"use client"; // 꼭 추가해야 합니다.

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import React from "react";
import styles from "./HighlightedSlider.module.css"; // CSS 모듈 불러오기

const HighlightedSlider: React.FC = () => {
  const slides = [
    {
      id: 1,
      img: "https://ssl.pstatic.net/melona/libs/1516/1516311/21b5f56c012af523213c_20241216150310393.jpg",
      title: "First Slide",
    },
    {
      id: 2,
      img: "https://your-image-url.com/image2.jpg",
      title: "Second Slide",
    },
  ];

  return (
    <Swiper
      className={styles.swiper} // Swiper 컨테이너 스타일 적용
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      autoplay={{ delay: 3000 }}
      pagination={{ clickable: true }}
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id} className={styles.swiperSlide}>
          <img src={slide.img} alt={slide.title} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HighlightedSlider;
