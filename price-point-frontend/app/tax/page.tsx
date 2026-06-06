"use client";

import React, { useState } from "react";
import Link from "next/link";
import ToolGuide from "@/components/ToolGuide";
import {
  ArrowLeft,
  Landmark,
  ReceiptText,
  ShieldCheck,
  PieChart as PieChartIcon,
  Lightbulb,
  Building,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function TaxCalculatorPage() {
  // --- STATE INPUT ---
  const [finalPrice, setFinalPrice] = useState(56000); // Harga Jual Akhir ke Konsumen
  const [monthlyOmset, setMonthlyOmset] = useState(15000000); // Omset Kotor Sebulan

  const handleNumericChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: string,
  ) => {
    const cleanValue = value.replace(/\D/g, "");
    setter(cleanValue === "" ? 0 : Number(cleanValue));
  };

  // --- DERIVED STATE: KALKULASI PAJAK (Tanpa useEffect!) ---

  // 1. PPN 12% Auto-Split (Mencari DPP dari Harga Akhir)
  // Rumus PPN 12%: Harga Akhir = DPP + (DPP * 12%) = DPP * 1.12
  // Maka: DPP = Harga Akhir / 1.12
  const dpp = finalPrice / 1.12;
  const ppn12 = finalPrice - dpp;

  // 2. PPh Final UMKM (0.5% dari Omset Kotor) sesuai PP 23/2018 & UU HPP
  const pphFinal = monthlyOmset * 0.005;

  // Data Grafik PPN
  const pieData = [
    { name: "Pendapatan Bersih (DPP)", value: dpp, color: "#0EA5E9" }, // Sky Blue
    { name: "Titipan Pajak (PPN 12%)", value: ppn12, color: "#F43F5E" }, // Rose Red
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A] pb-20 font-body overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* HEADER HERO (Treasury / Financial Blue Theme) */}
      <header className="bg-[#0A0A0A] relative overflow-hidden pt-28 pb-40 px-6">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-[#0EA5E9]/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-[#14B8A6]/10 rounded-full blur-[100px]"></div>
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(14,165,233,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-[#0EA5E9] font-body font-bold text-[10px] uppercase tracking-[0.2em] bg-white/5 px-6 py-3 rounded-full border border-white/10 hover:border-[#0EA5E9]/30 active:scale-95 transition-all mb-12 backdrop-blur-md group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Kembali ke Utama
          </Link>

          <h1 className="font-display text-5xl md:text-8xl text-white tracking-wide leading-none mb-6">
            TAX & COMPLIANCE <br />
            <span
              style={{
                background: "linear-gradient(90deg, #0EA5E9, #14B8A6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AUTO-SPLITTER
            </span>
          </h1>
          <p className="font-body text-white/50 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Patuhi regulasi perpajakan Indonesia tanpa pusing. Ekstrak nilai DPP
            dari Harga Final (PPN 12%) dan pantau kewajiban PPh Final UMKM
            bulanan.
          </p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <ToolGuide
            title="Cek Pajak UMKM dan PPN 12%"
            description="Masukkan harga jual dan omset bulanan untuk melihat komponen DPP, PPN, dan PPh Final UMKM."
            items={[
              "Masukkan harga akhir yang sudah termasuk PPN 12%.",
              "Dapatkan DPP dan besaran PPN secara otomatis.",
              "Isi omset kotor bulanan untuk menghitung PPh Final UMKM 0.5%.",
              "Gunakan hasil untuk memastikan kepatuhan perpajakan.",
            ]}
          />
        </div>
        {/* LEFT: INPUT AREA */}
        <section className="lg:col-span-4 space-y-6">
          {/* Card 1: Input Harga Jual (PPN) */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-black/[0.02] border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] text-white rounded-[1rem] shadow-lg shadow-blue-500/20">
                <ReceiptText size={24} />
              </div>
              <h3 className="font-display text-2xl tracking-wider text-[#0A0A0A] leading-none">
                Reverse PPN 12%
              </h3>
            </div>

            <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 focus-within:border-[#0EA5E9]/50 focus-within:bg-white transition-all group">
              <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2">
                Harga Akhir (Include PPN)
              </label>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl text-gray-300">Rp</span>
                <input
                  type="text"
                  className="w-full text-3xl font-bold outline-none bg-transparent text-[#0A0A0A]"
                  value={finalPrice.toLocaleString("id-ID")}
                  onChange={(e) =>
                    handleNumericChange(setFinalPrice, e.target.value)
                  }
                />
              </div>
              <p className="text-[9px] text-gray-400 mt-2">
                Harga pas yang dibayar oleh konsumen Anda.
              </p>
            </div>
          </div>

          {/* Card 2: Input Omset (PPh UMKM) */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-black/[0.02] border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-[#14B8A6] to-[#0D9488] text-white rounded-[1rem] shadow-lg shadow-teal-500/20">
                <Building size={24} />
              </div>
              <h3 className="font-display text-2xl tracking-wider text-[#0A0A0A] leading-none">
                PPh Final UMKM (0.5%)
              </h3>
            </div>

            <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 focus-within:border-[#14B8A6]/50 focus-within:bg-white transition-all group">
              <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2">
                Omset Kotor Bulanan
              </label>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl text-gray-300">Rp</span>
                <input
                  type="text"
                  className="w-full text-3xl font-bold outline-none bg-transparent text-[#0A0A0A]"
                  value={monthlyOmset.toLocaleString("id-ID")}
                  onChange={(e) =>
                    handleNumericChange(setMonthlyOmset, e.target.value)
                  }
                />
              </div>
              <p className="text-[9px] text-gray-400 mt-2">
                Total uang masuk sebelum dipotong biaya apapun.
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT: OUTPUT & CHART AREA */}
        <section className="lg:col-span-8 space-y-6">
          {/* Output Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg shadow-black/[0.02] border border-gray-100 flex items-center gap-6">
              <div className="w-16 h-16 bg-[#0EA5E9]/10 rounded-[1.2rem] flex items-center justify-center shrink-0 border border-[#0EA5E9]/20 text-[#0EA5E9]">
                <ShieldCheck size={28} />
              </div>
              <div>
                <p className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
                  Dasar Pengenaan Pajak (DPP)
                </p>
                <h3 className="font-display text-4xl text-[#0A0A0A] tracking-wider">
                  <span className="text-xl text-gray-400 mr-1">Rp</span>
                  {dpp > 0 ? Math.round(dpp).toLocaleString("id-ID") : "0"}
                </h3>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg shadow-black/[0.02] border border-gray-100 flex items-center gap-6">
              <div className="w-16 h-16 bg-[#F43F5E]/10 rounded-[1.2rem] flex items-center justify-center shrink-0 border border-[#F43F5E]/20 text-[#F43F5E]">
                <Landmark size={28} />
              </div>
              <div>
                <p className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
                  PPN 12% (Titipan Negara)
                </p>
                <h3 className="font-display text-4xl text-[#F43F5E] tracking-wider">
                  <span className="text-xl text-[#F43F5E]/50 mr-1">Rp</span>
                  {ppn12 > 0 ? Math.round(ppn12).toLocaleString("id-ID") : "0"}
                </h3>
              </div>
            </div>
          </div>

          {/* MAIN VISUALIZATION AREA */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* CHART PPN */}
            <div className="md:col-span-7 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-black/[0.02] border border-gray-100 relative group flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-display text-3xl tracking-wider text-[#0A0A0A] flex items-center gap-3">
                    POSTUR HARGA
                  </h3>
                  <p className="font-body text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                    Pendapatan Asli vs Titipan PPN
                  </p>
                </div>
                <div className="p-3 bg-gray-50 text-gray-400 rounded-2xl">
                  <PieChartIcon size={24} />
                </div>
              </div>

              <div className="h-[250px] w-full">
                {finalPrice <= 0 ? (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <p className="font-body font-bold text-gray-400">
                      Masukkan Harga Final
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) =>
                          typeof value === "number"
                            ? `Rp ${Math.round(value).toLocaleString("id-ID")}`
                            : value
                        }
                        contentStyle={{
                          borderRadius: "16px",
                          border: "none",
                          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                          fontWeight: 700,
                          fontFamily: "DM Sans",
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{
                          fontSize: "11px",
                          fontWeight: "bold",
                          fontFamily: "DM Sans",
                          color: "#64748B",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* PPh FINAL UMKM CARD */}
            <div className="md:col-span-5 bg-gradient-to-br from-[#0A0A0A] to-[#171717] p-8 rounded-[2.5rem] shadow-xl shadow-black/10 border border-gray-800 relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#14B8A6]/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="relative z-10 text-center">
                <div className="w-16 h-16 mx-auto bg-[#14B8A6]/20 text-[#14B8A6] rounded-2xl flex items-center justify-center mb-4">
                  <Landmark size={28} />
                </div>
                <p className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">
                  Setoran PPh Final 0.5%
                </p>
                <h3 className="font-display text-4xl text-white tracking-wider mb-2">
                  <span className="text-xl text-gray-500 mr-1">Rp</span>
                  {pphFinal > 0
                    ? Math.round(pphFinal).toLocaleString("id-ID")
                    : "0"}
                </h3>
                <p className="font-body text-xs text-gray-500 leading-relaxed border-t border-gray-800 pt-4 mt-4">
                  Pajak Penghasilan (PPh) Final khusus UMKM dibayarkan ke kas
                  negara paling lambat{" "}
                  <strong className="text-gray-300">
                    tanggal 15 bulan berikutnya
                  </strong>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Business Insight Bot */}
          {finalPrice > 0 && (
            <div className="mt-8 bg-gradient-to-br from-[#0EA5E9]/10 to-[#14B8A6]/10 border border-[#0EA5E9]/20 p-6 rounded-2xl relative overflow-hidden flex gap-4 items-start">
              <Lightbulb
                className="text-[#0EA5E9] flex-shrink-0 mt-1"
                size={24}
              />
              <p className="font-body text-sm font-bold leading-relaxed text-[#0A0A0A]">
                <strong className="text-[#0EA5E9] uppercase tracking-widest text-[10px] block mb-1">
                  Tax Insight:
                </strong>
                Hati-hati! Jika kamu menjual barang seharga{" "}
                <strong className="text-[#0A0A0A]">
                  Rp {finalPrice.toLocaleString("id-ID")}
                </strong>
                , uang yang benar-benar menjadi pendapatan kotor (DPP) bisnismu
                hanyalah{" "}
                <strong className="text-[#0EA5E9]">
                  Rp {Math.round(dpp).toLocaleString("id-ID")}
                </strong>
                . Sisanya sebesar{" "}
                <strong className="text-[#F43F5E]">
                  Rp {Math.round(ppn12).toLocaleString("id-ID")}
                </strong>{" "}
                adalah PPN yang harus disetorkan ke DJP. Jangan sampai terpakai
                untuk operasional!
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
