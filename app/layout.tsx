import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "다이사 - 홈서비스 플랫폼",
  description:
    "이사, 입주청소, 인터넷, 에어컨, 대출 비교까지. 무료 상담 신청으로 최대 혜택을 받으세요.",
  keywords: "이사, 입주청소, 인터넷 가입, 에어컨, 대출, 통신사 비교",
  openGraph: {
    title: "다이사 - 홈서비스 플랫폼",
    description: "이사/청소/인터넷/에어컨/대출 한번에 비교 & 무료 상담",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        {/* 카카오 주소 검색 (Daum Postcode) */}
        <Script
          src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
