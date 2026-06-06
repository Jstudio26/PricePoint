"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import {
  History,
  LayoutDashboard,
  Settings,
  ArrowLeft,
  Percent,
  Coffee,
  BookOpen,
  Target,
  Briefcase,
  ChevronDown,
  ChefHat,
  Wallet,
  Factory,
  Landmark,
  FileText,
  UserCircle2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

// 🔥 Named Export sesuai solusi sebelumnya
export const Navigation = () => {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    router.back();
  };

  if (pathname === "/login" || pathname === "/welcome" || pathname === "/") {
    return null;
  }

  // Daftar rute utama di mana tombol "Kembali" TIDAK perlu ditampilkan
  const mainRoutes = [
    "/",
    "/calculator",
    "/bep",
    "/hpp-builder",
    "/roi",
    "/invoice",
    "/depreciation",
    "/tax",
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 p-4 lg:px-8 shadow-sm flex justify-between items-center sticky top-0 z-50 font-body transition-all duration-300">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="flex items-center gap-6">
        {/* --- TOMBOL KEMBALI --- */}
        {!mainRoutes.includes(pathname) && (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-500 hover:text-[#FF6B00] font-bold text-[10px] uppercase tracking-widest bg-gray-50 hover:bg-[#FF6B00]/5 px-4 py-2 rounded-full border border-gray-200 hover:border-[#FF6B00]/30 active:scale-95 transition-all group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Kembali
          </button>
        )}

        {/* --- LOGO --- */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#FFC400] to-[#DD2C00] p-[2px] rounded-2xl shadow-md">
            <div className="bg-white p-1 rounded-[14px] flex items-center justify-center overflow-hidden w-10 h-10 relative">
              <Image
                src="/price.svg"
                alt="PricePoint Logo"
                fill
                className="object-contain p-1"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <Link
              href={isMounted && isAuthenticated ? "/calculator" : "/"}
              className="font-display text-2xl tracking-wider text-gray-900 leading-none hover:opacity-80 transition-opacity"
            >
              PRICE<span className="text-[#FF6B00]">POINT</span>
            </Link>
            <span className="text-[9px] font-bold text-gray-400 tracking-[0.3em] uppercase mt-0.5">
              Analytics Cloud
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 md:gap-6 items-center">
        {!isMounted ? (
          <div className="w-24 h-10"></div>
        ) : (
          <div className="flex items-center gap-4 md:gap-6">
            {/* 1. MENU PANDUAN */}
            <Link
              href="/guide"
              className={`flex flex-col items-center group ${pathname === "/guide" ? "text-[#FF6B00]" : "text-gray-400 hover:text-[#FF6B00]"}`}
            >
              <BookOpen
                size={20}
                className="group-hover:-translate-y-1 transition-transform"
              />
              <span
                className={`text-[8px] font-bold tracking-[0.2em] mt-1 ${pathname === "/guide" ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity uppercase hidden md:block`}
              >
                Panduan
              </span>
            </Link>

            {/* 2. MENU SIMULATOR (MAIN) */}
            <Link
              href="/calculator"
              className={`flex flex-col items-center group ${pathname === "/calculator" ? "text-[#FF6B00]" : "text-gray-400 hover:text-[#FF6B00]"}`}
            >
              <Percent
                size={20}
                className="group-hover:-translate-y-1 transition-transform"
              />
              <span
                className={`text-[8px] font-bold tracking-[0.2em] mt-1 ${pathname === "/calculator" ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity uppercase hidden md:block`}
              >
                Simulator
              </span>
            </Link>

            {/* 3. DROPDOWN: BUSINESS TOOLS */}
            <div className="relative group py-2">
              <button className="flex flex-col items-center text-gray-400 hover:text-[#FF6B00] transition-colors outline-none">
                <Briefcase
                  size={20}
                  className="group-hover:-translate-y-1 transition-transform"
                />
                <span className="text-[8px] font-bold tracking-[0.2em] mt-1 uppercase hidden md:flex items-center gap-0.5">
                  Tools{" "}
                  <ChevronDown
                    size={10}
                    className="group-hover:rotate-180 transition-transform duration-300"
                  />
                </span>
              </button>

              {/* Tooltip Dropdown Panel */}
              <div className="absolute top-full right-1/2 translate-x-1/2 md:translate-x-0 md:right-0 mt-0 w-[280px] bg-white border border-gray-100 shadow-2xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 flex flex-col p-3 z-50">
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-3 pt-1">
                  Modul Bisnis & Analitik
                </div>

                <DropdownItem
                  href="/hpp-builder"
                  icon={ChefHat}
                  title="HPP & Recipe Builder"
                  desc="Bedah Modal Bahan Baku"
                  color="#FF6B00"
                />
                <DropdownItem
                  href="/bep"
                  icon={Target}
                  title="BEP Analyzer"
                  desc="Kalkulator Titik Impas"
                  color="#DD2C00"
                />
                <DropdownItem
                  href="/roi"
                  icon={Wallet}
                  title="ROI & Payback Period"
                  desc="Analisa Balik Modal"
                  color="#4CAF50"
                />
                <DropdownItem
                  href="/depreciation"
                  icon={Factory}
                  title="Asset Depreciation"
                  desc="Penyusutan Nilai Aset"
                  color="#8B5CF6"
                />
                <DropdownItem
                  href="/tax"
                  icon={Landmark}
                  title="Tax Auto-Splitter"
                  desc="PPN 12% & PPh Final"
                  color="#0EA5E9"
                />
                <DropdownItem
                  href="/invoice"
                  icon={FileText}
                  title="Smart Document"
                  desc="Generate PDF Invoice"
                  color="#00ACC1"
                />
              </div>
            </div>

            {/* 4. DROPDOWN: AKUN & DASHBOARD (JIKA LOGIN) */}
            {isAuthenticated && (
              <div className="relative group py-2">
                <button className="flex flex-col items-center text-gray-400 hover:text-[#FF6B00] transition-colors outline-none">
                  <UserCircle2
                    size={20}
                    className="group-hover:-translate-y-1 transition-transform"
                  />
                  <span className="text-[8px] font-bold tracking-[0.2em] mt-1 uppercase hidden md:flex items-center gap-0.5">
                    Akun{" "}
                    <ChevronDown
                      size={10}
                      className="group-hover:rotate-180 transition-transform duration-300"
                    />
                  </span>
                </button>

                <div className="absolute top-full right-1/2 translate-x-1/2 md:translate-x-0 md:right-0 mt-0 w-[220px] bg-white border border-gray-100 shadow-2xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 flex flex-col p-3 z-50">
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-3 pt-1">
                    Dashboard Personal
                  </div>
                  <DropdownItem
                    href="/trending"
                    icon={LayoutDashboard}
                    title="Trending Analytics"
                    desc="Statistik Simulasi"
                    color="#FFC400"
                  />
                  <DropdownItem
                    href="/history"
                    icon={History}
                    title="Riwayat Data"
                    desc="Arsip Kalkulasi"
                    color="#0A0A0A"
                  />
                  <DropdownItem
                    href="/settings"
                    icon={Settings}
                    title="Pengaturan Profil"
                    desc="Preferensi Engine"
                    color="#64748B"
                  />
                </div>
              </div>
            )}

            {/* 5. MENU TENTANG */}
            <Link
              href="/about"
              className={`flex flex-col items-center group ${pathname === "/about" ? "text-[#FF6B00]" : "text-gray-400 hover:text-[#FF6B00]"}`}
            >
              <Coffee
                size={20}
                className="group-hover:-translate-y-1 transition-transform"
              />
              <span
                className={`text-[8px] font-bold tracking-[0.2em] mt-1 ${pathname === "/about" ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity uppercase hidden md:block`}
              >
                Tentang
              </span>
            </Link>

            <div className="w-px h-6 bg-gray-200 mx-1 md:mx-2"></div>

            {/* 6. TOMBOL LOGOUT / LOGIN */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="text-gray-500 hover:text-red-500 font-bold text-[10px] uppercase tracking-widest px-4 md:px-5 py-2.5 rounded-full border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all active:scale-95"
              >
                LOGOUT
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-[#FFC400] to-[#DD2C00] text-white font-bold px-6 md:px-8 py-2.5 rounded-full shadow-lg hover:shadow-[#FF6B00]/30 transition-all uppercase text-[11px] tracking-[0.2em] active:scale-95"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

// --- KOMPONEN BANTUAN UNTUK ITEM DROPDOWN ---
interface DropdownItemProps {
  href: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
}
const DropdownItem = ({
  href,
  icon: Icon,
  title,
  desc,
  color,
}: DropdownItemProps) => (
  <Link
    href={href}
    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl group/item transition-colors"
  >
    <div
      className="p-2 rounded-lg transition-transform group-hover/item:scale-110"
      style={{ backgroundColor: `${color}15`, color: color }}
    >
      <Icon size={18} />
    </div>
    <div className="flex flex-col">
      <span className="font-bold text-sm text-gray-800 group-hover/item:text-[#0A0A0A]">
        {title}
      </span>
      <span className="text-[10px] text-gray-400 font-medium">{desc}</span>
    </div>
  </Link>
);
