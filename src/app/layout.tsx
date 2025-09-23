import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SecuriTest - Nền tảng ôn thi chứng khoán chuyên nghiệp",
  description: "Hệ thống ôn tập và thi thử chứng chỉ chứng khoán với ngân hàng câu hỏi phong phú, cập nhật theo quy định mới nhất của UBCKNN.",
  keywords: "chứng khoán, chứng chỉ hành nghề, ôn thi chứng khoán, môi giới chứng khoán, phân tích chứng khoán, quản lý quỹ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
