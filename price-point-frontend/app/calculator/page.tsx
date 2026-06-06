"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import api from "@/lib/axios";
import { SimulationResult } from "@/types";
import {
  Save,
  Percent,
  TrendingDown,
  Layers,
  Package,
  Copy,
  Coffee,
  Zap,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import CountUp from "react-countup";
import toast, { Toaster } from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
} from "recharts";
import Link from "next/link";
import ToolGuide from "@/components/ToolGuide";

export default function CalculatorPage() {
  const { isAuthenticated, isInitialized } = useAuth();
  const [inputs, setInputs] = useState({
    hpp: 0,
    opex: 0,
    margin: 20,
    include_tax: true,
    product_name: "",
  });

  const [discount, setDiscount] = useState(0);
  const [targetUnits, setTargetUnits] = useState(1);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const prevPriceRef = useRef(0);

  // --- THEME LOGIC (Diambil dari warna Landing Page) ---
  const isCoffeeItem = inputs.product_name.toLowerCase().includes("kopi");
  const themeGradient = isCoffeeItem
    ? "bg-gradient-to-r from-[#D2B48C] via-[#A67B5B] to-[#6F4E37]"
    : "bg-gradient-to-r from-[#FFC400] via-[#FF6B00] to-[#DD2C00]"; // Gradient Landing Page
  const themeText = isCoffeeItem ? "text-[#6F4E37]" : "text-[#FF6B00]";
  const themeBorder = isCoffeeItem ? "border-[#A67B5B]" : "border-[#FF6B00]";
  const themeAccent = isCoffeeItem ? "accent-[#6F4E37]" : "accent-[#FF6B00]";

  // --- LOGIKA DATA CHART ---
  const getChartData = () => {
    if (!result) return [];
    const profit = Number(result.price_before_tax) - Number(result.total_cost);
    const tax = inputs.include_tax ? Number(result.final_price) * 0.12 : 0;

    return [
      { name: "Modal (HPP)", value: Number(inputs.hpp), color: "#E2E8F0" },
      { name: "Operasional", value: Number(inputs.opex), color: "#CBD5E1" },
      { name: "Pajak (PPN)", value: tax, color: "#94A3B8" },
      {
        name: "Profit Murni",
        value: profit > 0 ? profit : 0,
        color: isCoffeeItem ? "#6F4E37" : "#FF6B00",
      },
    ];
  };

  // --- LOGIKA SMART INSIGHT ---
  const getSmartInsight = () => {
    if (!result || inputs.hpp === 0)
      return "Masukkan data untuk memulai analisis algoritma Inverse Margin...";
    const profit = Number(result.price_before_tax) - Number(result.total_cost);

    if (profit <= 0)
      return "⚠️ Sistem mendeteksi potensi kerugian. Segera naikkan margin Anda!";
    if (inputs.margin > 50)
      return "🔥 Margin premium terdeteksi. Pastikan value produk selaras dengan harga.";
    if (isCoffeeItem)
      return "☕ Sektor F&B (Kopi) optimal di volume penjualan. Gunakan proyeksi skala di bawah.";
    return "✅ Struktur harga terkalibrasi. Harga jual optimal untuk dipasarkan.";
  };

  const getProfitStatus = () => {
    const margin = inputs.margin;
    if (margin >= 30)
      return {
        label: "Premium Profit",
        color: "text-[#4CAF50]",
        bg: "bg-[#4CAF50]",
      };
    if (margin >= 15)
      return {
        label: "Healthy Margin",
        color: "text-blue-600",
        bg: "bg-blue-500",
      };
    return {
      label: "Critical Margin",
      color: "text-red-600",
      bg: "bg-red-500",
    };
  };
  const status = getProfitStatus();

  const handleNumericChange = (field: string, value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    let numValue = cleanValue === "" ? 0 : Number(cleanValue);
    if (field === "margin" && numValue >= 100) numValue = 99;
    setInputs({ ...inputs, [field]: numValue });
  };

  const calculatePrice = useCallback(async () => {
    try {
      const res = await api.post("/calculate", {
        hpp: Number(inputs.hpp),
        opex: Number(inputs.opex),
        margin: Number(inputs.margin) / 100,
        include_tax: inputs.include_tax,
      });
      setResult((prevResult) => {
        if (prevResult) prevPriceRef.current = Number(prevResult.final_price);
        return res.data.data;
      });
    } catch {
      toast.error("Gagal terhubung ke Engine Server!");
    }
  }, [inputs]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputs.hpp > 0 || inputs.opex > 0) calculatePrice();
    }, 500);
    return () => clearTimeout(timer);
  }, [inputs, calculatePrice]);

  const handleCopy = () => {
    if (!result) return;
    const text = `PricePoint Report 🚀\nProduk: ${inputs.product_name || "Tanpa Nama"}\nHarga: Rp ${Number(result.final_price).toLocaleString("id-ID")}\nSimulasi by Jeremia Paduli`;
    navigator.clipboard.writeText(text);
    toast.success("Laporan disalin ke clipboard!");
  };

  const handleSave = async () => {
    if (!isAuthenticated) return toast.error("Autentikasi diperlukan!");
    if (!inputs.product_name)
      return toast.error("Identitas produk tidak boleh kosong!");
    setIsSaving(true);
    try {
      await api.post("/simulations/save", {
        ...inputs,
        product_name: inputs.product_name,
        final_price: Number(result?.final_price),
      });
      toast.success("Tersimpan di Cloud Database!");
    } catch {
      toast.error("Gagal sinkronisasi data.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (!result) return toast.error("Kalkulasi belum selesai!");
    const profit = Number(result.price_before_tax) - Number(result.total_cost);
    const reportData = [
      ["Parameter", "Nilai"],
      ["Nama Produk", inputs.product_name || "Tanpa Nama"],
      ["HPP Modal", inputs.hpp],
      ["Operasional", inputs.opex],
      ["Margin (%)", `${inputs.margin}%`],
      ["Pajak (PPN 12%)", inputs.include_tax ? "Ya" : "Tidak"],
      ["-------------------", "-------------------"],
      ["HARGA JUAL REKOMENDASI", result.final_price],
      ["Profit per Unit", profit > 0 ? profit : 0],
      ["Total Omset (Skala)", Number(result.final_price) * targetUnits],
      ["Tanggal Simulasi", new Date().toLocaleDateString("id-ID")],
    ];
    const csvContent =
      "data:text/csv;charset=utf-8," +
      reportData.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `PricePoint_${inputs.product_name || "Report"}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV berhasil dibuat!");
  };

  if (!isInitialized)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Zap className="animate-pulse text-[#FF6B00]" size={48} />
      </div>
    );

  return (
    <div className="bg-[#FAFAFA] text-[#0A0A0A] min-h-screen pb-32 transition-colors duration-500 font-body">
      {/* MENGIMPOR FONT DARI LANDING PAGE */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <Toaster position="top-center" />

      {/* TOP NAVIGATION */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 hover:text-[#FF6B00] transition-colors font-bold text-sm uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Kembali ke Home
          </Link>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${isAuthenticated ? "bg-[#4CAF50]" : "bg-gray-300"} animate-pulse`}
            />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {isAuthenticated ? "Engine Connected" : "Guest Mode"}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        <div className="lg:col-span-12">
          <ToolGuide
            title="Gunakan kalkulator harga jual"
            description="Masukkan data biaya dan margin di panel kiri untuk melihat rekomendasi harga jual secara otomatis."
            items={[
              "Isi HPP, OPEX, margin, dan nama produk.",
              "Pilih apakah harga sudah termasuk PPN 12%.",
              "Harga jual rekomendasi muncul otomatis saat data terisi.",
              "Salin, ekspor CSV, atau simpan hasil jika diperlukan.",
            ]}
          />
        </div>
        {/* LEFT: INPUT */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.02] relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-[#FF6B00]/5">
            <div
              className={`absolute top-0 left-0 w-full h-1.5 ${themeGradient}`}
            ></div>
            <h2 className="font-body text-lg font-bold mb-8 uppercase tracking-widest flex items-center gap-2 text-gray-800">
              {isCoffeeItem ? (
                <Coffee size={20} className={themeText} />
              ) : (
                <Package size={20} className={themeText} />
              )}
              Parameter Engine
            </h2>

            <div className="space-y-6">
              <div>
                <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">
                  Identitas Produk
                </label>
                <input
                  type="text"
                  placeholder="Misal: Kopi Susu Aren"
                  className="w-full p-3 text-lg font-bold border-b-2 border-gray-100 focus:border-[#FF6B00] outline-none transition-all bg-transparent"
                  value={inputs.product_name}
                  onChange={(e) =>
                    setInputs({ ...inputs, product_name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">
                    HPP Dasar
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 text-2xl font-bold border-b-2 border-gray-100 focus:border-[#FF6B00] outline-none bg-transparent"
                    value={Math.round(inputs.hpp).toLocaleString("id-ID")}
                    onChange={(e) => handleNumericChange("hpp", e.target.value)}
                  />
                </div>
                <div>
                  <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">
                    Biaya OPEX
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 text-2xl font-bold border-b-2 border-gray-100 focus:border-[#FF6B00] outline-none bg-transparent"
                    value={Math.round(inputs.opex).toLocaleString("id-ID")}
                    onChange={(e) =>
                      handleNumericChange("opex", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">
                  Target Margin
                </label>
                <div className="flex items-center gap-3 bg-gray-50/50 border border-gray-100 p-4 rounded-2xl mt-1 focus-within:border-[#FF6B00] transition-colors">
                  <Percent size={20} className={themeText} />
                  <input
                    type="text"
                    className="w-full bg-transparent text-3xl font-display tracking-wider outline-none text-gray-800"
                    value={inputs.margin}
                    onChange={(e) =>
                      handleNumericChange("margin", e.target.value)
                    }
                  />
                </div>

                <div className="mt-4">
                  <div className="flex justify-between font-body text-[10px] font-bold uppercase tracking-widest mb-2">
                    <span className={status.color}>{status.label}</span>
                    <span className="text-gray-400">{inputs.margin}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${status.bg}`}
                      style={{ width: `${inputs.margin}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT: DISPLAY & VISUALS */}
        <section className="lg:col-span-8 space-y-6">
          {/* MAIN PRICE CARD */}
          <div
            className={`bg-white rounded-[3.5rem] shadow-2xl shadow-black/[0.03] border ${themeBorder} p-12 relative overflow-hidden text-center transition-all duration-500`}
          >
            {/* Background Glow */}
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 ${themeGradient} opacity-[0.03] blur-3xl rounded-full`}
            ></div>

            {isCoffeeItem && (
              <Coffee
                size={180}
                className="absolute -top-10 -left-10 text-[#6F4E37] opacity-5 -rotate-12"
              />
            )}

            <div className="absolute top-8 right-8 flex gap-2">
              <button
                onClick={handleCopy}
                className="p-3 bg-gray-50 border border-gray-100 text-gray-400 hover:text-[#FF6B00] rounded-2xl transition-all shadow-sm"
              >
                <Copy size={18} />
              </button>
            </div>

            <p
              className={`font-body font-bold tracking-[0.3em] text-[10px] mb-6 uppercase ${themeText}`}
            >
              Final Retail Price
            </p>
            <div className="flex items-baseline justify-center gap-4 mb-14 relative z-10">
              <span className="font-body text-2xl font-bold text-gray-300 uppercase">
                Rp
              </span>
              <h1
                className={`font-display text-8xl md:text-[10rem] tracking-wide leading-none ${isCoffeeItem ? "text-[#6F4E37]" : "text-[#0A0A0A]"}`}
              >
                <CountUp
                  start={prevPriceRef.current}
                  end={result ? Number(result.final_price) : 0}
                  separator="."
                  duration={1.5}
                />
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              <button
                onClick={handleSave}
                disabled={isSaving || !result}
                className={`w-full ${themeGradient} text-white py-5 rounded-2xl text-sm font-body font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:shadow-[#FF6B00]/20 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 uppercase tracking-widest`}
              >
                <Save size={18} />{" "}
                {isSaving ? "Sinkronisasi..." : "Simpan Simulasi"}
              </button>

              <button
                onClick={handleExport}
                disabled={!result}
                className="w-full bg-white border-2 border-gray-100 text-gray-600 py-5 rounded-2xl text-sm font-body font-bold flex items-center justify-center gap-3 hover:border-gray-200 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest"
              >
                <Layers size={18} /> Download Laporan
              </button>
            </div>
          </div>

          {/* VISUAL BREAKDOWN & INSIGHT SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CHART CARD */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-lg shadow-black/[0.02] border border-gray-100 flex flex-col md:flex-row items-center gap-8">
              <div className="w-full h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getChartData()}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {getChartData().map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                  <span className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Profit
                  </span>
                  <span className={`font-display text-2xl ${themeText}`}>
                    {inputs.margin}%
                  </span>
                </div>
              </div>
              <div className="w-full space-y-3">
                <h4 className="font-body font-bold uppercase text-[10px] tracking-[0.2em] text-gray-400 mb-4">
                  Distribusi Biaya
                </h4>
                {getChartData().map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border-b border-gray-50 pb-2"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-sm"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="font-body text-[11px] font-bold uppercase text-gray-500 tracking-wider">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-body text-xs font-bold text-gray-800">
                      Rp {Math.round(item.value).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SMART INSIGHT CARD (Mengambil style gelap dari LP untuk kontras) */}
            <div
              className={`rounded-[2.5rem] p-8 shadow-2xl text-white flex flex-col justify-between relative overflow-hidden transition-colors ${isCoffeeItem ? "bg-[#3E2723]" : "bg-[#0A0A0A]"}`}
            >
              <div
                className={`absolute top-0 right-0 w-32 h-32 ${themeGradient} opacity-20 blur-3xl rounded-full`}
              ></div>
              <Sparkles
                className="absolute top-6 right-6 text-white/10"
                size={40}
              />

              <div>
                <h4 className="font-body font-bold uppercase text-[10px] tracking-[0.2em] text-white/40 mb-6">
                  Insight Engine
                </h4>
                <p className="font-body text-sm font-medium leading-relaxed text-white/90">
                  &quot;{getSmartInsight()}&quot;
                </p>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                  <Zap size={14} className="text-[#FFC400]" />
                </div>
                <span className="font-body text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                  PricePoint AI
                </span>
              </div>
            </div>
          </div>

          {/* SECONDARY TOOLS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-lg shadow-black/[0.02] border border-gray-100">
              <h3 className="font-body text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 mb-6 text-red-500">
                <TrendingDown size={16} /> Simulator Diskon
              </h3>
              <input
                type="range"
                className={`w-full ${themeAccent} mb-6`}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
              <div className="flex justify-between items-end">
                <p className="font-display text-5xl text-red-500 tracking-wide">
                  {discount}%
                </p>
                <p className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-1">
                  Potongan Harga
                </p>
              </div>
            </div>
            <div className="bg-white rounded-[2.5rem] p-8 shadow-lg shadow-black/[0.02] border border-gray-100">
              <h3 className="font-body text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 mb-6 text-blue-500">
                <Layers size={16} /> Proyeksi Skala
              </h3>
              <input
                type="number"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-display text-3xl tracking-widest outline-none focus:border-blue-300 transition-all text-gray-800"
                value={targetUnits}
                onChange={(e) => setTargetUnits(Number(e.target.value))}
              />
              <div className="flex justify-between items-center mt-6">
                <p className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Total Omset
                </p>
                <p className="font-body text-sm font-bold text-blue-600">
                  Rp{" "}
                  {(result
                    ? Number(result.final_price) * targetUnits
                    : 0
                  ).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
