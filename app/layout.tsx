import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CtrlBank | Premium Banking Experience",
  description: "Clean, premium, minimalist finance management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <main className="min-h-screen max-w-md mx-auto px-4 py-8 md:max-w-4xl">
          {children}
        </main>
      </body>
    </html>
  );
}
