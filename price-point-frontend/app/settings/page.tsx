"use client";

import React, { useState } from "react";
import {
  User,
  Lock,
  Percent,
  Save,
  Target,
  ArrowLeft,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

interface SaveButtonProps {
  label: string;
  onClick: () => void;
}

export default function SettingsPage() {
  const { isInitialized } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // State Dinamis (lazy init dari localStorage)
  const [userEmail] = useState(() => {
    if (typeof window === "undefined") return "admin@pricepoint.cloud";
    return localStorage.getItem("user_email") || "admin@pricepoint.cloud";
  });

  const [userName, setUserName] = useState(() => {
    if (typeof window === "undefined") return "User PricePoint";
    const email =
      localStorage.getItem("user_email") || "admin@pricepoint.cloud";
    const nameFromEmail = email.split("@")[0].replace(/[^a-zA-Z]/g, " ");
    return nameFromEmail || "User";
  });

  const [defaultMargin, setDefaultMargin] = useState(() => {
    if (typeof window === "undefined") return 25;
    const savedMargin = localStorage.getItem("pricepoint_default_margin");
    return savedMargin ? Number(savedMargin) : 25;
  });

  const handleSaveMargin = () => {
    if (defaultMargin < 0 || defaultMargin > 100) {
      return toast.error("Margin harus antara 0 - 100%");
    }
    // Simpan ke local storage agar bisa dibaca oleh halaman Kalkulator
    localStorage.setItem("pricepoint_default_margin", defaultMargin.toString());
    toast.success("Preferensi Margin Berhasil Disimpan!");
  };

  const tabs = [
    { id: "profile", label: "Profil Akun", icon: User },
    { id: "business", label: "Preferensi Bisnis", icon: Target },
    { id: "security", label: "Keamanan", icon: Shield },
  ];

  if (!isInitialized) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20 text-[#0A0A0A] font-body overflow-x-hidden">
      <Toaster position="top-center" />
      {/* ── FONT IMPORT ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* HEADER HERO (SaaS Dark Mode Style) */}
      <header className="bg-[#0A0A0A] relative overflow-hidden pt-28 pb-40 px-6">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#FFC400]/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-[#DD2C00]/20 rounded-full blur-[100px]"></div>
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,145,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,145,0,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 text-white/50 hover:text-[#FFC400] font-body font-bold text-[10px] uppercase tracking-[0.2em] bg-white/5 px-6 py-3 rounded-full border border-white/10 hover:border-[#FFC400]/30 active:scale-95 transition-all mb-12 backdrop-blur-md group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Kembali ke Simulator
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
            {/* Avatar Frame Glowing */}
            <div className="w-32 h-32 rounded-[2rem] p-1 bg-gradient-to-br from-[#FFC400] via-[#FF6B00] to-[#DD2C00] shadow-2xl shadow-orange-500/20 flex-shrink-0 group hover:scale-105 transition-transform duration-500 cursor-pointer">
              <div className="w-full h-full bg-[#FAFAFA] rounded-[1.8rem] overflow-hidden flex items-center justify-center">
                {/* Auto Avatar generator berdasarkan nama user */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.dicebear.com/8.x/initials/svg?seed=${userName}&backgroundColor=FAFAFA&textColor=0A0A0A`}
                  alt="Avatar"
                  className="w-full h-full object-cover p-1 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="mt-2">
              <h1 className="font-display text-5xl md:text-6xl tracking-wide text-white leading-none mb-3 uppercase">
                {userName.split(" ")[0]} <br className="hidden md:block" />
                <span
                  style={{
                    background: "linear-gradient(90deg, #FFC400, #DD2C00)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {userName.split(" ").slice(1).join(" ") || "ADMIN"}
                </span>
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="font-body text-white/80 font-bold text-[10px] uppercase tracking-[0.2em] bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
                  Verified Account
                </span>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4CAF50] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4CAF50]"></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 -mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-20">
        {/* SIDEBAR TABS */}
        <aside className="lg:col-span-4 space-y-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 p-5 rounded-[1.5rem] font-body font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-white text-[#0A0A0A] shadow-xl shadow-black/[0.02] border border-gray-100 translate-x-2"
                  : "bg-transparent text-gray-500 hover:bg-white/50 hover:text-[#FF6B00] border border-transparent"
              }`}
            >
              <div
                className={`p-3 rounded-xl transition-colors ${activeTab === tab.id ? "bg-gradient-to-br from-[#FFC400] to-[#FF6B00] text-white shadow-md shadow-orange-500/20" : "bg-gray-100 text-gray-400"}`}
              >
                <tab.icon size={20} />
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em]">
                {tab.label}
              </span>
            </button>
          ))}
        </aside>

        {/* CONTENT AREA */}
        <section className="lg:col-span-8 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-black/[0.02] border border-gray-100 min-h-[450px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B00]/5 rounded-full blur-[80px] pointer-events-none"></div>

          {activeTab === "profile" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-[#FF6B00]/10 text-[#FF6B00] rounded-[1rem]">
                  <User size={24} />
                </div>
                <h3 className="font-display text-4xl tracking-wider text-[#0A0A0A]">
                  Informasi Dasar
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#FAFAFA] p-5 rounded-2xl border border-gray-100 focus-within:border-[#FF6B00]/50 focus-within:bg-white transition-all group">
                  <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2">
                    Nama / Identitas
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full text-lg font-bold outline-none bg-transparent text-[#0A0A0A] uppercase"
                  />
                </div>

                <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 opacity-80 cursor-not-allowed">
                  <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2 flex items-center justify-between">
                    Email Akun <Lock size={12} className="text-gray-300" />
                  </label>
                  <p className="text-sm font-bold text-gray-500 truncate">
                    {userEmail}
                  </p>
                </div>
              </div>
              <SaveButton
                label="Update Profil"
                onClick={() => toast.success("Profil berhasil diupdate!")}
              />
            </div>
          )}

          {activeTab === "business" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-[#FFC400]/10 text-[#FFC400] rounded-[1rem]">
                  <Target size={24} />
                </div>
                <h3 className="font-display text-4xl tracking-wider text-[#0A0A0A]">
                  Konfigurasi Engine
                </h3>
              </div>

              <p className="font-body text-gray-500 text-sm leading-relaxed mb-8 max-w-lg">
                Atur persentase margin default Anda. Angka ini akan tersimpan di
                perangkat ini dan otomatis digunakan sebagai baseline pada
                Kalkulator PricePoint.
              </p>

              <div className="flex items-center gap-6 bg-[#FAFAFA] p-6 rounded-[2rem] border border-gray-100 max-w-sm focus-within:border-[#FF6B00]/50 focus-within:bg-white transition-all hover:shadow-lg hover:shadow-[#FF6B00]/5">
                <div className="w-16 h-16 bg-white rounded-2xl text-[#FF6B00] shadow-sm flex items-center justify-center border border-gray-50">
                  <Percent size={28} />
                </div>
                <div className="w-full">
                  <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-1">
                    Target Margin (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    className="w-full bg-transparent text-4xl font-display tracking-wider outline-none text-[#0A0A0A]"
                    value={defaultMargin}
                    onChange={(e) => setDefaultMargin(Number(e.target.value))}
                  />
                </div>
              </div>
              <SaveButton
                label="Simpan Preferensi"
                onClick={handleSaveMargin}
              />
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-16 relative z-10">
              <div className="w-24 h-24 bg-[#FAFAFA] rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-300 border border-gray-100 shadow-inner">
                <Lock size={40} />
              </div>
              <h3 className="font-display text-4xl tracking-wider text-[#0A0A0A]">
                Keamanan Akun
              </h3>
              <p className="font-body text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
                Anda login menggunakan JWT Token yang terenkripsi. Untuk
                mengganti kata sandi, hubungi administrator database.
              </p>
              <button
                disabled
                className="mt-4 bg-gray-50 text-gray-400 px-8 py-3.5 rounded-2xl font-body font-bold text-[10px] uppercase tracking-[0.2em] border border-gray-100 cursor-not-allowed"
              >
                Secured via Atlas
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const SaveButton = ({ label, onClick }: SaveButtonProps) => (
  <button
    onClick={onClick}
    className="group flex items-center gap-3 bg-gradient-to-r from-[#FFC400] to-[#FF6B00] text-white px-8 py-4 rounded-2xl font-body font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:scale-95 transition-all text-[11px] uppercase tracking-[0.2em] mt-10"
  >
    <Save size={16} className="group-hover:rotate-12 transition-transform" />{" "}
    {label}
  </button>
);
