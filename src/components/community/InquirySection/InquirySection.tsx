import React from "react";
import styles from "../../../../src/app/community/Community.module.css";

const InquirySection: React.FC = () => {
  return (
    <div className={styles.inquiryContainer}>
      <p>아래 입력창에 내용을 작성해주시면 담당자가 최대한 빠르게 답변을 드리겠습니다.</p>
      <form className={styles.inquiryForm}>
        <label>
          <span>문의 유형을 선택해주세요</span>
          <select name="category" required>
            <option value="">문의 유형 선택</option>
            <option value="account">계정 문의</option>
            <option value="payment">결제 문의</option>
            <option value="technical">기술 지원</option>
          </select>
        </label>
        <label>
          <span>제목</span>
          <input type="text" name="title" placeholder="간단하게 문의 제목을 입력해주세요" required />
        </label>
        <label>
          <span>내용</span>
          <textarea name="message" placeholder="문의 내용을 입력해주세요." rows={5} required></textarea>
        </label>
        <label>
          <span>이름</span>
          <input type="text" name="name" placeholder="이름을 입력해주세요" required />
        </label>
        <label>
          <span>이메일</span>
          <input type="email" name="email" placeholder="example@email.com" required />
        </label>
        <label>
          <span>연락처</span>
          <input type="tel" name="phone" placeholder="휴대폰 번호를 입력해주세요" required />
        </label>
        <label className={styles.checkbox}>
          <input type="checkbox" name="agree" required />
          <span>개인정보 수집 및 이용에 동의합니다.</span>
        </label>
        <button type="submit">제출하기</button>
      </form>
    </div>
  );
};

export default InquirySection;
