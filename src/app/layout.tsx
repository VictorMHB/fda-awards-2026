import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { Krona_One } from "next/font/google";
import localFont from "next/font/local";
import OfflineToast from "@/components/OfflineToast";
import Header from "@/components/Header";

const krona = Krona_One({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-krona",
});

const swansea = localFont({
  src: [
    { path: "../assets/fonts/Swansea-Regular.ttf", weight: "400", style: "normal" },
    { path: "../assets/fonts/Swansea-Italic.ttf", weight: "400", style: "italic" },
    { path: "../assets/fonts/Swansea-Bold.ttf", weight: "700", style: "normal" },
    { path: "../assets/fonts/Swansea-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-swansea",
  fallback: ["system-ui", "sans-serif"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${krona.variable} ${swansea.variable} antialiased bg-dark-bg text-foreground`}>
        <AuthProvider>
          <Header />
          <div className="pt-24 md:pt-28">{children}</div>
        </AuthProvider>
        <Toaster richColors position="top-center" />
        <OfflineToast />
      </body>
    </html>
  );
}