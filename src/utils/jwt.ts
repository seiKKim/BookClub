// src/utils/jwt.ts

import jwt from "jsonwebtoken";

// 토큰 페이로드 타입 정의
export interface JwtPayload {
  id: number;
  role: "R" | "U"; // 관리자("R") 또는 일반 사용자("U")
}

// JWT 검증 함수
export const verifyToken = (token: string, secret: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded as JwtPayload;
  } catch (error) {
    // error를 Error 타입으로 단언
    if (error instanceof Error) {
      console.error("JWT 검증 실패:", error.message);
    } else {
      console.error("JWT 검증 실패: 알 수 없는 오류");
    }
    return null;
  }
};
