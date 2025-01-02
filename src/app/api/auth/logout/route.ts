import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 응답 시 브라우저 쿠키에서 JWT 삭제
    const response = NextResponse.json(
      { message: "로그아웃 성공" },
      { status: 200 }
    );
    
    // 'accessToken' 쿠키 제거
    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(0), // 만료일 과거로 설정
    });

    return response;
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { message: "서버 오류로 로그아웃하지 못했습니다." },
      { status: 500 }
    );
  }
}
