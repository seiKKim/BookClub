"use client"

import React, { useEffect, useState } from 'react';

import styles from './ImageSlider.module.css';

interface ImageSliderProps {
  images: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 3초마다 슬라이드 변경

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, [images.length]);

  return (
    <div className={styles.slider}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`${styles.slide} ${index === currentIndex ? styles.active : ''} ${styles.fade}`}
        >
          <img src={image} alt={`Slide ${index + 1}`} />
        </div>
      ))}
    </div>
  );
};

export default ImageSlider;

