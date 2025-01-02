import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // 사용자 ID 필드 추가
      role: string; // 사용자 역할 필드 추가 (예: "admin", "user")
    } & DefaultSession["user"]; // 기본 필드(name, email, image) 포함
  }

  interface User extends DefaultUser {
    id: string; // 사용자 ID 필드 추가
    role: string; // 사용자 역할 필드 추가
  }

  interface JWT {
    id: string; // JWT 토큰에 사용자 ID 필드 추가
    role: string; // 사용자 역할 필드 추가
  }
}
