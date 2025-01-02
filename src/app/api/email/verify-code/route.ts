import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json({ message: "이메일과 인증번호를 모두 제공해야 합니다." }, { status: 400 });
    }

    // 데이터베이스에서 인증번호 조회
    const verification = await prisma.emailVerification.findUnique({
      where: { email },
    });

    if (!verification) {
      return NextResponse.json({ message: "인증번호가 존재하지 않습니다." }, { status: 400 });
    }

    // 인증번호 만료 확인
    if (verification.expiresAt < new Date()) {
      return NextResponse.json({ message: "인증번호가 만료되었습니다." }, { status: 400 });
    }

    // 인증번호 일치 확인
    if (verification.code !== code) {
      return NextResponse.json({ message: "인증번호가 일치하지 않습니다." }, { status: 400 });
    }

    // 인증 성공 시 DB에서 인증번호 삭제
    await prisma.emailVerification.delete({
      where: { email },
    });

    return NextResponse.json({ message: "인증에 성공했습니다." }, { status: 200 });
  } catch (error) {
    console.error("Error verifying code:", error);
    return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
