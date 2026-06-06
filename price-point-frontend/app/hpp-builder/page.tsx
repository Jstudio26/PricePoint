"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChefHat,
  Plus,
  Trash2,
  Save,
  Scale,
  Package,
} from "lucide-react";
import ToolGuide from "@/components/ToolGuide";
import toast, { Toaster } from "react-hot-toast";

// --- INTERFACES ---
interface Ingredient {
  id: string;
  name: string;
  buyPrice: number;
  buyQty: number;
  unit: string;
  useQty: number;
}

export default function HppBuilderPage() {
  const [productName, setProductName] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  // 🔥 DERIVED STATE: Kalkulasi langsung tanpa useState + tanpa useMemo
  const totalHpp = ingredients.reduce((total, item) => {
    if (item.buyQty > 0) {
      const costPerUnit = item.buyPrice / item.buyQty;
      return total + costPerUnit * item.useQty;
    }
    return total;
  }, 0);

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: crypto.randomUUID(),
      name: "",
      buyPrice: 0,
      buyQty: 1,
      unit: "gram",
      useQty: 1,
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((item) => item.id !== id));
  };

  const updateIngredient = (
    id: string,
    field: keyof Ingredient,
    value: string | number,
  ) => {
    setIngredients(
      ingredients.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  // 🔥 totalHpp dihitung otomatis dari ingredients - no need for useEffect!

  const handleSaveToSimulator = () => {
    if (!productName) return toast.error("Isi nama produk/resep dulu!");
    if (ingredients.length === 0)
      return toast.error("Tambahkan minimal 1 bahan baku!");

    // Simpan ke local storage agar bisa ditarik oleh Kalkulator Utama nanti
    localStorage.setItem("pricepoint_hpp_transfer", totalHpp.toString());
    localStorage.setItem("pricepoint_hpp_name", productName);

    toast.success("HPP Berhasil dikunci! Siap digunakan di Simulator.");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A] pb-32 font-body overflow-x-hidden">
      <Toaster position="top-center" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* HEADER HERO */}
      <header className="bg-[#0A0A0A] relative overflow-hidden pt-28 pb-40 px-6">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#FFC400]/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-[#DD2C00]/20 rounded-full blur-[100px]"></div>
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
            className="inline-flex items-center gap-2 text-white/50 hover:text-[#FFC400] font-body font-bold text-[10px] uppercase tracking-[0.2em] bg-white/5 px-6 py-3 rounded-full border border-white/10 hover:border-[#FFC400]/30 active:scale-95 transition-all mb-12 backdrop-blur-md group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Kembali ke Simulator
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 text-center md:text-left">
            <div>
              <h1 className="font-display text-5xl md:text-8xl text-white tracking-wide leading-none mb-4">
                RECIPE & BOM <br />
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, #FFC400, #FF6B00, #DD2C00)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  BUILDER
                </span>
              </h1>
              <p className="font-body text-white/50 text-lg font-medium max-w-2xl leading-relaxed">
                Bedah struktur biaya bahan bakumu sampai ke satuan terkecil.
                Akurasi HPP adalah kunci dari margin yang tidak bocor.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-3xl text-right shrink-0 min-w-[280px]">
              <p className="font-body text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">
                Total Harga Pokok (HPP)
              </p>
              <h2 className="font-display text-5xl text-[#FFC400] tracking-wider">
                <span className="text-2xl text-white/50 mr-1">Rp</span>
                {totalHpp.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
              </h2>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="mb-8">
          <ToolGuide
            title="Bangun HPP resep produk Anda"
            description="Catat semua bahan baku agar total HPP produk muncul secara akurat dan bisa ditransfer ke kalkulator utama."
            items={[
              "Isi nama produk sebelum menambahkan bahan.",
              "Tambah bahan baku, harga beli, dan jumlah pakai.",
              "Total HPP dihitung otomatis setiap kali data diubah.",
              "Klik Kunci HPP untuk menyimpan nilai ke simulator utama.",
            ]}
          />
        </div>
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-black/3 border border-gray-100 overflow-hidden">
          {/* TOOLBAR */}
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-6 justify-between items-center bg-[#FAFAFA]">
            <div className="w-full md:max-w-md flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 focus-within:border-[#FF6B00]/50 transition-colors shadow-sm">
              <div className="p-3 bg-[#FF6B00]/10 text-[#FF6B00] rounded-xl">
                <ChefHat size={20} />
              </div>
              <input
                type="text"
                placeholder="Nama Resep / Produk (Misal: Kopi Aren)"
                className="w-full bg-transparent font-body font-bold text-gray-800 outline-none uppercase"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={addIngredient}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#FAFAFA] border border-gray-200 hover:border-[#FF6B00]/50 hover:text-[#FF6B00] text-gray-600 px-6 py-4 rounded-2xl font-body font-bold text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 group"
              >
                <Plus
                  size={16}
                  className="group-hover:rotate-90 transition-transform"
                />{" "}
                Tambah Bahan
              </button>
              <button
                onClick={handleSaveToSimulator}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#0A0A0A] hover:bg-gray-800 text-white px-6 py-4 rounded-2xl font-body font-bold text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg"
              >
                <Save size={16} /> Kunci HPP
              </button>
            </div>
          </div>

          {/* INGREDIENTS LIST */}
          <div className="p-8">
            {ingredients.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-4xl bg-[#FAFAFA]">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="font-display text-3xl text-gray-400 tracking-wider mb-2">
                  Panci Masih Kosong
                </h3>
                <p className="font-body text-gray-400 text-sm">
                  Klik tombol &quot;Tambah Bahan&quot; untuk mulai membedah HPP
                  produksimu.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Header Kolom (Desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 pb-2 border-b border-gray-100 font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  <div className="col-span-4">Nama Bahan Baku</div>
                  <div className="col-span-3 text-center">
                    Harga Beli (Modal)
                  </div>
                  <div className="col-span-3 text-center">Porsi Digunakan</div>
                  <div className="col-span-2 text-right">Biaya Asli</div>
                </div>

                {/* Daftar Bahan */}
                {ingredients.map((item, index) => {
                  const itemCost =
                    item.buyQty > 0
                      ? (item.buyPrice / item.buyQty) * item.useQty
                      : 0;

                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#FFC400]/50 transition-all items-center group"
                    >
                      {/* Nama Bahan */}
                      <div className="md:col-span-4">
                        <label className="md:hidden font-body text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">
                          Nama Bahan
                        </label>
                        <input
                          type="text"
                          placeholder={`Bahan ke-${index + 1} (Misal: Kopi Bubuk)`}
                          className="w-full bg-[#FAFAFA] border border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-[#FF6B00]/50 font-bold text-sm text-gray-800"
                          value={item.name}
                          onChange={(e) =>
                            updateIngredient(item.id, "name", e.target.value)
                          }
                        />
                      </div>

                      {/* Harga Beli */}
                      <div className="md:col-span-3 flex gap-2">
                        <div className="w-full">
                          <label className="md:hidden font-body text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">
                            Harga Beli
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-[10px]">
                              Rp
                            </span>
                            <input
                              type="number"
                              placeholder="Harga"
                              className="w-full bg-[#FAFAFA] border border-gray-100 rounded-xl pl-8 pr-3 py-3 outline-none focus:border-[#FF6B00]/50 font-bold text-sm text-gray-800"
                              value={item.buyPrice || ""}
                              onChange={(e) =>
                                updateIngredient(
                                  item.id,
                                  "buyPrice",
                                  Number(e.target.value),
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="w-full">
                          <label className="md:hidden font-body text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">
                            Per Jumlah
                          </label>
                          <input
                            type="number"
                            placeholder="Qty Beli"
                            className="w-full bg-[#FAFAFA] border border-gray-100 rounded-xl px-3 py-3 outline-none focus:border-[#FF6B00]/50 font-bold text-sm text-gray-800 text-center"
                            value={item.buyQty || ""}
                            onChange={(e) =>
                              updateIngredient(
                                item.id,
                                "buyQty",
                                Number(e.target.value),
                              )
                            }
                          />
                        </div>
                      </div>

                      {/* Porsi Dipakai */}
                      <div className="md:col-span-3 flex gap-2">
                        <div className="w-full">
                          <label className="md:hidden font-body text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">
                            Porsi Dipakai
                          </label>
                          <div className="relative">
                            <Scale
                              size={14}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FF6B00]"
                            />
                            <input
                              type="number"
                              placeholder="Takaran"
                              className="w-full bg-orange-50/50 border border-orange-100 rounded-xl pl-8 pr-3 py-3 outline-none focus:border-[#FF6B00]/50 font-bold text-sm text-[#DD2C00]"
                              value={item.useQty || ""}
                              onChange={(e) =>
                                updateIngredient(
                                  item.id,
                                  "useQty",
                                  Number(e.target.value),
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="w-full">
                          <label className="md:hidden font-body text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">
                            Satuan
                          </label>
                          <select
                            className="w-full bg-[#FAFAFA] border border-gray-100 rounded-xl px-2 py-3 outline-none focus:border-[#FF6B00]/50 font-bold text-sm text-gray-800 cursor-pointer"
                            value={item.unit}
                            onChange={(e) =>
                              updateIngredient(item.id, "unit", e.target.value)
                            }
                          >
                            <option value="gram">Gram (g)</option>
                            <option value="ml">Mili (ml)</option>
                            <option value="pcs">Pcs</option>
                          </select>
                        </div>
                      </div>

                      {/* Hasil Biaya Asli & Delete */}
                      <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0">
                        <div className="md:text-right">
                          <label className="md:hidden font-body text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">
                            Biaya Asli
                          </label>
                          <p className="font-display text-2xl tracking-wider text-[#0A0A0A]">
                            Rp{" "}
                            {itemCost.toLocaleString("id-ID", {
                              maximumFractionDigits: 0,
                            })}
                          </p>
                        </div>
                        <button
                          onClick={() => removeIngredient(item.id)}
                          className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90 opacity-100 md:opacity-0 group-hover:opacity-100 border border-transparent hover:border-red-100"
                          title="Hapus Bahan"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
