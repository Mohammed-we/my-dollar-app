

import type { Metadata } from "next";
import Navbar from "@/componant/Navbar"; // تأكد من اسم المجلد components أو componant حسب ما هو موجود عندك
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "شركة الدولار توب",
  description: "خدمات الصرافة والدفع الإلكتروني",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#1a4d3a]">
        <Navbar />
     
<main className="flex-grow"> {/* قمنا بحذف pt-20 من هنا */}
  {children}
</main>
      </body>
    </html>
  );
}