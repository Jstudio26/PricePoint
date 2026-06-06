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
  Target, // Ikon baru untuk BEP Analyzer
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isMounted, setIsMounted] = useState(false);

  // Trik agar sinkronisasi state client-side aman
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    router.back();
  };

  // Navbar tidak muncul di halaman Login atau Welcome/Landing awal
  if (pathname === "/login" || pathname === "/welcome" || pathname === "/") {
    return null;
  }

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 p-4 lg:px-8 shadow-sm flex justify-between items-center sticky top-0 z-50 font-body transition-all duration-300">
      {/* ── FONT IMPORT ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="flex items-center gap-6">
        {/* --- TOMBOL KEMBALI --- */}
        {pathname !== "/" && pathname !== "/calculator" && pathname !== "/bep" && (
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

        {/* --- LOGO PRICEPOINT --- */}
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
              href={isAuthenticated ? "/calculator" : "/"}
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

      {/* --- MENU NAVIGASI KANAN --- */}
      <div className="flex gap-6 items-center">
        {!isMounted ? (
          <div className="w-24 h-10"></div>
        ) : (
          <div className="flex items-center gap-6">
            {/* PANDUAN HUKUM */}
            <Link
              href="/guide"
              className={`flex flex-col items-center group ${pathname === "/guide" ? "text-[#FF6B00]" : "text-gray-400 hover:text-[#FF6B00]"}`}
            >
              <BookOpen
                size={20}
                className="group-hover:-translate-y-1 transition-transform"
              />
              <span
                className={`text-[8px] font-bold tracking-[0.2em] mt-1 ${pathname === "/guide" ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity uppercase`}
              >
                Panduan
              </span>
            </Link>

            {/* SIMULATOR */}
            <Link
              href="/calculator"
              className={`flex flex-col items-center group ${pathname === "/calculator" ? "text-[#FF6B00]" : "text-gray-400 hover:text-[#FF6B00]"}`}
            >
              <Percent
                size={20}
                className="group-hover:-translate-y-1 transition-transform"
              />
              <span
                className={`text-[8px] font-bold tracking-[0.2em] mt-1 ${pathname === "/calculator" ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity uppercase`}
              >
                Simulator
              </span>
            </Link>

            {/* BEP ANALYZER (FITUR BARU) */}
            <Link
              href="/bep"
              className={`flex flex-col items-center group ${pathname === "/bep" ? "text-[#FF6B00]" : "text-gray-400 hover:text-[#FF6B00]"}`}
            >
              <Target
                size={20}
                className="group-hover:-translate-y-1 transition-transform"
              />
              <span
                className={`text-[8px] font-bold tracking-[0.2em] mt-1 ${pathname === "/bep" ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity uppercase`}
              >
                BEP Analisis
              </span>
            </Link>

            {/* MENU KHUSUS JIKA SUDAH LOGIN */}
            {isAuthenticated && (
              <>
                <Link
                  href="/trending"
                  className={`flex flex-col items-center group ${pathname === "/trending" ? "text-[#FF6B00]" : "text-gray-400 hover:text-[#FF6B00]"}`}
                >
                  <LayoutDashboard
                    size={20}
                    className="group-hover:-translate-y-1 transition-transform"
                  />
                  <span
                    className={`text-[8px] font-bold tracking-[0.2em] mt-1 ${pathname === "/trending" ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity uppercase`}
                  >
                    Trending
                  </span>
                </Link>

                <Link
                  href="/history"
                  className={`flex flex-col items-center group ${pathname === "/history" ? "text-[#FF6B00]" : "text-gray-400 hover:text-[#FF6B00]"}`}
                >
                  <History
                    size={20}
                    className="group-hover:-translate-y-1 transition-transform"
                  />
                  <span
                    className={`text-[8px] font-bold tracking-[0.2em] mt-1 ${pathname === "/history" ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity uppercase`}
                  >
                    Riwayat
                  </span>
                </Link>

                <Link
                  href="/settings"
                  className={`flex flex-col items-center group ${pathname === "/settings" ? "text-[#FF6B00]" : "text-gray-400 hover:text-[#FF6B00]"}`}
                >
                  <Settings
                    size={20}
                    className="group-hover:-translate-y-1 transition-transform"
                  />
                  <span
                    className={`text-[8px] font-bold tracking-[0.2em] mt-1 ${pathname === "/settings" ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity uppercase`}
                  >
                    Profil
                  </span>
                </Link>
              </>
            )}

            {/* TENTANG DEVELOPER */}
            <Link
              href="/about"
              className={`flex flex-col items-center group ${pathname === "/about" ? "text-[#FF6B00]" : "text-gray-400 hover:text-[#FF6B00]"}`}
            >
              <Coffee
                size={20}
                className="group-hover:-translate-y-1 transition-transform"
              />
              <span
                className={`text-[8px] font-bold tracking-[0.2em] mt-1 ${pathname === "/about" ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity uppercase`}
              >
                Tentang
              </span>
            </Link>

            <div className="w-px h-6 bg-gray-200 mx-2"></div>

            {/* TOMBOL LOGIN / LOGOUT */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="text-gray-500 hover:text-red-500 font-bold text-[10px] uppercase tracking-widest px-5 py-2.5 rounded-full border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all active:scale-95"
              >
                LOGOUT
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-[#FFC400] to-[#DD2C00] text-white font-bold px-8 py-2.5 rounded-full shadow-lg hover:shadow-[#FF6B00]/30 transition-all uppercase text-[11px] tracking-[0.2em] active:scale-95"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}