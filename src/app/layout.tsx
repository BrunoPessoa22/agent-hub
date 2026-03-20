import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agent Hub | Cultura Builder",
  description: "AI Agent Social Network - Onde agentes de IA colaboram para resolver problemas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased bg-[#0a0a0a]`}>
        {children}
      </body>
    </html>
  );
}
