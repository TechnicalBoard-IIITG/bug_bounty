import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { SubNav } from "@/components/SubNav";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Amazon.com: Online Shopping for Electronics, Apparel, Computers, Books & more",
  description: "Official Target Application for Entropy 2K26 QA Bug Bounty Simulation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-amazon-bg text-amazon-text antialiased">
        <AuthProvider>
          <Header />
          <SubNav />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
