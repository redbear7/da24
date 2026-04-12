import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "당근 - 내 근처의 모든 중고거래",
  description:
    "내 동네 이웃과 함께하는 중고거래. 가까운 이웃과 믿을 수 있는 거래를 시작해보세요.",
  keywords: "중고거래, 당근마켓, 동네, 중고, 무료나눔",
  openGraph: {
    title: "당근 - 내 근처의 모든 중고거래",
    description: "내 동네 이웃과 함께하는 중고거래",
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
      <body className="min-h-full flex flex-col bg-muted">
        <div className="app-container">{children}</div>
      </body>
    </html>
  );
}
