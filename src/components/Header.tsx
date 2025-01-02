"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Link from "next/link";
import styles from "./Header.module.css";
import { useAuth } from "@/context/AuthContext";

const Header: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth(); // 사용자 인증 상태 가져오기
  console.log("Header user object:", user); // 디버깅용 로그

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // 페이지 활성화 상태 확인
  const isActive = (path: string) => pathname === path;

  // 방문자용 메뉴
  const guestMenu = [
    { path: "/about", label: "소개" },
    { path: "/community", label: "문의하기" },
  ];

  // 사용자용 메뉴
  const userMenu = [
    { path: "/book", label: "추천 도서 보기" },
    { path: "/search", label: "콘텐츠 검색" },
    { path: "/feed", label: "피드" },
    { path: "/my-library", label: "내 서재" },
  ];

  // 관리자 전용 메뉴
  const adminMenu = [
    { path: "/admin/dashboard", label: "관리자 대시보드" },
    { path: "/admin/popup", label: "팝업 관리" },
    { path: "/admin/users", label: "사용자 관리" },
    { path: "/admin/booklist", label: "책 관리" },
  ];

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  // 모바일 메뉴 토글
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.header}>
      {/* 로고 */}
      <div className={styles.logo}>
        <Link href={isLoggedIn ? "/" : "/auth/login"} onClick={closeMenu}>
          BookClub
        </Link>
      </div>

      {/* 내비게이션 메뉴 */}
      <nav
        role="navigation"
        aria-label="메인 메뉴"
        className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}
      >
        <ul>
          {/* 방문자용 메뉴 */}
          {!user?.role || user.role !== "R" ? (
            guestMenu.map((item) => (
              <li
                key={item.path}
                className={isActive(item.path) ? styles.active : ""}
              >
                <Link href={item.path} onClick={closeMenu}>
                  {item.label}
                </Link>
              </li>
            ))
          ) : null}

          {/* 사용자용 메뉴 (관리자일 때 제외) */}
          {isLoggedIn &&
            user?.role !== "R" &&
            userMenu.map((item) => (
              <li
                key={item.path}
                className={isActive(item.path) ? styles.active : ""}
              >
                <Link href={item.path} onClick={closeMenu}>
                  {item.label}
                </Link>
              </li>
            ))}

          {/* 관리자 전용 메뉴 */}
          {isLoggedIn &&
            user?.role === "R" &&
            adminMenu.map((item) => (
              <li
                key={item.path}
                className={isActive(item.path) ? styles.active : ""}
              >
                <Link href={item.path} onClick={closeMenu}>
                  {item.label}
                </Link>
              </li>
            ))}
        </ul>
      </nav>

      {/* 사용자 액션 버튼 */}
      <div className={styles.userActions}>
        {isLoggedIn ? (
          <>
            <span className={styles.userInfo}>
              {user
                ? `안녕하세요, ${user.email} (${
                    user.role === "R" ? "관리자" : "사용자"
                  })`
                : "사용자 정보를 불러오는 중..."}
            </span>
            <button className={styles.loginButton} onClick={closeMenu}>
              내정보
            </button>
            <button className={styles.signupButton} onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login">
              <button className={styles.loginButton} onClick={closeMenu}>
                로그인
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className={styles.signupButton} onClick={closeMenu}>
                회원가입
              </button>
            </Link>
          </>
        )}
      </div>

      {/* 모바일 메뉴 토글 버튼 */}
      <button
        className={styles.hamburgerButton}
        aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={isMenuOpen}
        onClick={toggleMenu}
      >
        <span className={`${styles.bar} ${isMenuOpen ? styles.barOpen : ""}`} />
        <span className={`${styles.bar} ${isMenuOpen ? styles.barOpen : ""}`} />
        <span className={`${styles.bar} ${isMenuOpen ? styles.barOpen : ""}`} />
      </button>
    </header>
  );
};

export default Header;
