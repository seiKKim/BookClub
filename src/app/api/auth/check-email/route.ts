// pages/api/auth/check-email.ts

import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "@/lib/prisma"; // Prisma Client 초기화 파일 경로 (lib 디렉토리 아래에 생성할 예정)

// API 응답 타입 정의
type CheckEmailResponse = {
  success: boolean;
  message: string;
  isAvailable?: boolean; // 이메일 사용 가능 여부
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckEmailResponse>
) {
  // 허용된 요청 메서드 확인
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "허용되지 않은 요청 방식입니다.",
    });
  }

  // 요청 URL에 포함된 이메일 쿼리 확인
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({
      success: false,
      message: "유효한 이메일을 입력해주세요.",
    });
  }

  try {
    // 이메일로 사용자 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(200).json({
        success: true,
        isAvailable: false, // 이메일이 사용 중임
        message: "이미 등록된 이메일입니다.",
      });
    }

    // 사용 가능한 이메일
    return res.status(200).json({
      success: true,
      isAvailable: true, // 이메일 사용 가능
      message: "사용 가능한 이메일입니다.",
    });
  } catch (error) {
    console.error("아이디 중복 확인 중 오류 발생:", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    });
  }
}
