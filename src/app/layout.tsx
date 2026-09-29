import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { Krona_One, Work_Sans } from "next/font/google";
import localFont from "next/font/local";
import OfflineToast from "@/components/OfflineToast";
import Header from "@/components/Header";
import AlertBanner from "@/components/AlertBanner";

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
    <html lang="pt-BR">
      <body className={`${krona.variable} ${workSans.variable} antialiased bg-dark-bg text-foreground`}>
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