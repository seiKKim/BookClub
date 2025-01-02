import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json();
    
    if (!email || !newPassword) {
      return NextResponse.json({ message: "이메일과 새 비밀번호를 입력하세요." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    if (!user) {
      return NextResponse.json({ message: "사용자를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ message: "비밀번호가 성공적으로 변경되었습니다." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
