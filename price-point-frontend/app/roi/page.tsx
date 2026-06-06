"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  Wallet,
  CalendarClock,
  Lightbulb,
  Activity,
  PieChart,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function ROICalculatorPage() {
  // State Input
  const [investment, setInvestment] = useState(50000000); // Modal Awal (CAPEX)
  const [monthlyProfit, setMonthlyProfit] = useState(4000000); // Target Profit Bersih per Bulan

  const handleNumericChange = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: string,
  ) => {
    const cleanValue = value.replace(/\D/g, "");
    setter(cleanValue === "" ? 0 : Number(cleanValue));
  };

  // --- DERIVED STATE (Anti ESLint Error) ---
  const paybackMonths = monthlyProfit > 0 ? investment / monthlyProfit : 0;
  const annualROI =
    investment > 0 ? ((monthlyProfit * 12) / investment) * 100 : 0;

  // Generate Data untuk Grafik Area
  const getChartData = () => {
    if (monthlyProfit <= 0 || investment <= 0) return [];

    const dataPoints = [];
    const maxMonths = Math.ceil(paybackMonths) + 3; // Tampilkan sampai 3 bulan setelah balik modal

    for (let month = 0; month <= maxMonths; month++) {
      dataPoints.push({
        Bulan: `Bulan ${month}`,
        BulanAngka: month,
        KumulatifProfit: month * monthlyProfit,
        TargetModal: investment,
      });
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
          <div className="absolute top-[-20%] right-[10%] w-[500px] h-[500px] bg-[#4CAF50]/15 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-[#FFC400]/10 rounded-full blur-[100px]"></div>
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(76,175,80,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(76,175,80,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-[#4CAF50] font-body font-bold text-[10px] uppercase tracking-[0.2em] bg-white/5 px-6 py-3 rounded-full border border-white/10 hover:border-[#4CAF50]/30 active:scale-95 transition-all mb-12 backdrop-blur-md group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Kembali ke Utama
          </Link>

          <h1 className="font-display text-5xl md:text-8xl text-white tracking-wide leading-none mb-6">
            INVESTMENT <br />
            <span
              style={{
                background: "linear-gradient(90deg, #4CAF50, #FFC400)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ROI TRACKER
            </span>
          </h1>
          <p className="font-body text-white/50 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Hitung tingkat pengembalian investasi (ROI) dan Payback Period.
            Buktikan kepada investor bahwa bisnismu sangat layak didanai.
          </p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: INPUT AREA */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-black/[0.02] border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-[#4CAF50] to-[#8BC34A] text-white rounded-[1rem] shadow-lg shadow-green-500/20">
                <Wallet size={24} />
              </div>
              <h3 className="font-display text-3xl tracking-wider text-[#0A0A0A]">
                Modal & Target
              </h3>
            </div>

            <div className="space-y-6">
              <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 focus-within:border-[#4CAF50]/50 focus-within:bg-white transition-all group">
                <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2">
                  Total Modal Awal (CAPEX)
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-display text-xl text-gray-300">Rp</span>
                  <input
                    type="text"
                    className="w-full text-2xl font-bold outline-none bg-transparent text-[#0A0A0A]"
                    value={investment.toLocaleString("id-ID")}
                    onChange={(e) =>
                      handleNumericChange(setInvestment, e.target.value)
                    }
                    placeholder="50.000.000"
                  />
                </div>
                <p className="text-[9px] text-gray-400 mt-2">
                  Renovasi, Beli Mesin, Perizinan, dll.
                </p>
              </div>

              <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 focus-within:border-[#4CAF50]/50 focus-within:bg-white transition-all group">
                <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2">
                  Target Profit Bersih / Bulan
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-display text-xl text-[#4CAF50]/50">
                    Rp
                  </span>
                  <input
                    type="text"
                    className="w-full text-2xl font-bold outline-none bg-transparent text-[#4CAF50]"
                    value={monthlyProfit.toLocaleString("id-ID")}
                    onChange={(e) =>
                      handleNumericChange(setMonthlyProfit, e.target.value)
                    }
                    placeholder="4.000.000"
                  />
                </div>
                <p className="text-[9px] text-gray-400 mt-2">
                  Asumsi profit stabil setiap bulan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: OUTPUT & CHART AREA */}
        <section className="lg:col-span-8 space-y-6">
          {/* Output Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg shadow-black/[0.02] border border-gray-100 flex items-center gap-6">
              <div className="w-16 h-16 bg-[#4CAF50]/10 rounded-[1.2rem] flex items-center justify-center shrink-0 border border-[#4CAF50]/20 text-[#4CAF50]">
                <CalendarClock size={28} />
              </div>
              <div>
                <p className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
                  Payback Period
                </p>
                <h3 className="font-display text-5xl text-[#0A0A0A] tracking-wider">
                  {paybackMonths > 0 ? paybackMonths.toFixed(1) : "0"}{" "}
                  <span className="text-xl text-gray-400">Bulan</span>
                </h3>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg shadow-black/[0.02] border border-gray-100 flex items-center gap-6">
              <div className="w-16 h-16 bg-[#FFC400]/10 rounded-[1.2rem] flex items-center justify-center shrink-0 border border-[#FFC400]/20 text-[#FFC400]">
                <PieChart size={28} />
              </div>
              <div>
                <p className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
                  Annual ROI (Per Tahun)
                </p>
                <h3 className="font-display text-5xl text-[#0A0A0A] tracking-wider">
                  {annualROI > 0 ? annualROI.toFixed(1) : "0"}
                  <span className="text-xl text-gray-400 ml-1">%</span>
                </h3>
              </div>
            </div>
          </div>

          {/* CHART VISUALIZATION */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-black/[0.02] border border-gray-100 relative group">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="font-display text-3xl tracking-wider text-[#0A0A0A] flex items-center gap-3">
                  PROYEKSI BALIK MODAL
                </h3>
                <p className="font-body text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                  Akumulasi Profit vs Modal Awal
                </p>
              </div>
              <div className="p-3 bg-[#4CAF50]/10 text-[#4CAF50] rounded-2xl">
                <TrendingUp size={24} />
              </div>
            </div>

            <div className="h-[350px] w-full">
              {monthlyProfit <= 0 || investment <= 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-100">
                  <Activity className="text-gray-300 mb-4" size={48} />
                  <p className="font-body font-bold text-gray-400 tracking-wide">
                    Masukkan Modal dan Target Profit untuk melihat proyeksi.
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
                        id="colorProfit"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#4CAF50"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#4CAF50"
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
                      dataKey="Bulan"
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

                    {/* Area Profit Kumulatif */}
                    <Area
                      type="monotone"
                      dataKey="KumulatifProfit"
                      stroke="#4CAF50"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorProfit)"
                      activeDot={{
                        r: 6,
                        fill: "#4CAF50",
                        stroke: "#FFF",
                        strokeWidth: 2,
                      }}
                    />

                    {/* Garis Batas Modal (Target Balik Modal) */}
                    <ReferenceLine
                      y={investment}
                      label={{
                        position: "insideTopLeft",
                        value: "Modal Terpenuhi",
                        fill: "#FF9100",
                        fontSize: 10,
                        fontWeight: "bold",
                      }}
                      stroke="#FF9100"
                      strokeDasharray="3 3"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Business Insight Bot */}
            {monthlyProfit > 0 && investment > 0 && (
              <div className="mt-8 bg-gradient-to-br from-[#4CAF50]/10 to-[#8BC34A]/10 border border-[#4CAF50]/20 p-6 rounded-2xl relative overflow-hidden flex gap-4 items-start">
                <Lightbulb
                  className="text-[#4CAF50] flex-shrink-0 mt-1"
                  size={24}
                />
                <p className="font-body text-sm font-bold leading-relaxed text-[#0A0A0A]">
                  <strong className="text-[#4CAF50] uppercase tracking-widest text-[10px] block mb-1">
                    Investor Summary:
                  </strong>
                  Dengan target profit bersih{" "}
                  <span className="text-[#4CAF50]">
                    Rp {monthlyProfit.toLocaleString("id-ID")} / bulan
                  </span>
                  , seluruh modal awal sebesar Rp{" "}
                  {investment.toLocaleString("id-ID")} akan kembali sepenuhnya
                  pada{" "}
                  <span className="text-[#0A0A0A] bg-[#FFC400]/30 px-2 py-0.5 rounded">
                    Bulan ke-{Math.ceil(paybackMonths)}
                  </span>
                  . Tingkat pengembalian investasi (ROI) tahunan bisnismu adalah{" "}
                  <span className="text-[#DD2C00]">
                    {annualROI.toFixed(2)}%
                  </span>
                  !
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
