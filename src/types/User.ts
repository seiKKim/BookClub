export interface User {
  id: number; // 사용자 식별 ID
  name: string; // 이름
  email: string; // 이메일
  joinDate: string; // 가입 날짜
  subscriptionStatus: "Active" | "Trial" | "Expired"; // 구독 상태
  subscriptionPlan: "Basic" | "Premium" | "VIP"; // 구독 플랜
  lastLogin: string; // 최근 로그인 날짜
  borrowedBooks: number; // 대출 도서 수
  status: "Active" | "Inactive"; // 활동 상태
  userType: "User" | "Admin"; // 회원 유형
  phone?: string; // 선택적 전화번호
  memo?: string; // 기타 메모
}