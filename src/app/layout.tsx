import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AppToaster from "@/components/feedback/AppToaster";
import { Krona_One, Work_Sans, Share_Tech_Mono } from "next/font/google";
import OfflineToast from "@/components/feedback/OfflineToast";
import Header from "@/components/layout/Header";
import AlertBanner from "@/components/feedback/AlertBanner";
import Boot from "@/components/intro/Boot";
import { BOOT_SCRIPT } from "@/lib/intro";
import { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import SiteBackground from "@/components/layout/SiteBackground";

export const metadata: Metadata = {
  title: "FDA Awards 2026",
};

const krona = Krona_One({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-krona",
});

const workSans = Work_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-work-sans",
});

const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-share-tech-mono",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body className={`${krona.variable} ${workSans.variable} ${shareTechMono.variable} antialiased bg-dark-bg text-foreground`}>
        <Boot />
        <SiteBackground />
        <AuthProvider>
          <Header />
          <div className="pt-24 md:pt-28">
            <AlertBanner />
            {children}
          </div>
        </AuthProvider>
        <AppToaster />
        <OfflineToast />
        <Footer />
      </body>
    </html>
  );
}