import type { NextApiRequest, NextApiResponse } from "next";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, phoneNumber, birthDate, gender } = body;

    // 필수 필드 검사
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "이메일과 비밀번호는 필수입니다.",
        }),
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "이미 등록된 이메일입니다.",
        }),
        { status: 409 }
      );
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phoneNumber,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        gender,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "회원가입이 완료되었습니다.",
        data: {
          userId: newUser.userId,
          email: newUser.email,
          name: newUser.name,
        },
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("회원가입 중 오류 발생:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      }),
      { status: 500 }
    );
  }
}
