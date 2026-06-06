"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { SimulationHistory } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Package,
  TrendingUp,

  Target,
  ArrowRight,
  Activity,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function TrendingChartPage() {
  const { isInitialized, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  // State untuk menyimpan kalkulasi data asli
  const [stats, setStats] = useState({
    totalSimulations: 0,
    totalValuation: 0,
    averageMargin: 0,
    mostExpensiveProduct: "-",
  });
  const [chartData, setChartData] = useState<
    { name: string; simulasi: number }[]
  >([]);

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      fetchDashboardData();
    }
  }, [isInitialized, isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get("/simulations/history");
      const data: SimulationHistory[] = res.data.data || [];

      if (data.length === 0) {
        setLoading(false);
        return;
      }

      // 1. Kalkulasi Statistik
      const totalVal = data.reduce((acc, curr) => acc + curr.final_price, 0);
      const avgMargin =
        data.reduce((acc, curr) => acc + curr.margin, 0) / data.length;

      let expensiveProduct = data[0];
      data.forEach((item) => {
        if (item.final_price > expensiveProduct.final_price) {
          expensiveProduct = item;
        }
      });

      setStats({
        totalSimulations: data.length,
        totalValuation: totalVal,
        averageMargin: avgMargin * 100,
        mostExpensiveProduct: expensiveProduct.product_name,
      });

      // 2. Kalkulasi Data Grafik (Dikelompokkan berdasarkan tanggal)
      // Array API biasanya mengurutkan dari yang terbaru, kita balik (reverse) agar grafik berurutan dari kiri ke kanan (lama ke baru)
      const chronologicalData = [...data].reverse();
      const groupedDates: Record<string, number> = {};

      chronologicalData.forEach((item) => {
        const dateObj = new Date(item.created_at);
        const dateStr = dateObj.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        });
        groupedDates[dateStr] = (groupedDates[dateStr] || 0) + 1;
      });

      // Ubah Object ke Array untuk Recharts (Ambil 7 hari aktif terakhir agar grafik tidak terlalu padat)
      const mappedChartData = Object.keys(groupedDates).map((key) => ({
        name: key,
        simulasi: groupedDates[key],
      }));

      setChartData(mappedChartData.slice(-7));
    } catch (err) {
      console.error("Gagal mengambil data dashboard", err);
      toast.error("Gagal menyinkronkan data analitik.");
    } finally {
      setLoading(false);
    }
  };

  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="w-12 h-12 rounded-full border-4 border-gray-100 border-t-[#FF6B00] animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A] pb-20 font-body overflow-x-hidden">
      <Toaster position="top-center" />
      {/* ── FONT IMPORT ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* HEADER SECTION */}
      <header className="relative pt-12 pb-20 px-6">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-linear-to-b from-[#FFC400]/10 via-[#FF6B00]/5 to-transparent blur-[80px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#FF6B00] font-body font-bold text-[10px] uppercase tracking-[0.2em] bg-white px-5 py-2.5 rounded-full border border-gray-200 hover:border-[#FF6B00]/30 active:scale-95 transition-all mb-8 shadow-sm group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Kembali ke Simulator
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-display text-5xl md:text-7xl text-[#0A0A0A] tracking-wide leading-none flex items-center gap-4">
                TRENDING{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FFC400] to-[#DD2C00]">
                  ANALYTICS
                </span>
              </h1>
              <p className="font-body text-gray-400 font-bold text-[11px] uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
                <Activity size={14} className="text-[#FF6B00]" /> PricePoint
                Market Pulse
              </p>
            </div>

            {/* Live Indicator */}
            <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm px-4 py-2 rounded-xl">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4CAF50] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4CAF50]"></span>
              </span>
              <span className="font-body text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Live Data Synchronized
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 relative z-20">
        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Activity}
            label="Volume Simulasi"
            value={`${stats.totalSimulations} Data`}
            color="#FF6B00"
          />
          <StatCard
            icon={TrendingUp}
            label="Total Valuasi Pasar"
            value={`Rp ${stats.totalValuation.toLocaleString("id-ID")}`}
            color="#FFC400"
          />
          <StatCard
            icon={Target}
            label="Rata-rata Margin"
            value={`${stats.averageMargin.toFixed(1)}%`}
            color="#DD2C00"
          />
          <StatCard
            icon={Sparkles}
            label="Trending Produk"
            value={stats.mostExpensiveProduct}
            color="#0A0A0A"
            isSmall
          />
        </div>

        {/* MAIN CHART & ACTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CHART AREA */}
          <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-black/2 border border-gray-100 relative group transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF6B00]/5">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="font-display text-3xl tracking-wider text-[#0A0A0A] flex items-center gap-3">
                  GRAFIK TREN SIMULASI
                </h3>
                <p className="font-body text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                  Pertumbuhan Data Harian
                </p>
              </div>
              <div className="p-3 bg-[#FF6B00]/10 text-[#FF6B00] rounded-2xl group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    chartData.length > 0
                      ? chartData
                      : [{ name: "Belum ada data", simulasi: 0 }]
                  }
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorSimulasi"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#FF6B00" stopOpacity={1} />
                      <stop
                        offset="95%"
                        stopColor="#FFC400"
                        stopOpacity={0.8}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="#F1F5F9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#94A3B8",
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "DM Sans",
                    }}
                    dy={10}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#94A3B8",
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "DM Sans",
                    }}
                  />
                  <Tooltip
                    cursor={{ fill: "#FFF8E1", opacity: 0.5 }}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      fontWeight: 700,
                      fontFamily: "DM Sans",
                    }}
                  />
                  <Bar
                    dataKey="simulasi"
                    fill="url(#colorSimulasi)"
                    radius={[8, 8, 8, 8]}
                    barSize={40}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        className="hover:opacity-80 transition-opacity duration-300"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="lg:col-span-1 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-black/2 border border-gray-100 flex flex-col">
            <h3 className="font-display text-3xl tracking-wider text-[#0A0A0A] mb-2">
              AKSI CEPAT
            </h3>
            <p className="font-body text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">
              Pintasan Engine
            </p>

            <div className="space-y-4 flex-1">
              <ActionButton
                href="/calculator"
                label="Buka Simulator"
                icon={Target}
                color="#FF6B00"
              />
              <ActionButton
                href="/history"
                label="Arsip Data"
                icon={Package}
                color="#0A0A0A"
              />
            </div>

            {/* Smart Tips Card inside Actions */}
            <div className="mt-8 bg-linear-to-br from-[#FFC400]/10 to-[#FF6B00]/10 border border-[#FF6B00]/20 p-6 rounded-2xl relative overflow-hidden">
              <Sparkles
                className="absolute -top-2 -right-2 text-[#FFC400] opacity-50"
                size={40}
              />
              <p className="font-body text-xs font-bold leading-relaxed text-[#0A0A0A]">
                <strong className="text-[#FF6B00] block mb-1 uppercase tracking-widest text-[10px]">
                  Insight Engine:
                </strong>
                {stats.totalSimulations === 0
                  ? "Ayo mulai simulasi pertamamu agar AI kami bisa memberikan saran bisnis!"
                  : `Produk termahalmu sejauh ini adalah ${stats.mostExpensiveProduct}. Coba evaluasi elastisitas harganya!`}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- INTERFACES ---
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  isSmall?: boolean;
}

interface ActionButtonProps {
  href: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

// --- HELPER COMPONENTS ---
const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
  isSmall,
}: StatCardProps) => (
  <div className="bg-white p-6 rounded-4xl shadow-lg shadow-black/2 border border-gray-100 flex items-center gap-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 transition-all duration-300">
    <div
      className="w-16 h-16 rounded-[1.2rem] flex items-center justify-center shrink-0 border border-current/10"
      style={{ backgroundColor: `${color}10`, color: color }}
    >
      <Icon size={28} strokeWidth={2} />
    </div>
    <div className="overflow-hidden">
      <p className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
        {label}
      </p>
      <h3
        className={`font-display text-[#0A0A0A] tracking-wider truncate ${isSmall ? "text-2xl mt-1" : "text-4xl"}`}
      >
        {value}
      </h3>
    </div>
  </div>
);

const ActionButton = ({
  href,
  label,
  icon: Icon,
  color,
}: ActionButtonProps) => (
  <Link
    href={href}
    className="group flex items-center justify-between p-5 bg-[#FAFAFA] rounded-2xl border border-gray-100 hover:border-[#FF6B00]/30 hover:bg-white hover:shadow-lg hover:shadow-[#FF6B00]/5 transition-all duration-300"
  >
    <div className="flex items-center gap-4">
      <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
        <Icon style={{ color: color }} size={20} />
      </div>
      <span className="font-body font-bold text-sm text-gray-800 tracking-wide uppercase">
        {label}
      </span>
    </div>
    <ArrowRight
      className="text-gray-300 group-hover:text-[#FF6B00] group-hover:translate-x-1 transition-all"
      size={18}
    />
  </Link>
);
