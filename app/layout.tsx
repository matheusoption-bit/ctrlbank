import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
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
    default: "CtrlBank — Saúde Financeira Familiar",
    template: "%s | CtrlBank — Saúde Financeira Familiar",
  },
  description: "O CtrlBank não registra gastos. Ele governa a saúde financeira da família.",
  keywords: ["saúde financeira", "governança familiar", "família", "planejamento", "receitas", "despesas"],
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
    description: "O CtrlBank não registra gastos. Ele governa a saúde financeira da família.",
    type: "website",
    locale: "pt_BR",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f0f0f",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`dark scroll-smooth ${inter.variable} ${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-background text-foreground antialiased overflow-x-hidden min-h-dvh"
        suppressHydrationWarning
      >
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#fafafa",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
            },
            classNames: {
              success: "!border-accent-primary/30",
              error:   "!border-accent-danger/30",
              warning: "!border-accent-warning/30",
            },
          }}
        />
      </body>
    </html>
  );
}
