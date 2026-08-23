import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import localFont from "next/font/local";
import OfflineToast from "@/components/OfflineToast";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${josefin.variable} ${spectral.variable} antialiased bg-dark-bg text-foreground`}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster richColors position="top-center" />
        <OfflineToast />
      </body>
    </html>
  );
}