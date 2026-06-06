"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Target,
  Package,
  Zap,
  TrendingUp,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface FeatureCardProps {
  icon: React.ElementType;
  tag: string;
  title: string;
  desc: string;
  accent: string;
}

interface StatProps {
  value: string;
  label: string;
}

// ─── COUNTER HOOK ─────────────────────────────────────────────────────────────
function useCountUp(end: number, duration = 1800, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, end, duration]);
  return count;
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────
const FeatureCard = ({
  icon: Icon,
  tag,
  title,
  desc,
  accent,
}: FeatureCardProps) => (
  <div className="group relative p-8 rounded-3xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/10 transition-all duration-500 overflow-hidden">
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
      style={{
        background: `radial-gradient(circle at 0% 100%, ${accent}18 0%, transparent 60%)`,
      }}
    />
    <span
      className="inline-block text-[10px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full mb-6"
      style={{ color: accent, background: `${accent}18` }}
    >
      {tag}
    </span>
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border"
      style={{
        color: accent,
        borderColor: `${accent}40`,
        background: `${accent}12`,
      }}
    >
      <Icon size={26} />
    </div>
    <h3 className="text-xl font-black text-white mb-3 tracking-tight">
      {title}
    </h3>
    <p className="text-sm text-white/40 leading-relaxed font-medium">{desc}</p>
  </div>
);

const Stat = ({ value, label }: StatProps) => (
  <div className="text-center">
    <p className="text-4xl md:text-5xl font-black text-white tracking-tighter">
      {value}
    </p>
    <p className="text-xs text-white/30 font-black uppercase tracking-[0.2em] mt-2">
      {label}
    </p>
  </div>
);

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const count1 = useCountUp(99, 1600, statsVisible);
  const count2 = useCountUp(3, 1200, statsVisible);
  const count3 = useCountUp(10000, 2000, statsVisible);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.4 },
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      {/* FONT IMPORT */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        @keyframes drift {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-20px) rotate(3deg); opacity: 1; }
        }
        @keyframes ember {
          0% { transform: translateY(0) scale(1); opacity: 0.9; }
          100% { transform: translateY(-120px) scale(0); opacity: 0; }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-drift { animation: drift 6s ease-in-out infinite; }
        .animate-drift-slow { animation: drift 9s ease-in-out infinite reverse; }
        .animate-glow { animation: glow-pulse 3s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.8s ease-out both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.25s; }
        .delay-3 { animation-delay: 0.45s; }
        .delay-4 { animation-delay: 0.65s; }
        .delay-5 { animation-delay: 0.85s; }
      `}</style>

      {/* ── BACKGROUND MESH ─────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-[#FF6B00]/10 blur-[140px] animate-glow" />
        <div
          className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#DD2C00]/8 blur-[120px] animate-glow"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute bottom-[10%] left-[30%] w-[500px] h-[500px] rounded-full bg-[#FFC400]/5 blur-[160px] animate-glow"
          style={{ animationDelay: "3s" }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,145,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,145,0,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-32 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="animate-slide-up delay-1 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FF9100]/20 bg-[#FF9100]/8 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF9100] shadow-sm shadow-orange-400 animate-pulse" />
          <span className="font-body text-xs font-bold text-[#FF9100] uppercase tracking-[0.2em]">
            Smart Pricing · Rumus Inverse Margin
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-slide-up delay-2 font-display text-[clamp(5rem,14vw,12rem)] leading-[0.88] tracking-wide text-white mb-8">
          HARGA YANG
          <br />
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "2px rgba(255,145,0,0.4)" }}
          >
            TEPAT
          </span>{" "}
          <span
            className="relative inline-block"
            style={{
              background: "linear-gradient(90deg, #FFC400, #FF9100, #DD2C00)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            TERBAKAR
          </span>
        </h1>

        {/* Subheadline */}
        <p className="animate-slide-up delay-3 font-body text-lg md:text-xl text-white/40 max-w-xl mb-14 leading-relaxed font-medium">
          Kalkulasi harga jual yang optimal dari HPP dan OPEX dalam hitungan
          detik. Tidak ada lagi tebak-tebakan — hanya profit yang pasti.
        </p>

        {/* CTA GROUP */}
        <div className="animate-slide-up delay-4 flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/calculator"
            className="group font-body font-bold text-base px-8 py-4 rounded-2xl text-white flex items-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/30"
            style={{
              background:
                "linear-gradient(135deg, #FFC400 0%, #FF6B00 50%, #DD2C00 100%)",
            }}
          >
            Coba Kalkulator Sekarang
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <Link
            href="#features"
            className="font-body font-medium text-sm text-white/40 hover:text-white/70 flex items-center gap-2 transition-colors"
          >
            Lihat semua fitur ↓
          </Link>
        </div>

        {/* FLOATING DEVICE MOCKUP */}
        <div className="animate-slide-up delay-5 relative mt-24 w-full max-w-4xl">
          {/* Glow behind mockup */}
          <div className="absolute inset-x-[15%] top-[10%] h-[60%] bg-gradient-to-b from-[#FF6B00]/20 to-transparent blur-[80px] pointer-events-none" />

          <div className="relative rounded-[2rem] border border-white/8 bg-white/[0.03] backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/60 animate-drift-slow">
            {/* Mockup top bar */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-[#DD2C00]/60" />
              <div className="w-3 h-3 rounded-full bg-[#FFC400]/60" />
              <div className="w-3 h-3 rounded-full bg-white/20" />
              <div className="flex-1 mx-4 h-6 rounded-lg bg-white/5 flex items-center px-3">
                <span className="font-body text-[10px] text-white/20">
                  pricepoint.app/calculator
                </span>
              </div>
            </div>

            {/* Mockup body */}
            <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: input panel */}
              <div className="space-y-4">
                <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 mb-6">
                  Input Biaya
                </p>
                {[
                  { label: "HPP (Harga Pokok Produksi)", value: "Rp 150.000" },
                  { label: "OPEX per unit", value: "Rp 25.000" },
                  { label: "Target Profit Margin", value: "30%" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-white/[0.04] border border-white/5 px-4 py-3.5"
                  >
                    <p className="font-body text-[10px] text-white/25 mb-1">
                      {item.label}
                    </p>
                    <p className="font-body text-sm font-bold text-white/80">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Right: result panel */}
              <div
                className="rounded-2xl p-6 flex flex-col justify-center items-center text-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,193,0,0.08), rgba(221,44,0,0.08))",
                  border: "1px solid rgba(255,145,0,0.15)",
                }}
              >
                <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF9100]/60 mb-4">
                  Harga Jual Optimal
                </p>
                <p className="font-display text-5xl md:text-6xl tracking-wide text-white mb-2">
                  250.000
                </p>
                <p className="font-body text-xs text-white/30 mb-6">
                  Rupiah / unit
                </p>
                <div className="w-full h-px bg-white/5 mb-6" />
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="text-center">
                    <p className="font-body text-[10px] text-white/25 mb-1">
                      Profit Aktual
                    </p>
                    <p className="font-body text-sm font-bold text-[#4CAF50]">
                      +Rp 75.000
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="font-body text-[10px] text-white/25 mb-1">
                      Margin Bersih
                    </p>
                    <p className="font-body text-sm font-bold text-[#FF9100]">
                      30.0%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── STATS STRIP ─────────────────────────────────────────── */}
      <div
        ref={statsRef}
        className="relative z-10 border-y border-white/5 bg-white/[0.02]"
      >
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-3 gap-8">
          <Stat value={`${count1}%`} label="Akurasi Kalkulasi" />
          <Stat value={`<${count2}dtk`} label="Waktu Simulasi" />
          <Stat
            value={`${count3.toLocaleString()}+`}
            label="Simulasi Tersimpan"
          />
        </div>
      </div>

      {/* ── FEATURES ────────────────────────────────────────────── */}
      <section
        id="features"
        className="relative z-10 max-w-7xl mx-auto px-6 py-32"
      >
        <div className="text-center mb-20">
          <p className="font-body text-xs font-bold text-[#FF9100] uppercase tracking-[0.3em] mb-4">
            Kenapa PricePoint?
          </p>
          <h2 className="font-display text-6xl md:text-8xl text-white tracking-wide">
            FITUR UTAMA
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FeatureCard
            icon={Zap}
            tag="Real-time"
            title="Instant Calculation"
            desc="Harga jual dihitung ulang otomatis setiap kamu mengubah HPP atau OPEX — tanpa loading, tanpa delay."
            accent="#FFC400"
          />
          <FeatureCard
            icon={Target}
            tag="Formula Eksklusif"
            title="Inverse Margin"
            desc="Metode kalkulasi terbalik dari target profit — bukan dari markup, tapi dari profit murni yang kamu mau."
            accent="#FF9100"
          />
          <FeatureCard
            icon={Package}
            tag="Cloud"
            title="Arsip MongoDB Atlas"
            desc="Setiap simulasi tersimpan aman di cloud. Akses riwayat kapan saja, dari perangkat mana saja."
            accent="#DD2C00"
          />
          <FeatureCard
            icon={BarChart3}
            tag="Analitik"
            title="Breakdown Visual"
            desc="Lihat distribusi biaya dan profit dalam grafik yang jelas — bukan sekadar angka di tabel."
            accent="#FF6B00"
          />
          <FeatureCard
            icon={ShieldCheck}
            tag="Aman"
            title="Akun Terproteksi"
            desc="Data simulasimu hanya kamu yang bisa akses. Autentikasi aman dengan JWT dan enkripsi penuh."
            accent="#FFC400"
          />
          <FeatureCard
            icon={TrendingUp}
            tag="Skenario"
            title="Multi-Simulasi"
            desc="Bandingkan beberapa skenario harga sekaligus dan temukan strategi pricing yang paling optimal."
            accent="#FF9100"
          />
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section
        id="how"
        className="relative z-10 border-t border-white/5 bg-white/[0.015] py-32 px-6"
      >
        <div className="max-w-4xl mx-auto text-center mb-20">
          <p className="font-body text-xs font-bold text-[#FF9100] uppercase tracking-[0.3em] mb-4">
            Mudah Dipakai
          </p>
          <h2 className="font-display text-6xl md:text-8xl text-white tracking-wide">
            CARA KERJA
          </h2>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-[calc(33%+1.5rem)] right-[calc(33%+1.5rem)] h-px bg-gradient-to-r from-[#FF9100]/40 via-[#FFC400]/60 to-[#FF9100]/40" />

          {[
            {
              step: "01",
              title: "Masukkan Biaya",
              desc: "Input HPP, OPEX, dan target margin profit yang kamu inginkan.",
              color: "#FFC400",
            },
            {
              step: "02",
              title: "Simulasi Instan",
              desc: "Rumus Inverse Margin bekerja real-time untuk menghitung harga jual optimal.",
              color: "#FF9100",
            },
            {
              step: "03",
              title: "Simpan & Analisis",
              desc: "Arsipkan hasilnya ke cloud dan bandingkan dengan simulasi lain.",
              color: "#DD2C00",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 font-display text-3xl tracking-wider"
                style={{
                  color: item.color,
                  background: `${item.color}15`,
                  border: `1px solid ${item.color}30`,
                }}
              >
                {item.step}
              </div>
              <h3 className="font-body font-bold text-lg text-white mb-3">
                {item.title}
              </h3>
              <p className="font-body text-sm text-white/35 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────── */}
      <section className="relative z-10 py-32 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-x-[20%] inset-y-0 bg-gradient-radial from-[#FF6B00]/15 via-transparent to-transparent blur-[80px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="font-display text-7xl md:text-9xl text-white tracking-wide mb-8 leading-none">
            SIAP{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #FFC400, #DD2C00)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              TERBAKAR?
            </span>
          </h2>
          <p className="font-body text-lg text-white/35 mb-12 max-w-md mx-auto">
            Mulai simulasi pertamamu gratis. Tidak perlu kartu kredit.
          </p>
          <Link
            href="/calculator"
            className="group inline-flex items-center gap-3 font-body font-bold text-lg px-10 py-5 rounded-2xl text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/40"
            style={{
              background:
                "linear-gradient(135deg, #FFC400 0%, #FF6B00 50%, #DD2C00 100%)",
            }}
          >
            Coba Kalkulator Sekarang
            <ArrowRight
              size={22}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/5 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FFC400] to-[#DD2C00] flex items-center justify-center">
              <span className="font-display text-white text-sm leading-none">
                P
              </span>
            </div>
            <span className="font-display tracking-widest text-white/60 text-sm">
              PRICEPOINT
            </span>
          </div>
          <p className="font-body text-[11px] text-white/20 uppercase tracking-[0.2em]">
            Jeremia Paduli © {new Date().getFullYear()} UNSRAT Informatika
          </p>
          <div className="flex gap-6">
            <Link
              href="/login"
              className="font-body text-xs text-white/25 hover:text-white/50 transition-colors uppercase tracking-wider"
            >
              Login
            </Link>
            <Link
              href="/calculator"
              className="font-body text-xs text-white/25 hover:text-white/50 transition-colors uppercase tracking-wider"
            >
              Kalkulator
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
