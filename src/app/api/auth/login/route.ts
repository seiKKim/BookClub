import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma"; // Prisma 클라이언트 설정 파일을 임포트

// JWT 비밀키
const secretKey = process.env.JWT_SECRET || "yourSecretKey";

// POST 메서드: 로그인 처리
export async function POST(request: NextRequest) {
  try {
    // 클라이언트에서 보낸 요청 데이터 파싱
    const { email, password } = await request.json();

    // 필수 입력값 확인
    if (!email || !password) {
      return NextResponse.json(
        { message: "이메일과 비밀번호를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    // DB에서 사용자 확인 (Prisma 활용)
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 사용자 또는 비밀번호 검증 실패
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: "잘못된 이메일 또는 비밀번호입니다." },
        { status: 401 }
      );
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      {
        id: user.userId, // 사용자 고유 ID
        email: user.email, // 이메일 정보
      },
      secretKey,
      { expiresIn: "1h" } // 토큰 만료 시간 설정 (1시간)
    );

    // 응답 반환
    return NextResponse.json({
      message: "로그인 성공",
      accessToken: token,
      user: {
        id: user.userId, // 사용자 ID
        email: user.email, // 사용자 이메일
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    // 서버 오류 처리
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
