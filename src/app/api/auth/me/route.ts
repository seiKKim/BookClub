import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client"; // Prisma Client Import
import jwt from "jsonwebtoken";

// Prisma 클라이언트 초기화
const prisma = new PrismaClient();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// 사용자 정보 반환 API
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, message: "토큰이 제공되지 않았습니다." },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    const user = await prisma.user.findUnique({
      where: { userId: decoded.id },
      select: {
        userId: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "사용자가 존재하지 않습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user.userId,
          email: user.email,
          name: user.name || "사용자", // 기본값 설정
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("JWT 검증 실패:", error);
    return NextResponse.json(
      { success: false, message: "유효하지 않은 토큰입니다." },
      { status: 401 }
    );
  }
}
