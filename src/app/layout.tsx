import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { Krona_One, Work_Sans } from "next/font/google";
import localFont from "next/font/local";
import OfflineToast from "@/components/feedback/OfflineToast";
import Header from "@/components/layout/Header";
import AlertBanner from "@/components/feedback/AlertBanner";
import Boot from "@/components/intro/Boot";

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



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: o script da abertura marca o <html> antes do React
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${krona.variable} ${workSans.variable} antialiased bg-dark-bg text-foreground`}>
        <Boot />
        <AuthProvider>
          <Header />
          <div className="pt-24 md:pt-28">
            <AlertBanner />
            {children}
          </div>
        </AuthProvider>
        <Toaster richColors position="top-center" />
        <OfflineToast />
      </body>
    </html>
  );
}