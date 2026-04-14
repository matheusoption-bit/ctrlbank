import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CtrlBank | Premium Banking Experience",
  description: "Clean, premium, minimalist finance management. C6 Bank inspired design.",
  keywords: ["banking", "finance", "money", "management", "control", "ctrlbank"],
  authors: [{ name: "CtrlBank Team" }],
  creator: "CtrlBank",
  openGraph: {
    title: "CtrlBank",
    description: "Premium Banking Experience",
    type: "website",
    locale: "pt_BR",
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <meta name="apple-mobile-web-app-title" content="CtrlBank" />
      </head>
      <body
        className="bg-background text-foreground antialiased overflow-x-hidden"
        style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}
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
