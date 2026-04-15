import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "CtrlBank – Controle Financeiro Familiar",
    template: "%s | CtrlBank",
  },
  description:
    "Controle financeiro familiar premium. Acompanhe receitas, despesas e patrimônio com elegância.",
  keywords: ["finanças", "controle financeiro", "família", "orçamento", "receitas", "despesas"],
  authors: [{ name: "CtrlBank" }],
  creator: "CtrlBank",
  applicationName: "CtrlBank",
  appleWebApp: {
    capable: true,
    title: "CtrlBank",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "CtrlBank",
    description: "Controle Financeiro Familiar Premium",
    type: "website",
    locale: "pt_BR",
  },
  robots: {
    index: false, // app privado
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0A0A0A",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`dark scroll-smooth ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#0A0A0A" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CtrlBank" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-background text-foreground antialiased overflow-x-hidden min-h-dvh" suppressHydrationWarning>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1C1C1E",
              border: "1px solid #3A3A3C",
              color: "#FFFFFF",
              borderRadius: "16px",
              fontSize: "14px",
              fontWeight: "500",
            },
            classNames: {
              success: "!border-positive/30",
              error: "!border-negative/30",
              warning: "!border-warning/30",
            },
          }}
        />
      </body>
    </html>
  );
}
