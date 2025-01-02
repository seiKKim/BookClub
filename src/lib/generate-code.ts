export default function generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6자리 인증번호 생성
  }