import type { Metadata, Viewport } from "next";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "다이사 - 인터넷 가입 비교",
  description:
    "KT, LG U+, SK 통신 3사 인터넷 요금제를 한눈에 비교하고 최대 혜택을 받으세요. 무료 상담 신청까지 1분이면 충분합니다.",
  keywords: "인터넷 가입, 통신사 비교, KT, LG U+, SK, 인터넷 설치, 지원금",
  openGraph: {
    title: "다이사 - 인터넷 가입 비교",
    description: "통신 3사 인터넷 요금제 비교 & 최대 혜택 무료 상담",
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
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
