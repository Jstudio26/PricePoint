"use client";

import React, { useState } from "react";
import Link from "next/link";
import ToolGuide from "@/components/ToolGuide";
import { ArrowLeft, Target, Package, Activity, Lightbulb } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";

// --- INTERFACES ---
interface ChartDataPoint {
  unit: number;
  Pendapatan: number;
  TotalBiaya: number;
}

export default function BepAnalyzerPage() {
  // State Input Asli
  const [fixedCost, setFixedCost] = useState(5000000);
  const [variableCost, setVariableCost] = useState(15000);
  const [sellingPrice, setSellingPrice] = useState(25000);

  const handleNumericChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: string,
  ) => {
    const cleanValue = value.replace(/\D/g, "");
    setter(cleanValue === "" ? 0 : Number(cleanValue));
  };

  // --- DERIVED STATE (Kalkulasi Langsung Tanpa useEffect) ---
  const contributionMargin = sellingPrice - variableCost;
  const bepUnits =
    contributionMargin > 0 ? Math.ceil(fixedCost / contributionMargin) : 0;
  const bepRupiah = bepUnits * sellingPrice;

  const getChartData = (): ChartDataPoint[] => {
    if (contributionMargin <= 0) return [];

    const dataPoints: ChartDataPoint[] = [];
    const maxUnits = bepUnits > 0 ? bepUnits * 2 : 100;
    const step = Math.ceil(maxUnits / 10);

    for (let i = 0; i <= maxUnits; i += step) {
      dataPoints.push({
        unit: i,
        Pendapatan: i * sellingPrice,
        TotalBiaya: fixedCost + i * variableCost,
      });
    }

    // Pastikan titik BEP persis ada di dalam grafik
    if (bepUnits > 0 && !dataPoints.find((d) => d.unit === bepUnits)) {
      dataPoints.push({
        unit: bepUnits,
        Pendapatan: bepRupiah,
        TotalBiaya: fixedCost + bepUnits * variableCost,
      });
      dataPoints.sort((a, b) => a.unit - b.unit);
    }

    return dataPoints;
  };

  const chartData = getChartData();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A] pb-20 font-body overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* HEADER HERO */}
      <header className="bg-[#0A0A0A] relative overflow-hidden pt-28 pb-40 px-6">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-[#DD2C00]/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-[#FFC400]/10 rounded-full blur-[100px]"></div>
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,145,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,145,0,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-[#FFC400] font-body font-bold text-[10px] uppercase tracking-[0.2em] bg-white/5 px-6 py-3 rounded-full border border-white/10 hover:border-[#FFC400]/30 active:scale-95 transition-all mb-12 backdrop-blur-md group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Kembali ke Utama
          </Link>

          <h1 className="font-display text-5xl md:text-8xl text-white tracking-wide leading-none mb-6">
            BREAK-EVEN POINT <br />
            <span
              style={{
                background: "linear-gradient(90deg, #FFC400, #FF6B00, #DD2C00)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ANALYZER
            </span>
          </h1>
          <p className="font-body text-white/50 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Simulasikan kelayakan finansial bisnismu. Ketahui secara presisi di
            titik mana kamu berhenti merugi dan mulai mencetak profit.
          </p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <ToolGuide
            title="Analisis Break-Even Point"
            description="Isi biaya tetap, biaya variabel, dan harga jual untuk melihat kapan bisnis Anda mulai profit."
            items={[
              "Isi biaya tetap bulanan, biaya variabel per unit, dan harga jual per unit.",
              "Nantinya titik impas akan tercetak dalam unit dan rupiah.",
              "Grafik menunjukkan kapan pendapatan menutupi total biaya.",
              "Gunakan hasil untuk menentukan target volume penjualan.",
            ]}
          />
        </div>
        {/* LEFT: INPUT AREA */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-black/2 border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-linear-to-br from-[#FFC400] to-[#FF6B00] text-white rounded-2xl shadow-lg shadow-orange-500/20">
                <Target size={24} />
              </div>
              <h3 className="font-display text-3xl tracking-wider text-[#0A0A0A]">
                Parameter BEP
              </h3>
            </div>

            <div className="space-y-6">
              <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 focus-within:border-[#FF6B00]/50 focus-within:bg-white transition-all group">
                <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2">
                  Biaya Tetap Bulanan (Rp)
                </label>
                <input
                  type="text"
                  className="w-full text-2xl font-bold outline-none bg-transparent text-[#0A0A0A]"
                  value={fixedCost.toLocaleString("id-ID")}
                  onChange={(e) =>
                    handleNumericChange(setFixedCost, e.target.value)
                  }
                  placeholder="Misal: 5.000.000"
                />
                <p className="text-[9px] text-gray-400 mt-2">
                  Gaji, Sewa Tempat, Listrik Bulanan
                </p>
              </div>

              <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 focus-within:border-[#FF6B00]/50 focus-within:bg-white transition-all group">
                <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2">
                  Biaya Variabel per Unit (Rp)
                </label>
                <input
                  type="text"
                  className="w-full text-2xl font-bold outline-none bg-transparent text-[#0A0A0A]"
                  value={variableCost.toLocaleString("id-ID")}
                  onChange={(e) =>
                    handleNumericChange(setVariableCost, e.target.value)
                  }
                  placeholder="HPP per Porsi/Barang"
                />
                <p className="text-[9px] text-gray-400 mt-2">
                  Bahan Baku, Kemasan (Dari Simulator Utama)
                </p>
              </div>

              <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 focus-within:border-[#DD2C00]/50 focus-within:bg-white transition-all group">
                <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2">
                  Harga Jual per Unit (Rp)
                </label>
                <input
                  type="text"
                  className="w-full text-2xl font-bold outline-none bg-transparent text-[#DD2C00]"
                  value={sellingPrice.toLocaleString("id-ID")}
                  onChange={(e) =>
                    handleNumericChange(setSellingPrice, e.target.value)
                  }
                  placeholder="Harga Retail"
                />
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: OUTPUT & CHART AREA */}
        <section className="lg:col-span-8 space-y-6">
          {/* Output Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg shadow-black/2 border border-gray-100 flex items-center gap-6">
              <div className="w-16 h-16 bg-[#FFC400]/10 rounded-[1.2rem] flex items-center justify-center shrink-0 border border-[#FFC400]/20 text-[#FFC400]">
                <Package size={28} />
              </div>
              <div>
                <p className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
                  Titik Impas (Volume)
                </p>
                <h3 className="font-display text-5xl text-[#0A0A0A] tracking-wider">
                  {bepUnits > 0 ? bepUnits.toLocaleString("id-ID") : "0"}{" "}
                  <span className="text-xl text-gray-400">Unit</span>
                </h3>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg shadow-black/2 border border-gray-100 flex items-center gap-6">
              <div className="w-16 h-16 bg-[#DD2C00]/10 rounded-[1.2rem] flex items-center justify-center shrink-0 border border-[#DD2C00]/20 text-[#DD2C00]">
                <span className="font-display text-2xl tracking-wider">Rp</span>
              </div>
              <div>
                <p className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
                  Titik Impas (Rupiah)
                </p>
                <h3 className="font-display text-5xl text-[#0A0A0A] tracking-wider">
                  <span className="text-xl text-gray-400 mr-1">Rp</span>
                  {bepRupiah > 0 ? bepRupiah.toLocaleString("id-ID") : "0"}
                </h3>
              </div>
            </div>
          </div>

          {/* CHART VISUALIZATION */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-black/2 border border-gray-100 relative group">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="font-display text-3xl tracking-wider text-[#0A0A0A] flex items-center gap-3">
                  KURVA KELAYAKAN BISNIS
                </h3>
                <p className="font-body text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                  Persilangan Biaya vs Pendapatan
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#DD2C00]"></span>
                  <span className="font-body text-[10px] font-bold text-gray-400 uppercase">
                    Biaya Total
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FFC400]"></span>
                  <span className="font-body text-[10px] font-bold text-gray-400 uppercase">
                    Pendapatan
                  </span>
                </div>
              </div>
            </div>

            <div className="h-[350px] w-full">
              {sellingPrice <= variableCost ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 rounded-2xl border border-red-100">
                  <Activity className="text-red-400 mb-4" size={48} />
                  <p className="font-body font-bold text-red-600 tracking-wide">
                    Analisis Gagal: Harga Jual lebih rendah dari Biaya Variabel!
                  </p>
                  <p className="font-body text-xs text-red-400 mt-2">
                    Bisnis ini akan selalu merugi terlepas dari berapapun unit
                    yang terjual.
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="4 4"
                      stroke="#F1F5F9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="unit"
                      tick={{
                        fill: "#94A3B8",
                        fontSize: 12,
                        fontWeight: 700,
                        fontFamily: "DM Sans",
                      }}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                      label={{
                        value: "Unit Terjual",
                        position: "bottom",
                        fill: "#94A3B8",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        `Rp${(value / 1000000).toFixed(1)}M`
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

                    {/* Garis Biaya Total */}
                    <Line
                      type="monotone"
                      dataKey="TotalBiaya"
                      stroke="#DD2C00"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                    {/* Garis Pendapatan */}
                    <Line
                      type="monotone"
                      dataKey="Pendapatan"
                      stroke="#FFC400"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />

                    {/* Penanda Titik BEP */}
                    {bepUnits > 0 && (
                      <ReferenceDot
                        x={bepUnits}
                        y={bepRupiah}
                        r={6}
                        fill="#FF6B00"
                        stroke="white"
                        strokeWidth={2}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Business Insight Bot */}
            {sellingPrice > variableCost && (
              <div className="mt-8 bg-linear-to-br from-[#FFC400]/10 to-[#FF6B00]/10 border border-[#FF6B00]/20 p-6 rounded-2xl relative overflow-hidden flex gap-4 items-start">
                <Lightbulb className="text-[#FF6B00] shrink-0 mt-1" size={24} />
                <p className="font-body text-sm font-bold leading-relaxed text-[#0A0A0A]">
                  <strong className="text-[#FF6B00] uppercase tracking-widest text-[10px] block mb-1">
                    Business Insight:
                  </strong>
                  Kamu harus menjual minimal{" "}
                  <span className="text-[#DD2C00]">
                    {bepUnits.toLocaleString("id-ID")} unit
                  </span>{" "}
                  dalam sebulan untuk menutupi biaya tetap sebesar Rp{" "}
                  {fixedCost.toLocaleString("id-ID")}. Penjualan di unit ke-
                  {bepUnits + 1} dan seterusnya adalah{" "}
                  <span className="text-[#4CAF50]">Profit Bersihmu</span>.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
