"use client"; // 클라이언트 컴포넌트 선언 추가

export default function ErrorPage({ error }: { error: Error }) {
  return (
    <div>
      <h1>에러가 발생했습니다!</h1>
      <p>{error.message}</p>
    </div>
  );
}
