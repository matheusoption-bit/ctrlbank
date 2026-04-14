import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CtrlBank | Premium Banking Experience",
  description: "Gerencie suas finanças com elegância. Dashboard premium inspirado no C6 Bank.",
  keywords: ["banking", "finanças", "controle financeiro", "ctrlbank"],
  authors: [{ name: "CtrlBank" }],
  creator: "CtrlBank",
  openGraph: {
    title: "CtrlBank",
    description: "Premium Banking Experience",
    type: "website",
    locale: "pt_BR",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`dark scroll-smooth ${inter.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0A0A0A" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CtrlBank" />
      </head>
      <body className="bg-background text-foreground antialiased overflow-x-hidden font-inter">
        {children}
        <Toaster theme="dark" position="top-right" />
      </body>
    </html>
  );
}
