import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

// 🔥 KUNCINYA DI SINI: Pakai kurung kurawal!
import { Navigation } from "@/components/Navigation";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "PricePoint | Analytics Cloud",
  description:
    "Platform analitik kelayakan bisnis dan penentuan harga retail untuk UMKM dan Administrasi Niaga UNSRAT.",
  icons: {
    icon: "/price.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${bebasNeue.variable} ${dmSans.variable} antialiased bg-[#FAFAFA] text-[#0A0A0A]`}
      >
        <AuthProvider>
          {/* PANGGIL NAMED EXPORT-NYA */}
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
