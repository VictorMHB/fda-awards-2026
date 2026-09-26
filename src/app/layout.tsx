import "./globals.css";
import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import localFont from "next/font/local";
import OfflineToast from "@/components/OfflineToast";
import Header from "@/components/Header";

const josefin = localFont({
  src: [
    { path: "../assets/fonts/JosefinSans-Regular.ttf", weight: "400" },
    { path: "../assets/fonts/JosefinSans-Bold.ttf", weight: "700" },
  ],
  variable: "--font-josefin",
});

const spectral = localFont({
  src: [
    { path: "../assets/fonts/Spectral-Regular.ttf", weight: "400" },
    { path: "../assets/fonts/Spectral-Bold.ttf", weight: "700" },
  ],
  variable: "--font-spectral",
});

export const metadata: Metadata = {
  title: {
    default: "FDA Awards 2026",
    template: "%s · FDA Awards 2026",
  },
  description: "Vote nos seus favoritos de cada categoria do FDA Awards 2026.",
};

export const viewport: Viewport = {
  themeColor: "#1D2842",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body
        className={`${josefin.variable} ${spectral.variable} flex min-h-svh flex-col antialiased bg-dark-bg text-foreground`}
      >
        <AuthProvider>
          <Header />
          <div className="flex flex-1 flex-col">{children}</div>
        </AuthProvider>
        <Toaster richColors theme="dark" position="top-center" />
        <OfflineToast />
      </body>
    </html>
  );
}
