import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 공통 응답 함수
const sendResponse = (status: number, message: string, data: any = null) => {
  return NextResponse.json(
    { success: status < 400, message, data },
    { status }
  );
};

// GET 요청 - 사용자 목록 가져오기
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
  
    // 쿼리 파라미터 처리
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const searchQuery = searchParams.get("searchQuery");

    // 검색 필터
    const searchFilter = searchQuery
      ? {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { email: { contains: searchQuery, mode: "insensitive" } },
          ],
        }
      : {};

    // 전체 사용자 수와 사용자 데이터 가져오기
    const totalUsers = await prisma.user.count({
      where: {
        isDeleted: false,
        ...searchFilter,
      },
    });
    const users = await prisma.user.findMany({
      where: {
        isDeleted: false,
        ...searchFilter,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        userId: true,
        name: true,
        email: true,
        createdAt: true,
        phoneNumber: true,
        isActive: true,
        role: true,
        subscriptions: {
          select: {
            status: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    // 사용자 데이터 변환
    const formattedUsers = users.map((user) => ({
      id: user.userId,
      name: user.name || "N/A",
      email: user.email,
      joinDate: user.createdAt.toISOString().split("T")[0],
      subscriptionStatus: user.subscriptions[0]?.status || "N/A",
      subscriptionStartDate: user.subscriptions[0]?.startDate?.toISOString().split("T")[0] || "N/A",
      subscriptionEndDate: user.subscriptions[0]?.endDate?.toISOString().split("T")[0] || "N/A",
      isActive: user.isActive,
      role: user.role,
      phone: user.phoneNumber || "N/A",
    }));

    return sendResponse(200, "사용자 데이터를 성공적으로 가져왔습니다.", {
      users: formattedUsers,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error) {
    console.error("사용자 데이터를 가져오는 도중 오류 발생", error);
    return sendResponse(500, "서버 오류가 발생했습니다.");
  }
}

// POST 요청 - 사용자 생성
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 유효성 검사
    if (!body.email || !body.password) {
      return sendResponse(400, "이메일과 비밀번호는 필수입니다.");
    }

    // 사용자 생성
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password, // 비밀번호는 반드시 해싱해서 저장해야 한다.
        name: body.name || null,
        phoneNumber: body.phoneNumber || null,
        gender: body.gender || null,
      },
    });

    return sendResponse(201, "사용자가 성공적으로 생성되었습니다.", newUser);
  } catch (error) {
    console.error("사용자 생성 도중 오류 발생", error);
    return sendResponse(500, "사용자 생성 중 오류가 발생했습니다.");
  }
}

// DELETE 요청 - 사용자 삭제
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = parseInt(searchParams.get("id") || "0", 10);

    if (!userId) {
      return sendResponse(400, "잘못된 사용자 ID입니다.");
    }

    // 사용자 삭제(소프트 삭제)
    const deletedUser = await prisma.user.update({
      where: { userId },
      data: { isDeleted: true },
    });

    return sendResponse(200, "사용자가 성공적으로 삭제되었습니다.", deletedUser);
  } catch (error) {
    console.error("사용자 삭제 도중 오류 발생", error);
    return sendResponse(500, "사용자 삭제 중 오류가 발생했습니다.");
  }
}
