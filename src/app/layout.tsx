// src/app/layout.tsx
import "./globals.css";

import { AppProviders } from "./AppProviders";
import Footer from "@/components/Footer";
import HeaderClient from "@/components/HeaderClient"; // 클라이언트용 헤더

export const metadata = {
  title: "BookClub",
  description: "책 추천 플랫폼",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <AppProviders>
          <HeaderClient /> {/* 분리된 클라이언트용 헤더 컴포넌트 */}
          <main>{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
