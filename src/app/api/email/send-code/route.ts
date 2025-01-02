import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// 이메일 전송을 위한 nodemailer 셋업
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: "이메일이 제공되지 않았습니다." }, { status: 400 });
    }

    // 인증번호 생성 (6자리 난수)
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 만료 시간(10분 뒤)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // 기존 이메일의 인증번호 삭제 및 새 인증번호 저장
    await prisma.emailVerification.upsert({
      where: { email },
      update: { code, expiresAt },
      create: { email, code, expiresAt },
    });

    // 이메일 발송
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "이메일 인증 번호",
      text: `인증 번호는 ${code}입니다.`,
      html: `<p>인증 번호는 <b>${code}</b>입니다. 10분 이내에 입력해주세요.</p>`,
    });

    return NextResponse.json({ message: "인증번호가 이메일로 전송되었습니다." }, { status: 200 });
  } catch (error) {
    console.error("Error sending verification code:", error);
    return NextResponse.json({ message: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
