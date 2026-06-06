"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Code2,
  Coffee,
  Target,
  Globe,
  Sparkles,
  Linkedin,
  Github,
  Instagram,
} from "lucide-react";

// --- SUB-COMPONENTS ---
const InfoBadge = ({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) => (
  <div className="flex items-center gap-4 bg-gray-50/80 px-5 py-4 rounded-2xl border border-gray-100 w-full hover:bg-white hover:border-[#FF6B00]/30 hover:shadow-lg hover:shadow-[#FF6B00]/5 transition-all duration-300 group">
    <div className="bg-[#FF6B00]/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
      <Icon className="text-[#FF6B00]" size={18} />
    </div>
    <span className="font-body text-[11px] font-bold text-gray-600 uppercase tracking-widest">
      {text}
    </span>
  </div>
);

const TechCard = ({
  logoUrl,
  title,
  desc,
  color,
  isVercel,
}: {
  logoUrl: string;
  title: string;
  desc: string;
  color: string;
  isVercel?: boolean;
}) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-black/[0.02] border border-gray-100 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#FF6B00]/10 transition-all duration-500 group">
    <div
      className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center p-3 mb-6 shadow-md group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt={`${title} Logo`}
        className={`w-full h-full object-contain ${isVercel ? "invert group-hover:invert-0" : ""} transition-all duration-300`}
      />
    </div>
    <h4 className="font-display text-3xl tracking-wider text-gray-900 mb-3">
      {title}
    </h4>
    <p className="font-body text-sm text-gray-500 font-medium leading-relaxed">
      {desc}
    </p>
  </div>
);

const SocialIcon = ({
  icon: Icon,
  label,
  href,
  activeColor,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  activeColor: string;
}) => (
  <li className="relative group">
    <div
      className={`absolute -top-12 left-1/2 -translate-x-1/2 ${activeColor} text-white font-body text-[9px] font-bold px-3 py-1.5 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:-top-14 transition-all duration-300 shadow-xl z-30 uppercase tracking-[0.2em] whitespace-nowrap`}
    >
      {label}
      <div
        className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 ${activeColor} rotate-45`}
      ></div>
    </div>

    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative overflow-hidden flex items-center justify-center w-14 h-14 bg-white border border-gray-200 rounded-2xl text-gray-400 hover:text-white transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        className={`absolute bottom-0 left-0 w-full h-0 ${activeColor} transition-all duration-300 group-hover:h-full z-0`}
      ></div>
      <Icon size={24} className="relative z-10" />
    </a>
  </li>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A] pb-32 font-body overflow-x-hidden">
      {/* ── FONT IMPORT ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* HERO SECTION (Dark Mode SaaS Style) */}
      <div className="bg-[#0A0A0A] relative overflow-hidden pt-28 pb-64 px-6">
        {/* Background Mesh */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[10%] w-[500px] h-[500px] bg-[#FF6B00]/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#FFC400]/10 rounded-full blur-[100px]"></div>
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

        <div className="max-w-7xl mx-auto relative z-10">
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 text-white/50 hover:text-[#FFC400] font-body font-bold text-[10px] uppercase tracking-[0.2em] bg-white/5 px-6 py-3 rounded-full border border-white/10 hover:border-[#FFC400]/30 active:scale-95 transition-all mb-16 backdrop-blur-md group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Kembali ke Simulator
          </Link>

          <div className="max-w-4xl">
            <h1 className="font-display text-[clamp(4rem,10vw,8rem)] text-white tracking-wide leading-[0.85] mb-6">
              THE MISSION <br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}
              >
                OF
              </span>{" "}
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #FFC400, #FF6B00, #DD2C00)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                PRICEPOINT
              </span>
            </h1>
            <p className="font-body text-white/50 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
              Membantu UMKM dan Mahasiswa membedah struktur harga dengan presisi
              matematika, bukan sekadar tebakan.
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 -mt-40 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: PROFILE CARD */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-black/5 border border-gray-100 p-10 sticky top-28 flex flex-col items-center text-center">
              <div className="w-48 h-48 rounded-[2.5rem] rotate-3 hover:rotate-0 transition-all duration-500 border-8 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-[#FFC400] via-[#FF6B00] to-[#DD2C00] p-1 mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://api.dicebear.com/8.x/avataaars/svg?seed=Jeremia"
                  alt="Jeremia Paduli"
                  className="w-full h-full object-cover rounded-[2rem] bg-[#FAFAFA]"
                />
              </div>

              <h3 className="font-display text-4xl tracking-wider text-[#0A0A0A]">
                Jeremia Paduli
              </h3>
              <div className="inline-flex items-center gap-2 mt-2 mb-8 bg-[#FF6B00]/10 px-4 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse"></span>
                <p className="font-body text-[#FF6B00] font-bold text-[10px] uppercase tracking-[0.2em]">
                  Full-Stack Developer
                </p>
              </div>

              <div className="w-full space-y-3 mb-10 text-left">
                <InfoBadge icon={Code2} text="Informatics Engineering" />
                <InfoBadge icon={Target} text="Sam Ratulangi University" />
                <InfoBadge icon={Globe} text="Manado, Indonesia" />
              </div>

              {/* SOCIAL LIST */}
              <div className="w-full pt-8 border-t border-gray-100">
                <p className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">
                  Connect With Me
                </p>
                <ul className="flex justify-center gap-4">
                  <SocialIcon
                    icon={Linkedin}
                    label="LinkedIn"
                    href="https://www.linkedin.com/in/jeremia-david-anthony-paduli-523608383"
                    activeColor="bg-[#0A66C2]"
                  />
                  <SocialIcon
                    icon={Github}
                    label="GitHub"
                    href="https://github.com/Jejexjejew020724"
                    activeColor="bg-[#24292F]"
                  />
                  <SocialIcon
                    icon={Instagram}
                    label="Instagram"
                    href="https://www.instagram.com/jepaduli_"
                    activeColor="bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]"
                  />
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT: STORY & TECH */}
          <div className="lg:col-span-8 space-y-10">
            {/* Story Card */}
            <div className="bg-white rounded-[3rem] shadow-xl shadow-black/[0.02] border border-gray-100 p-10 md:p-14">
              <h2 className="font-display text-5xl md:text-6xl text-[#0A0A0A] tracking-wide mb-10 flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FFC400] to-[#FF6B00] text-white rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Sparkles size={28} />
                </div>
                The &quot;Gabut&quot; Story
              </h2>
              <div className="font-body text-gray-500 text-lg leading-relaxed space-y-6">
                <p>
                  Sebagai mahasiswa Teknik Informatika semester 6 di UNSRAT,
                  hari-hari saya biasanya dipenuhi dengan praktikum basis data
                  dan riset teknologi. Namun,{" "}
                  <strong className="text-gray-900">PricePoint</strong> lahir
                  dari momen unik: kebosanan yang produktif.
                </p>
                <p>
                  Saya menyadari banyak rekan mahasiswa dan pemilik UMKM sering
                  bingung menentukan harga jual. Mereka seringkali hanya
                  menambah sedikit dari harga beli, tanpa menyadari biaya
                  operasional dan pajak bisa membakar keuntungan mereka.
                </p>

                <div className="relative my-12">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#FFC400] to-[#DD2C00] rounded-full"></div>
                  <blockquote className="pl-10 py-2 italic font-body font-bold text-[#0A0A0A] text-2xl md:text-3xl tracking-tight leading-snug">
                    &quot;Kenapa tidak membuat kalkulator yang
                    &apos;pintar&apos; sekalian? Yang menggunakan logika
                    akuntansi asli tapi punya tampilan seperti{" "}
                    <span className="text-[#FF6B00]">dashboard modern</span>
                    .&quot;
                  </blockquote>
                </div>

                <p>
                  Dengan semangat itu, saya meracik formula{" "}
                  <strong className="text-gray-900">Inverse Margin</strong> ke
                  dalam kode. Tujuannya satu: memastikan setiap produk yang
                  dijual memberikan profit murni yang diinginkan pemiliknya
                  secara instan dan akurat.
                </p>
              </div>
            </div>

            {/* Tech Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TechCard
                logoUrl="https://cdn.worldvectorlogo.com/logos/next-js.svg"
                title="Next.js 14"
                desc="Framework React untuk performa rendering super cepat dan arsitektur modern."
                color="bg-white border border-gray-100"
              />
              <TechCard
                logoUrl="https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg"
                title="MongoDB Atlas"
                desc="Cloud database NoSQL untuk menyimpan ribuan simulasi dengan aman dan skalabel."
                color="bg-[#F8F9FA]"
              />
              <TechCard
                logoUrl="https://cdn.worldvectorlogo.com/logos/golang-1.svg"
                title="Golang Engine"
                desc="Backend bahasa Go yang menangani kalkulasi matematis dengan presisi tinggi."
                color="bg-[#F8F9FA]"
              />
              <TechCard
                logoUrl="https://cdn.worldvectorlogo.com/logos/vercel.svg"
                title="Vercel Edge"
                desc="Deployment global di jaringan Edge untuk akses aplikasi tanpa lag."
                color="bg-[#0A0A0A]"
                isVercel
              />
            </div>

            {/* Branding Quote */}
            <div className="bg-[#0A0A0A] rounded-[3rem] p-16 text-center shadow-2xl relative overflow-hidden group">
              {/* Animated Gradients inside the quote box */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B00]/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#DD2C00]/20 rounded-full blur-[80px]"></div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]">
                <Coffee size={250} className="text-white" />
              </div>

              <h4 className="font-display text-white text-5xl md:text-6xl tracking-wide relative z-10 leading-[0.9]">
                KEGABUTAN YANG <br /> DIARAHKAN DENGAN BENAR <br /> AKAN
                MENGHASILKAN SESUATU YANG <br />
                <span
                  className="text-transparent mt-4 block"
                  style={{
                    background: "linear-gradient(90deg, #FFC400, #DD2C00)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  GANTENG MAKSIMAL.
                </span>
              </h4>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
