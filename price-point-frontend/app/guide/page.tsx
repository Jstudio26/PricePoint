"use client";

import React from "react";
import Link from "next/link";
import {
  Scale,
  BookOpen,
  FileText,
  ShieldCheck,
  ArrowLeft,
  ExternalLink,
  AlertCircle,
  Percent,
  ChefHat,
  Target,
  Wallet,
  Factory,
  Landmark,
  Calculator,
} from "lucide-react";

// --- DATA DOKUMENTASI FITUR & RUMUS ---
const engineDocs = [
  {
    id: "inverse-margin",
    title: "Inverse Margin Calculator",
    icon: Percent,
    color: "from-[#FFC400] to-[#FF6B00]",
    textColor: "text-[#FF6B00]",
    desc: "Engine utama PricePoint. Berbeda dengan Markup biasa, Inverse Margin menjamin bahwa persentase profit yang Anda targetkan tidak akan tergerus oleh pembagi harga jual.",
    formula: "Harga Jual = HPP ÷ (1 - % Target Margin)",
    example:
      "HPP Rp 10.000, Target Margin 20%. Harga Jual = 10.000 / (1 - 0.2) = Rp 12.500.",
  },
  {
    id: "hpp-builder",
    title: "HPP & Recipe Builder",
    icon: ChefHat,
    color: "from-[#FF6B00] to-[#DD2C00]",
    textColor: "text-[#DD2C00]",
    desc: "Membedah struktur modal (BOM/Bill of Materials) dari takaran bahan baku skala besar menjadi Harga Pokok Produksi per porsi/unit secara presisi.",
    formula: "Total HPP = Σ [ (Harga Beli ÷ Qty Beli) × Qty Dipakai ]",
    example:
      "Susu 1000ml Rp 20.000. Dipakai 150ml. Biaya = (20.000 / 1000) * 150 = Rp 3.000.",
  },
  {
    id: "bep-analyzer",
    title: "Break-Even Point (BEP)",
    icon: Target,
    color: "from-[#DD2C00] to-[#8E0000]",
    textColor: "text-[#DD2C00]",
    desc: "Kalkulator titik impas untuk mengetahui volume penjualan minimal yang wajib dicapai perusahaan agar tidak mengalami kerugian operasional.",
    formula: "BEP Unit = Biaya Tetap ÷ (Harga Jual - Biaya Variabel)",
    example:
      "Gaji 5Jt. Jual 25rb, HPP 15rb. BEP = 5.000.000 / (25.000 - 15.000) = 500 Unit.",
  },
  {
    id: "roi-tracker",
    title: "ROI & Payback Period",
    icon: Wallet,
    color: "from-[#4CAF50] to-[#8BC34A]",
    textColor: "text-[#4CAF50]",
    desc: "Proyeksi kelayakan investasi. Menghitung durasi waktu yang dibutuhkan agar total pengeluaran modal (CAPEX) kembali 100% dari profit bulanan.",
    formula:
      "Payback Period = Total Modal Awal (CAPEX) ÷ Target Profit Bulanan",
    example:
      "Modal 50 Juta. Profit 5 Juta/bln. Payback = 50Jt / 5Jt = 10 Bulan.",
  },
  {
    id: "depreciation",
    title: "Asset Depreciation",
    icon: Factory,
    color: "from-[#8B5CF6] to-[#D946EF]",
    textColor: "text-[#8B5CF6]",
    desc: "Menghitung penyusutan nilai aset menggunakan metode Garis Lurus (Straight-Line) untuk dimasukkan ke dalam beban OPEX bulanan.",
    formula:
      "Penyusutan Tahunan = (Harga Beli Aset - Nilai Residu) ÷ Umur Ekonomis",
    example:
      "Mesin 45Jt, Sisa 5Jt, Umur 5th. Susut = (45Jt - 5Jt) / 5 = 8 Juta/tahun.",
  },
  {
    id: "tax-splitter",
    title: "Tax Auto-Splitter",
    icon: Landmark,
    color: "from-[#0EA5E9] to-[#14B8A6]",
    textColor: "text-[#0EA5E9]",
    desc: "Reverse-engineering harga jual untuk mencari Dasar Pengenaan Pajak (DPP) murni demi memisahkan hak pendapatan UMKM dengan titipan PPN 12% negara.",
    formula: "Dasar Pengenaan Pajak (DPP) = Harga Final (Include Tax) ÷ 1.12",
    example:
      "Harga Final 56.000. DPP = 56.000 / 1.12 = Rp 50.000. PPN-nya Rp 6.000.",
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A] pb-20 font-body overflow-x-hidden">
      {/* ── FONT IMPORT ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* HEADER HERO */}
      <header className="bg-[#0A0A0A] relative overflow-hidden pt-28 pb-40 px-6">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#DD2C00]/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-[#FFC400]/10 rounded-full blur-[100px]"></div>
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,145,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,145,0,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
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

          <h1 className="font-display text-6xl md:text-8xl text-white tracking-wide leading-none mb-6 flex flex-col items-center justify-center">
            <BookOpen className="text-[#FFC400] mb-4" size={56} />
            DOCUMENTATION & <br />
            <span
              style={{
                background: "linear-gradient(90deg, #FFC400, #FF6B00, #DD2C00)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              GUIDE
            </span>
          </h1>
          <p className="font-body text-white/50 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Panduan teknis algoritma PricePoint, referensi rumus akuntansi,
            serta kepatuhan hukum untuk penentuan harga retail Indonesia 2026.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 -mt-20 relative z-20">
        {/* BAGIAN 1: DOKUMENTASI ENGINE & RUMUS */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-black/[0.02] border border-gray-100 p-8 md:p-12 mb-8">
          <div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-6">
            <div className="p-3 bg-gray-50 text-gray-400 rounded-2xl">
              <Calculator size={28} />
            </div>
            <div>
              <h2 className="font-display text-4xl text-[#0A0A0A] tracking-wider">
                Dokumentasi Engine & Rumus
              </h2>
              <p className="font-body text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                Mathematical Reference
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {engineDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-6 bg-[#FAFAFA] border border-gray-100 rounded-[2rem] hover:shadow-lg hover:border-gray-200 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`p-3 bg-gradient-to-br ${doc.color} text-white rounded-[1rem] shadow-sm group-hover:scale-110 transition-transform`}
                  >
                    <doc.icon size={20} />
                  </div>
                  <h3 className="font-body font-bold text-lg text-gray-900 tracking-wide">
                    {doc.title}
                  </h3>
                </div>
                <p className="font-body text-sm text-gray-500 leading-relaxed mb-6">
                  {doc.desc}
                </p>
                <div className="bg-white p-4 rounded-xl border border-gray-100 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200"></div>
                  <p className="font-body text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-2">
                    Algoritma / Rumus
                  </p>
                  <code
                    className={`block font-mono text-xs font-bold ${doc.textColor} bg-gray-50 p-2 rounded mb-2 ml-2`}
                  >
                    {doc.formula}
                  </code>
                  <p className="font-body text-[11px] text-gray-500 italic ml-2">
                    <strong className="text-gray-700">Contoh:</strong>{" "}
                    {doc.example}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BAGIAN 2: LEGAL & COMPLIANCE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Kepatuhan PPN 12% */}
          <section className="bg-white rounded-[2.5rem] shadow-xl shadow-black/[0.02] border border-gray-100 p-8 md:p-10 group hover:-translate-y-1 transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-[1.2rem]">
                <ShieldCheck size={24} />
              </div>
              <h2 className="font-display text-3xl text-[#0A0A0A] tracking-wider">
                Regulasi Pajak (PPN 12%)
              </h2>
            </div>
            <div className="font-body text-gray-500 text-sm leading-relaxed space-y-4">
              <p>
                <strong className="text-gray-900 font-bold">
                  Dasar Hukum:
                </strong>{" "}
                UU No. 7 Tahun 2021 tentang Harmonisasi Peraturan Perpajakan (UU
                HPP).
              </p>
              <p>
                Sesuai dengan amanat <strong>Pasal 7 ayat (1) huruf b</strong>,
                tarif Pajak Pertambahan Nilai (PPN) disesuaikan menjadi{" "}
                <strong className="text-[#0EA5E9]">12%</strong> mulai tahun
                2025.
              </p>
              <div className="bg-[#0EA5E9]/5 border-l-2 border-[#0EA5E9] p-4 mt-4 rounded-r-xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={14} className="text-[#0EA5E9]" />
                  <span className="font-body font-bold text-[9px] uppercase tracking-widest text-[#0EA5E9]">
                    Catatan PKP
                  </span>
                </div>
                <p className="text-xs text-gray-600 m-0">
                  Pengusaha Kena Pajak (PKP) wajib menyetor pajak konsumsi ini.
                  Gunakan modul Tax Auto-Splitter kami untuk memisahkan DPP agar
                  margin Anda tidak bocor.
                </p>
              </div>
            </div>
          </section>

          {/* Transparansi Harga */}
          <section className="bg-white rounded-[2.5rem] shadow-xl shadow-black/[0.02] border border-gray-100 p-8 md:p-10 group hover:-translate-y-1 transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[#FFC400]/10 text-[#FFC400] rounded-[1.2rem]">
                <Scale size={24} />
              </div>
              <h2 className="font-display text-3xl text-[#0A0A0A] tracking-wider">
                Transparansi Konsumen
              </h2>
            </div>
            <div className="font-body text-gray-500 text-sm leading-relaxed space-y-4">
              <p>
                <strong className="text-gray-900 font-bold">
                  Dasar Hukum:
                </strong>{" "}
                UU No. 8 Tahun 1999 tentang Perlindungan Konsumen.
              </p>
              <p>
                Pelaku usaha wajib memberikan informasi harga yang transparan.
                Jika harga di kasir <strong>belum termasuk PPN</strong>, Anda
                wajib mencantumkan disclaimer dengan jelas di buku menu atau
                etalase.
              </p>
              <div className="bg-[#FFC400]/5 border-l-2 border-[#FFC400] p-4 mt-4 rounded-r-xl">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={14} className="text-[#FFC400]" />
                  <span className="font-body font-bold text-[9px] uppercase tracking-widest text-[#FFC400]">
                    Standar Invoice
                  </span>
                </div>
                <p className="text-xs text-gray-600 m-0">
                  Modul <em>Smart Invoice</em> kami secara otomatis akan merinci
                  komponen harga dan PPN untuk memenuhi standar transparansi
                  komersial ini.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER LINK */}
        <div className="text-center py-12 mt-4">
          <p className="font-body text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">
            Tautan Referensi Eksternal
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <a
              href="https://pajak.go.id"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 font-body text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-[#0A0A0A] transition-colors group"
            >
              Situs Resmi DJP{" "}
              <ExternalLink
                size={14}
                className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
              />
            </a>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <a
              href="https://www.ojk.go.id"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 font-body text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-[#0A0A0A] transition-colors group"
            >
              Portal Edukasi OJK{" "}
              <ExternalLink
                size={14}
                className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
              />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
