import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexus ERP - Yeni Nesil Kurumsal Yönetim",
  description: "Modern, hızlı ve modüler ERP alternatifi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}>
      <body className="min-h-screen bg-background text-foreground selection:bg-primary/30">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden pt-0 sm:ml-64">
            <Header />
            <main className="flex-1 p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
