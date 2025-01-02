"use client" // Next.js의 클라이언트 컴포넌트로 사용됨

import React, { useState } from "react"; // React와 useState 훅을 임포트
import { useMutation, useQueryClient } from "@tanstack/react-query"; // React Query의 useMutation과 useQueryClient 훅을 임포트

import LoginForm from "@/components/LoginForm"; // 로그인 폼 컴포넌트를 임포트
import Swal from "sweetalert2"; // SweetAlert2를 임포트하여 알림을 표시
import styles from "./Login.module.css"; // CSS 모듈을 임포트
import { useRouter } from "next/navigation"; // Next.js의 useRouter 훅을 임포트하여 라우팅 기능 사용

// 로그인 응답 타입 정의
interface LoginResponse {
  accessToken: string; // JWT 토큰
  userRole: "R" | "U"; // 사용자 역할 (관리자 또는 일반 사용자)
}

// 로그인 요청 변수 타입 정의
interface LoginVariables {
  email: string; // 사용자 이메일
  password: string; // 사용자 비밀번호
}

const Login: React.FC = () => {
  const queryClient = useQueryClient(); // React Query의 Query Client 인스턴스 생성
  const router = useRouter(); // 라우터 인스턴스 생성

  // 상태 변수 정의
  const [email, setEmail] = useState<string>(""); // 이메일 상태
  const [password, setPassword] = useState<string>(""); // 비밀번호 상태
  const [user, setUser] = useState<any>(null); // 사용자 정보를 저장할 상태

  // 로그인 뮤테이션 정의
  const loginMutation = useMutation<LoginResponse, Error, LoginVariables>({
    mutationFn: async ({ email, password }) => {
      // 로그인 요청을 위한 API 호출
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 요청
        },
        body: JSON.stringify({ email, password }), // 이메일과 비밀번호를 JSON으로 변환하여 전송
      });

      // 응답이 실패한 경우 에러 처리
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "로그인 실패"); // 에러 메시지 반환
      }

      return response.json(); // 성공 시 accessToken 반환
    },
    onSuccess: async (data) => {
      // 로그인 성공 시 실행되는 콜백
      localStorage.setItem("accessToken", data.accessToken); // JWT를 로컬 스토리지에 저장

      // 사용자 정보 요청
      const userInfo = await fetchUserProfile();
      setUser(userInfo); // 사용자 정보를 상태에 저장

      // 사용자 역할에 따라 경로 이동
      if (data.userRole === "R") {
        router.push("/admin/dashboard"); // 관리자 대시보드로 이동
      } else {
        router.push("/"); // 일반 사용자 홈으로 이동
      }
    },
    onError: (error: Error) => {
      // 로그인 실패 시 실행되는 콜백
      Swal.fire({
        title: "로그인 실패",
        text: error.message || "로그인 정보를 다시 확인해주세요.", // 에러 메시지 표시
        icon: "error",
        confirmButtonText: "확인",
      });
    },
  });

  // 사용자 프로필을 가져오는 함수
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("accessToken"); // 로컬 스토리지에서 JWT 가져오기

    if (token) {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`, // 헤더에 JWT 추가
        },
      });

      if (response.ok) {
        return await response.json(); // 사용자 정보 반환
      } else {
        throw new Error("Failed to fetch user profile"); // 에러 처리
      }
    }
  };

  // 로그인 폼 제출 핸들러
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    // 이메일과 비밀번호가 입력되지 않은 경우 에러 처리
    if (!email || !password) {
      Swal.fire({
        title: "입력 오류",
        text: "이메일과 비밀번호를 입력해주세요.", // 입력 오류 메시지 표시
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }

    loginMutation.mutate({ email, password }); // 로그인 요청
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>BookClub 로그인</h1>
        <LoginForm
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          onSubmit={handleLogin} // 폼 제출 핸들러 전달
          isLoading={loginMutation.status === "pending"} // 로딩 상태 전달
        />
        {user && (
          <div className={styles.userInfo}>
            <h2>Welcome, {user.email}</h2>  {/* 사용자 이메일 표시 */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login; 
