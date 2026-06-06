"use client";

import React, { useState } from "react";
import Link from "next/link";
import ToolGuide from "@/components/ToolGuide";
import {
  ArrowLeft,
  Factory,
  TrendingDown,
  Calendar,
  Lightbulb,
  Save,
  Calculator,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast, { Toaster } from "react-hot-toast";

export default function DepreciationPage() {
  // State Input Asli
  const [assetName, setAssetName] = useState("Mesin Espresso La Marzocco");
  const [assetCost, setAssetCost] = useState(45000000); // Harga Perolehan
  const [salvageValue, setSalvageValue] = useState(5000000); // Nilai Sisa (Residu)
  const [usefulLife, setUsefulLife] = useState(5); // Umur Ekonomis (Tahun)

  const handleNumericChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: string,
  ) => {
    const cleanValue = value.replace(/\D/g, "");
    setter(cleanValue === "" ? 0 : Number(cleanValue));
  };

  // --- DERIVED STATE (Metode Garis Lurus / Straight-Line) ---
  const validUsefulLife = usefulLife > 0 ? usefulLife : 1; // Mencegah pembagian dengan 0
  const depreciableCost =
    assetCost > salvageValue ? assetCost - salvageValue : 0;

  const annualDepreciation = depreciableCost / validUsefulLife;
  const monthlyDepreciation = annualDepreciation / 12;

  // Generate Data untuk Grafik Penurunan Nilai Aset
  const getChartData = () => {
    if (assetCost <= 0) return [];

    const dataPoints = [];
    for (let year = 0; year <= validUsefulLife; year++) {
      const accumulated = annualDepreciation * year;
      const bookValue = assetCost - accumulated;

      dataPoints.push({
        Tahun: `Thn ${year}`,
        TahunAngka: year,
        NilaiBuku: bookValue < salvageValue ? salvageValue : bookValue,
        Penyusutan: accumulated,
      });
    }
    return dataPoints;
  };

  const chartData = getChartData();

  const handleSaveToOpex = () => {
    if (monthlyDepreciation <= 0)
      return toast.error("Kalkulasi penyusutan tidak valid!");
    // Simulasi penyimpanan ke localStorage untuk integrasi Kalkulator Utama
    localStorage.setItem(
      "pricepoint_opex_depreciation",
      monthlyDepreciation.toString(),
    );
    toast.success("Beban Bulanan Berhasil Disimpan ke Memori OPEX!");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A] pb-20 font-body overflow-x-hidden">
      <Toaster position="top-center" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* HEADER HERO (SaaS Dark Mode - Purple Edition) */}
      <header className="bg-[#0A0A0A] relative overflow-hidden pt-28 pb-40 px-6">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-[#8B5CF6]/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-[#D946EF]/10 rounded-full blur-[100px]"></div>
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-[#8B5CF6] font-body font-bold text-[10px] uppercase tracking-[0.2em] bg-white/5 px-6 py-3 rounded-full border border-white/10 hover:border-[#8B5CF6]/30 active:scale-95 transition-all mb-12 backdrop-blur-md group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Kembali ke Utama
          </Link>

          <h1 className="font-display text-5xl md:text-8xl text-white tracking-wide leading-none mb-6">
            ASSET DEPRECIATION <br />
            <span
              style={{
                background: "linear-gradient(90deg, #8B5CF6, #D946EF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CALCULATOR
            </span>
          </h1>
          <p className="font-body text-white/50 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Hitung penyusutan aset tetap dengan metode Garis Lurus
            (Straight-Line). Dapatkan nilai beban OPEX bulanan yang presisi
            untuk kalkulasi marginmu.
          </p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <ToolGuide
            title="Hitung penyusutan aset dengan mudah"
            description="Isi data aset dan umur ekonomis agar sistem menghitung beban penyusutan tahunan dan bulanan."
            items={[
              "Isi nama aset, harga perolehan, nilai sisa, dan umur ekonomis.",
              "Lihat beban penyusutan tahunan dan bulanan secara instan.",
              "Gunakan tombol ekspor ke OPEX bila ingin memasukkan beban ke kalkulator utama.",
              "Pastikan nilai sisa tidak lebih tinggi dari harga perolehan.",
            ]}
          />
        </div>
        {/* LEFT: INPUT AREA */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-black/[0.02] border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] text-white rounded-[1rem] shadow-lg shadow-purple-500/20">
                <Factory size={24} />
              </div>
              <h3 className="font-display text-3xl tracking-wider text-[#0A0A0A]">
                Data Aset
              </h3>
            </div>

            <div className="space-y-6">
              <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 focus-within:border-[#8B5CF6]/50 focus-within:bg-white transition-all group">
                <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2">
                  Nama Aset / Peralatan
                </label>
                <input
                  type="text"
                  className="w-full text-lg font-bold outline-none bg-transparent text-[#0A0A0A] uppercase"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="Mesin Kopi"
                />
              </div>

              <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 focus-within:border-[#8B5CF6]/50 focus-within:bg-white transition-all group">
                <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2">
                  Harga Perolehan (Beli)
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-display text-xl text-gray-300">Rp</span>
                  <input
                    type="text"
                    className="w-full text-2xl font-bold outline-none bg-transparent text-[#0A0A0A]"
                    value={assetCost.toLocaleString("id-ID")}
                    onChange={(e) =>
                      handleNumericChange(setAssetCost, e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 focus-within:border-[#8B5CF6]/50 focus-within:bg-white transition-all group">
                  <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2">
                    Umur (Tahun)
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gray-300" />
                    <input
                      type="text"
                      className="w-full text-2xl font-bold outline-none bg-transparent text-[#0A0A0A]"
                      value={usefulLife.toLocaleString("id-ID")}
                      onChange={(e) =>
                        handleNumericChange(setUsefulLife, e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 focus-within:border-[#D946EF]/50 focus-within:bg-white transition-all group">
                  <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2">
                    Nilai Sisa (Residu)
                  </label>
                  <input
                    type="text"
                    className="w-full text-2xl font-bold outline-none bg-transparent text-[#0A0A0A]"
                    value={salvageValue.toLocaleString("id-ID")}
                    onChange={(e) =>
                      handleNumericChange(setSalvageValue, e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveToOpex}
              className="w-full mt-8 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white py-4 rounded-2xl font-body font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all active:scale-95"
            >
              <Save size={18} /> Ekspor ke OPEX
            </button>
          </div>
        </section>

        {/* RIGHT: OUTPUT & CHART AREA */}
        <section className="lg:col-span-8 space-y-6">
          {/* Output Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg shadow-black/[0.02] border border-gray-100 flex items-center gap-6">
              <div className="w-16 h-16 bg-[#8B5CF6]/10 rounded-[1.2rem] flex items-center justify-center shrink-0 border border-[#8B5CF6]/20 text-[#8B5CF6]">
                <TrendingDown size={28} />
              </div>
              <div>
                <p className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
                  Penyusutan per Tahun
                </p>
                <h3 className="font-display text-4xl text-[#0A0A0A] tracking-wider">
                  <span className="text-xl text-gray-400 mr-1">Rp</span>
                  {annualDepreciation > 0
                    ? Math.round(annualDepreciation).toLocaleString("id-ID")
                    : "0"}
                </h3>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg shadow-black/[0.02] border border-[#8B5CF6]/30 flex items-center gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#D946EF]/5 rounded-full blur-2xl"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] text-white rounded-[1.2rem] flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
                <Calculator size={28} />
              </div>
              <div className="relative z-10">
                <p className="font-body text-[10px] font-bold text-[#8B5CF6] uppercase tracking-[0.2em] mb-1">
                  Beban OPEX per Bulan
                </p>
                <h3 className="font-display text-4xl text-[#0A0A0A] tracking-wider">
                  <span className="text-xl text-gray-400 mr-1">Rp</span>
                  {monthlyDepreciation > 0
                    ? Math.round(monthlyDepreciation).toLocaleString("id-ID")
                    : "0"}
                </h3>
              </div>
            </div>
          </div>

          {/* CHART VISUALIZATION */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-black/[0.02] border border-gray-100 relative group">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="font-display text-3xl tracking-wider text-[#0A0A0A] flex items-center gap-3">
                  KURVA NILAI BUKU ASET
                </h3>
                <p className="font-body text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                  Penurunan Nilai Selama Umur Ekonomis
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#8B5CF6]"></span>
                <span className="font-body text-[10px] font-bold text-gray-400 uppercase">
                  Nilai Aset
                </span>
              </div>
            </div>

            <div className="h-[350px] w-full">
              {assetCost <= salvageValue ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
                  <Activity className="text-gray-300 mb-4" size={48} />
                  <p className="font-body font-bold text-gray-400 tracking-wide">
                    Harga Perolehan harus lebih besar dari Nilai Sisa.
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorBookValue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8B5CF6"
                          stopOpacity={0.6}
                        />
                        <stop
                          offset="95%"
                          stopColor="#D946EF"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="4 4"
                      stroke="#F1F5F9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="Tahun"
                      tick={{
                        fill: "#94A3B8",
                        fontSize: 12,
                        fontWeight: 700,
                        fontFamily: "DM Sans",
                      }}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        `Rp${(value / 1000000).toFixed(0)}M`
                      }
                      tick={{
                        fill: "#94A3B8",
                        fontSize: 12,
                        fontWeight: 700,
                        fontFamily: "DM Sans",
                      }}
                      tickLine={false}
                      axisLine={false}
                      dx={-10}
                    />
                    <Tooltip
                      formatter={(value) =>
                        typeof value === "number"
                          ? `Rp ${value.toLocaleString("id-ID")}`
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

                    <Area
                      type="monotone"
                      dataKey="NilaiBuku"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorBookValue)"
                      activeDot={{
                        r: 6,
                        fill: "#8B5CF6",
                        stroke: "#FFF",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Business Insight Bot */}
            {monthlyDepreciation > 0 && (
              <div className="mt-8 bg-gradient-to-br from-[#8B5CF6]/10 to-[#D946EF]/10 border border-[#8B5CF6]/20 p-6 rounded-2xl relative overflow-hidden flex gap-4 items-start">
                <Lightbulb
                  className="text-[#8B5CF6] flex-shrink-0 mt-1"
                  size={24}
                />
                <p className="font-body text-sm font-bold leading-relaxed text-[#0A0A0A]">
                  <strong className="text-[#8B5CF6] uppercase tracking-widest text-[10px] block mb-1">
                    Accounting Insight:
                  </strong>
                  Jangan lupa! Beban penyusutan sebesar{" "}
                  <span className="text-[#8B5CF6] bg-white px-2 py-0.5 rounded shadow-sm">
                    Rp {Math.round(monthlyDepreciation).toLocaleString("id-ID")}
                  </span>{" "}
                  ini harus kamu catat sebagai pengeluaran rutin (OPEX) setiap
                  bulannya di Kalkulator PricePoint agar perhitungan harga
                  jualmu tetap rasional dan asetmu bisa tergantikan di masa
                  depan.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
