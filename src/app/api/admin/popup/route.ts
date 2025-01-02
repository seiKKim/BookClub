//api/admin/popup/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Helpers for validation
const validateRequiredFields = (fields: Record<string, any>, requiredFields: string[]) => {
  const missingFields = requiredFields.filter((field) => !fields[field]);
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }
};

// GET: 활성화된 팝업 목록 가져오기
export async function GET() {
  try {
    const popups = await prisma.popup.findMany({
      where: { isVisible: true }, // 활성화된 팝업만 가져옴
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(popups);
  } catch (error) {
    console.error("[GET] Failed to fetch popups:", error);
    return NextResponse.json({ error: "Failed to fetch popups" }, { status: 500 });
  }
}

// POST: 팝업 생성
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      content,
      isVisible = true,
      startDate,
      endDate,
      position = "top", // 기본값은 top
      width = 500, // 기본값은 가로 500px
      height = 300, // 기본값은 세로 300px
    } = body;

    // 필수 필드 확인
    validateRequiredFields(body, ["title", "content", "startDate", "endDate"]);

    // 팝업 생성
    const popup = await prisma.popup.create({
      data: {
        title,
        content,
        isVisible,
        position,
        width: Number(width),
        height: Number(height),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json(popup, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      // error.message에 안전하게 접근 가능
      console.error("[POST] Failed to create popup:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      // unknown 타입인 경우 처리
      console.error("[POST] Unknown error:", error);
      return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
    }
  }
}

// PUT: 팝업 업데이트
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      content,
      isVisible = true,
      startDate,
      endDate,
      position = "top",
      width = 500,
      height = 300,
    } = body;

    // 필수 필드 확인
    validateRequiredFields(body, ["id", "title", "content", "startDate", "endDate"]);

    // 팝업 업데이트
    const popup = await prisma.popup.update({
      where: { id },
      data: {
        title,
        content,
        isVisible,
        position,
        width: Number(width),
        height: Number(height),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    return NextResponse.json(popup);
  } catch (error) {
    if (error instanceof Error) {
      // error.message에 안전하게 접근 가능
      console.error("[PUT] Failed to eidt popup:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      // unknown 타입인 경우 처리
      console.error("[PUT] Unknown error:", error);
      return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
    }
  }
}

// DELETE: 팝업 삭제
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // 팝업 삭제
    await prisma.popup.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Popup deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      // error.message에 안전하게 접근 가능
      console.error("[DELETE] Failed to delete popup:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      // unknown 타입인 경우 처리
      console.error("[DELETE] Unknown error:", error);
      return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
    }
  }
}
