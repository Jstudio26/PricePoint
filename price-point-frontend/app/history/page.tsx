"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { SimulationHistory } from "@/types";
import {
  TrendingUp,
  Trash2,
  Calendar,
  Package,
  ArrowLeft,
  Search,
  Filter,
  Download,
  BarChart3,
  Database,
} from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function HistoryPage() {
  const { isInitialized, isAuthenticated } = useAuth();
  const [history, setHistory] = useState<SimulationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchHistory = async () => {
    try {
      const res = await api.get("/simulations/history");
      setHistory(res.data.data || []);
    } catch (err) {
      console.error("Gagal ambil history", err);
      toast.error("Gagal memuat data dari Atlas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      fetchHistory();
    }
  }, [isInitialized, isAuthenticated]);

  const deleteItem = async (id: string) => {
    if (!confirm("Hapus simulasi ini dari Atlas secara permanen?")) return;
    try {
      await api.delete(`/simulations/${id}`);
      setHistory(history.filter((item) => item.id !== id));
      toast.success("Data berhasil dihapus!");
    } catch {
      toast.error("Gagal menghapus data.");
    }
  };

  const filteredHistory = history.filter((item) =>
    item.product_name.toLowerCase().includes(search.toLowerCase()),
  );

  // Statistik Sederhana
  const totalValuation = history.reduce(
    (acc, curr) => acc + curr.final_price,
    0,
  );
  const avgMargin =
    history.length > 0
      ? (history.reduce((acc, curr) => acc + curr.margin, 0) / history.length) *
        100
      : 0;

  if (!isInitialized || loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="w-12 h-12 rounded-full border-4 border-gray-100 border-t-[#FF6B00] animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A] pb-32 font-body overflow-x-hidden">
      <Toaster position="top-center" />

      {/* ── FONT IMPORT ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* HEADER HERO (SaaS Dark Mode Style) */}
      <header className="bg-[#0A0A0A] relative overflow-hidden pt-28 pb-40 px-6">
        {/* Background Mesh */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#FFC400]/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-[#DD2C00]/20 rounded-full blur-[100px]"></div>
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

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 text-white/50 hover:text-[#FFC400] font-body font-bold text-[10px] uppercase tracking-[0.2em] bg-white/5 px-6 py-3 rounded-full border border-white/10 hover:border-[#FFC400]/30 active:scale-95 transition-all mb-8 backdrop-blur-md group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />{" "}
              Kembali ke Simulator
            </Link>
            <h1 className="font-display text-5xl md:text-7xl text-white tracking-wide leading-none">
              SIMULATION <br className="hidden md:block" />
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #FFC400, #FF6B00, #DD2C00)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ARCHIVE
              </span>
            </h1>
            <p className="font-body text-white/40 font-bold text-[11px] uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
              <Database size={14} className="text-[#FFC400]" /> MongoDB Atlas
              Synchronized
            </p>
          </div>
          <button
            onClick={() =>
              toast("Fitur Export akan segera hadir!", { icon: "🚧" })
            }
            className="bg-white hover:bg-gray-100 text-[#0A0A0A] px-6 py-3.5 rounded-2xl font-body font-bold text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-white/5 group"
          >
            <Download
              size={16}
              className="group-hover:-translate-y-0.5 transition-transform"
            />{" "}
            Export CSV
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        {/* STATS CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-lg shadow-black/[0.02] border border-gray-100 flex items-center gap-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 transition-all duration-300">
            <div className="w-16 h-16 bg-[#FFC400]/10 rounded-[1.2rem] flex items-center justify-center text-[#FFC400] shrink-0 border border-[#FFC400]/20">
              <Package size={28} />
            </div>
            <div>
              <p className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
                Total Arsip
              </p>
              <h3 className="font-display text-4xl text-[#0A0A0A] tracking-wider">
                {history.length}{" "}
                <span className="text-xl text-gray-400">Data</span>
              </h3>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-lg shadow-black/[0.02] border border-gray-100 flex items-center gap-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 transition-all duration-300">
            <div className="w-16 h-16 bg-[#FF6B00]/10 rounded-[1.2rem] flex items-center justify-center text-[#FF6B00] shrink-0 border border-[#FF6B00]/20">
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
                Valuasi Total
              </p>
              <h3 className="font-display text-4xl text-[#0A0A0A] tracking-wider">
                <span className="text-xl text-gray-400 mr-1">Rp</span>
                {totalValuation.toLocaleString("id-ID")}
              </h3>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-lg shadow-black/[0.02] border border-gray-100 flex items-center gap-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 transition-all duration-300">
            <div className="w-16 h-16 bg-[#DD2C00]/10 rounded-[1.2rem] flex items-center justify-center text-[#DD2C00] shrink-0 border border-[#DD2C00]/20">
              <BarChart3 size={28} />
            </div>
            <div>
              <p className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
                Rata-rata Margin
              </p>
              <h3 className="font-display text-4xl text-[#0A0A0A] tracking-wider">
                {avgMargin.toFixed(1)}
                <span className="text-2xl text-gray-400">%</span>
              </h3>
            </div>
          </div>
        </div>

        {/* BENTO TABLE AREA */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-black/[0.02] overflow-hidden border border-gray-100">
          {/* Table Toolbar */}
          <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between bg-white items-center">
            <div className="relative flex-1 w-full max-w-md">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari identitas produk..."
                className="w-full pl-12 pr-4 py-3.5 bg-[#FAFAFA] rounded-2xl outline-none border border-gray-100 focus:border-[#FF6B00]/50 focus:bg-white transition-all font-body font-bold text-gray-800 placeholder:text-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none p-3.5 bg-[#FAFAFA] rounded-2xl text-gray-400 hover:text-[#FF6B00] transition-colors border border-gray-100 hover:border-[#FF6B00]/30 hover:bg-orange-50 flex items-center justify-center gap-2 group">
                <Filter size={18} />
                <span className="font-body font-bold text-[10px] uppercase tracking-[0.2em] group-hover:text-[#FF6B00]">
                  Filter
                </span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFAFA]">
                  <th className="p-6 font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    Produk & Riwayat
                  </th>
                  <th className="p-6 font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    Struktur Biaya
                  </th>
                  <th className="p-6 font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-center">
                    Margin
                  </th>
                  <th className="p-6 font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">
                    Harga Final (RRP)
                  </th>
                  <th className="p-6 font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredHistory.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-[#FFC400]/5 transition-colors duration-300"
                  >
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-body font-bold text-gray-900 text-lg group-hover:text-[#FF6B00] transition-colors">
                          {item.product_name}
                        </span>
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1.5 font-medium">
                          <Calendar size={12} className="text-gray-300" />
                          {new Date(item.created_at).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                          <span className="font-body text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            HPP:{" "}
                            <strong className="text-gray-800">
                              Rp {item.hpp.toLocaleString("id-ID")}
                            </strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                          <span className="font-body text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            OPEX:{" "}
                            <strong className="text-gray-800">
                              Rp {item.opex.toLocaleString("id-ID")}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className="inline-block px-3 py-1 rounded-lg bg-[#4CAF50]/10 text-[#4CAF50] font-body font-bold text-[11px] tracking-widest border border-[#4CAF50]/20">
                        {item.margin * 100}%
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <span className="font-display text-3xl text-[#0A0A0A] tracking-wider group-hover:text-[#DD2C00] transition-colors">
                        Rp {item.final_price.toLocaleString("id-ID")}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90 border border-transparent hover:border-red-100"
                        title="Hapus Data"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredHistory.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-gray-300 border border-gray-100">
                          <Database size={32} />
                        </div>
                        <p className="font-body text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">
                          {search
                            ? "Data tidak ditemukan"
                            : "Belum ada arsip simulasi"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
