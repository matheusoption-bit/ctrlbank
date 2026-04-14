import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CtrlBank | Premium Banking Experience",
  description: "Clean, premium, minimalist finance management. C6 Bank inspired design.",
  keywords: ["banking", "finance", "money", "management", "control"],
  authors: [{ name: "CtrlBank Team" }],
  openGraph: {
    title: "CtrlBank",
    description: "Premium Banking Experience",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0A0A0A" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body 
        className={`${inter.variable} bg-background text-foreground antialiased overflow-x-hidden`}
        style={{ fontFamily: "var(--font-inter), system-ui" }}
      >
        <div className="min-h-screen">
          <main className="w-full max-w-2xl mx-auto px-4 py-6 md:py-8 md:px-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
