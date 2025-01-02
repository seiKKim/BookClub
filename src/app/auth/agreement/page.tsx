"use client";

import React, { useState } from "react";

import styles from "./Agreement.module.css"; // CSS 모듈 임포트
import { useRouter } from "next/navigation"; // useRouter를 next/router에서 임포트

type AgreementKeys = 'all' | 'terms1' | 'terms2' | 'terms3' | 'terms4' | 'terms5';

const Agreement = () => {
  const router = useRouter(); // useRouter 훅 사용
  const [agreements, setAgreements] = useState<Record<AgreementKeys, boolean>>({
    all: false,
    terms1: false,
    terms2: false,
    terms3: false,
    terms4: false,
    terms5: false,
  });

  // 필수 & 선택 약관 목록
  const requiredTerms: AgreementKeys[] = ["terms1", "terms2", "terms3"];
  const optionalTerms: AgreementKeys[] = ["terms4", "terms5"];

  // 전체 동의 핸들러
  const handleAllAgree = () => {
    const newState = !agreements.all;
    setAgreements({
      all: newState,
      terms1: newState,
      terms2: newState,
      terms3: newState,
      terms4: newState,
      terms5: newState,
    });
  };

  // 개별 약관 동의 핸들러
  const handleIndividualAgree = (key: AgreementKeys) => {
    const updatedAgreements = { ...agreements, [key]: !agreements[key] };

    const allAgreed = Object.keys(updatedAgreements)
      .filter((k) => k !== "all")
      .every((k) => updatedAgreements[k as AgreementKeys]);

    setAgreements({
      ...updatedAgreements,
      all: allAgreed,
    });
  };

  // 모든 필수 약관이 동의되었는지 확인
  const isRequiredAgreed = requiredTerms.every((key) => agreements[key]);

  // 약관 보기 핸들러
  const handleViewTerms = (term: AgreementKeys) => {
    router.push(`/terms/${term}`); // 상세 약관 페이지로 이동
  };

  // 다음 버튼 클릭 핸들러
  const handleNext = () => {
    if (isRequiredAgreed) {
      router.push('/auth/signup'); // auth/signup으로 이동
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>BookClub 회원가입</h1>
        <p className={styles.subtitle}>서비스를 이용하려면 약관 동의가 필요합니다</p>

        {/* 전체 동의 */}
        <div className={styles.agreeAll}>
          <input
            type="checkbox"
            id="agreeAll"
            className={styles.checkbox}
            checked={agreements.all}
            onChange={handleAllAgree}
          />
          <label htmlFor="agreeAll" className={styles.label}>
            전체 동의하기
          </label>
        </div>

        <hr className={styles.divider} />

        {/* 약관 리스트 */}
        <div className={styles.termsList}>
          {/* 필수 약관 */}
          {requiredTerms.map((term, index) => (
            <div className={styles.term} key={term}>
              <input
                type="checkbox"
                id={term}
                className={styles.checkbox}
                checked={agreements[term]}
                onChange={() => handleIndividualAgree(term)}
              />
              <label htmlFor={term} className={styles.label}>
                {["[필수] BookClub 서비스 이용약관 동의", "[필수] 개인정보 수집 및 이용 동의", "[필수] 개인 정보 제3자 제공 동의"][index]}
              </label>
              <button className={styles.viewButton} onClick={() => handleViewTerms(term)}>보기</button>
            </div>
          ))}

          {/* 선택 약관 */}
          {optionalTerms.map((term, index) => (
            <div className={styles.term} key={term}>
              <input
                type="checkbox"
                id={term}
                className={styles.checkbox}
                checked={agreements[term]}
                onChange={() => handleIndividualAgree(term)}
              />
              <label htmlFor={term} className={styles.label}>
                {["[선택] 광고성 정보 수신 동의", "[선택] 마케팅 정보 수신 동의"][index]}
              </label>
              <button className={styles.viewButton} onClick={() => handleViewTerms(term)}>보기</button>
            </div>
          ))}
        </div>

        {/* 다음 버튼 */}
        <button
          className={`${styles.button} ${
            isRequiredAgreed ? styles.buttonEnabled : styles.buttonDisabled
          }`}
          disabled={!isRequiredAgreed}
          onClick={handleNext} // 다음 버튼 클릭 시 핸들러 추가
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default Agreement;
