"use client";

import React, { useState } from "react";

import Swal from "sweetalert2"; // SweetAlert2 가져오기
import styles from "./Signup.module.css";
import { useRouter } from "next/navigation"; // useRouter 가져오기

// 유효성 검사 유틸리티 함수
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\d{10,11}$/; // 10자~11자, 숫자만 입력 가능
  return phoneRegex.test(phone);
};

const Signup = () => {
  const router = useRouter(); // useRouter 훅 초기화
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증번호 발송 여부
  const [inputCode, setInputCode] = useState(""); // 인증번호 입력값
  const [email, setEmail] = useState(""); // 이메일 입력값
  const [password, setPassword] = useState(""); // 비밀번호 입력값
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인
  const [passwordVisible, setPasswordVisible] = useState(false); // 비밀번호 가시성
  const [passwordsMatch, setPasswordsMatch] = useState(true); // 비밀번호 일치 여부
  const [emailError, setEmailError] = useState(""); // 이메일 유효성 에러
  const [phoneNumber, setPhoneNumber] = useState(""); // 전화번호 입력값
  const [phoneError, setPhoneError] = useState(""); // 전화번호 유효성 에러
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  // 비밀번호 입력 핸들러
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordsMatch(newPassword === confirmPassword);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordsMatch(password === newConfirmPassword);
  };

  // 전화번호 입력 핸들러
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);

    if (!validatePhoneNumber(newPhoneNumber)) {
      setPhoneError("유효한 전화번호를 입력해주세요.");
    } else {
      setPhoneError("");
    }
  };

  // 이메일 인증 요청
  const handleSendCode = async () => {
    if (!validateEmail(email)) {
      setEmailError("유효한 이메일 주소를 입력해주세요.");
      Swal.fire({
        icon: "error",
        title: "오류",
        text: "유효한 이메일 주소를 입력해주세요",
      });
      return;
    }

    setEmailError(""); // 이메일 오류 초기화
    setIsLoading(true); // 로딩 상태 활성화

    try {
      const response = await fetch("/api/email/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsCodeSent(true);
        Swal.fire({
          icon: "success",
          title: "성공",
          text: "인증번호가 발송되었습니다.",
        });
      } else {
        const data = await response.json();
        Swal.fire({
          icon: "error",
          title: "실패",
          text: data.message || "인증번호 발송 실패",
        });
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      Swal.fire({
        icon: "error",
        title: "오류",
        text: "인증번호 발송 중 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 인증번호 확인 요청
  const handleVerifyCode = async () => {
    try {
      const response = await fetch("/api/email/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: inputCode }),
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "인증 완료",
          text: "인증 성공!",
        });
      } else {
        const data = await response.json();
        Swal.fire({
          icon: "error",
          title: "실패",
          text: data.message || "인증번호가 잘못되었습니다.",
        });
      }
    } catch (error) {
      console.error("인증번호 확인 중 오류:", error);
      Swal.fire({
        icon: "error",
        title: "오류",
        text: "인증번호 확인 중 문제가 발생했습니다.",
      });
    }
  };

  // 회원가입 요청
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordsMatch) {
      Swal.fire({
        icon: "error",
        title: "오류",
        text: "비밀번호가 일치하지 않습니다.",
      });
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: "사용자 이름",
          phoneNumber,
          birthDate: "1990-01-01", // 생년월일 추가 필요
          gender: "MALE", // 추가적으로 라디오 버튼 값을 반영
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "회원가입 성공",
          text: data.message || "회원가입이 완료되었습니다.",
        }).then(() => {
          router.push("/auth/login"); // 회원가입 성공 시 이동
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "회원가입 실패",
          text: data.message || "다시 시도해주세요.",
        });
      }
    } catch (error) {
      console.error("회원가입 요청 실패:", error);
      Swal.fire({
        icon: "error",
        title: "오류",
        text: "회원가입 중 문제가 발생했습니다.",
      });
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSignup}>
        <h1 className={styles.title}>회원정보 입력</h1>

        {/* 이름 */}
        <div className={styles.field}>
          <label className={styles.label}>이름</label>
          <input
            type="text"
            placeholder="이름을 입력해주세요"
            className={styles.input}
          />
        </div>

        {/* 생년월일 및 성별 */}
        <div className={styles.field}>
          <label className={styles.label}>생년월일</label>
          <input type="date" className={styles.input} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>성별</label>
          <div className={styles.radioGroup}>
            <label>
              <input type="radio" name="gender" value="male" defaultChecked />남
            </label>
            <label>
              <input type="radio" name="gender" value="female" />여
            </label>
          </div>
        </div>

        {/* 휴대전화번호 */}
        <div className={styles.field}>
          <label className={styles.label}>휴대전화번호</label>
          <input
            type="text"
            placeholder="휴대전화번호를 입력해주세요"
            className={styles.input}
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
          {phoneError && <small className={styles.error}>{phoneError}</small>}
        </div>

        {/* 이메일 입력 */}
        {/* <div className={`${styles.field} ${styles.emailField}`}> */}
        <div className={styles.field}>
          <label className={styles.label}>아이디</label>
          <input
            type="email"
            placeholder="이메일을 입력해주세요"
            className={`${styles.input} ${styles.inputEmail}`} /* 이메일 입력 창 */
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="button"
            className={styles.buttonFull} /* 인증번호 발송 버튼 */
            disabled={isLoading}
            onClick={handleSendCode}
          >
            {isLoading ? "발송 중..." : "인증 발송"}
          </button>
        </div>

        {/* 인증번호 입력 */}
        {isCodeSent && (
          <div className={styles.field}>
            <label className={styles.label}>인증번호 입력</label>
            <input
              type="text"
              placeholder="인증번호를 입력해주세요"
              className={styles.input}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
            <button
              type="button"
              className={styles.button}
              onClick={handleVerifyCode}
              disabled={isLoading}
            >
              {isLoading ? "확인 중..." : "확인"}
            </button>
          </div>
        )}

        {/* 비밀번호 */}
        <div className={styles.field}>
          <label className={styles.label}>비밀번호</label>
          <div className={styles.passwordWrapper}>
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="비밀번호를 입력해주세요"
              className={styles.input}
              value={password}
              onChange={handlePasswordChange}
            />
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="비밀번호를 확인해주세요"
              className={styles.input}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className={styles.togglePasswordButton}
            >
              {passwordVisible ? "숨기기" : "보기"}
            </button>
          </div>
          {!passwordsMatch && (
            <small className={styles.error}>
              비밀번호가 일치하지 않습니다.
            </small>
          )}
        </div>

        {/* 버튼 */}
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={`${styles.button} ${styles.cancelButton}`}
          >
            취소
          </button>
          <button
            type="submit"
            className={`${styles.button} ${styles.submitButton}`}
          >
            가입하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
