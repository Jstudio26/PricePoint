"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Printer,
  Plus,
  Trash2,
  Building2,
  UserCircle,
  Calendar as CalendarIcon,
  Receipt,
  Download,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// --- INTERFACES ---
interface InvoiceItem {
  id: string;
  name: string;
  qty: number;
  price: number;
}

export default function InvoiceGeneratorPage() {
  // State Pengaturan Dokumen
  const [docType, setDocType] = useState<"INVOICE" | "QUOTATION">("INVOICE");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-001");
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // State Klien & Vendor
  const [clientName, setClientName] = useState("PT. Maju Bersama");
  const [clientAddress, setClientAddress] = useState(
    "Jl. Piere Tendean, Manado",
  );
  const vendorName = "PricePoint Analytics";

  // State Items
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: crypto.randomUUID(),
      name: "Kopi Susu Aren Spesial",
      qty: 50,
      price: 25000,
    },
  ]);
  const [includeTax, setIncludeTax] = useState(true);

  // Kalkulasi Otomatis
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const taxAmount = includeTax ? subtotal * 0.12 : 0; // PPN 12% (Regulasi 2025/2026)
  const grandTotal = subtotal + taxAmount;

  const addItem = () => {
    setItems([
      ...items,
      { id: crypto.randomUUID(), name: "", qty: 1, price: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handlePrint = () => {
    if (items.length === 0 || !clientName) {
      return toast.error("Lengkapi data klien dan minimal 1 item!");
    }
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0A0A0A] font-body overflow-x-hidden print:bg-white">
      <Toaster position="top-center" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        
        /* 🖨️ THE MAGIC OF CSS PRINT: Menyembunyikan elemen web saat dicetak ke PDF */
        @media print {
          @page { margin: 0; size: A4 portrait; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .print-container { width: 100% !important; margin: 0 !important; padding: 2cm !important; box-shadow: none !important; border: none !important; }
        }
      `}</style>

      {/* HEADER HERO (Tidak ikut tercetak) */}
      <header className="bg-[#0A0A0A] relative overflow-hidden pt-28 pb-40 px-6 no-print">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-[#1E88E5]/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-[#FFC400]/10 rounded-full blur-[100px]"></div>
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(30,136,229,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(30,136,229,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-[#1E88E5] font-body font-bold text-[10px] uppercase tracking-[0.2em] bg-white/5 px-6 py-3 rounded-full border border-white/10 hover:border-[#1E88E5]/30 active:scale-95 transition-all mb-12 backdrop-blur-md group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Kembali ke Utama
          </Link>

          <h1 className="font-display text-5xl md:text-8xl text-white tracking-wide leading-none mb-6">
            SMART DOCUMENT <br />
            <span
              style={{
                background: "linear-gradient(90deg, #1E88E5, #00ACC1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              GENERATOR
            </span>
          </h1>
          <p className="font-body text-white/50 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Buat Invoice atau Quotation resmi dalam hitungan detik. Siap dicetak
            atau dikirim sebagai PDF ke klien B2B Anda.
          </p>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-32 no-print">
        {/* LEFT: EDITOR & SETTINGS (Tidak ikut tercetak) */}
        <section className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-black/[0.02] border border-gray-100 p-8 sticky top-28">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-[#1E88E5] to-[#00ACC1] text-white rounded-[1rem] shadow-lg shadow-blue-500/20">
                  <FileText size={24} />
                </div>
                <h3 className="font-display text-2xl tracking-wider text-[#0A0A0A]">
                  Data Dokumen
                </h3>
              </div>

              {/* Toggle Invoice vs Quotation */}
              <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                <button
                  onClick={() => setDocType("INVOICE")}
                  className={`px-4 py-2 rounded-lg font-body font-bold text-[10px] uppercase tracking-widest transition-all ${docType === "INVOICE" ? "bg-white text-[#1E88E5] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                >
                  Invoice
                </button>
                <button
                  onClick={() => setDocType("QUOTATION")}
                  className={`px-4 py-2 rounded-lg font-body font-bold text-[10px] uppercase tracking-widest transition-all ${docType === "QUOTATION" ? "bg-white text-[#1E88E5] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                >
                  Quote
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {/* Info Dokumen */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FAFAFA] p-3.5 rounded-2xl border border-gray-100 focus-within:border-[#1E88E5]/50 transition-all">
                  <label className="font-body text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    No. Dokumen
                  </label>
                  <div className="flex items-center gap-2">
                    <Receipt size={14} className="text-gray-400" />
                    <input
                      type="text"
                      className="w-full bg-transparent font-bold text-sm text-[#0A0A0A] outline-none"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="bg-[#FAFAFA] p-3.5 rounded-2xl border border-gray-100 focus-within:border-[#1E88E5]/50 transition-all">
                  <label className="font-body text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                    Tanggal Terbit
                  </label>
                  <div className="flex items-center gap-2">
                    <CalendarIcon size={14} className="text-gray-400" />
                    <input
                      type="date"
                      className="w-full bg-transparent font-bold text-sm text-[#0A0A0A] outline-none"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Info Klien */}
              <div className="bg-[#FAFAFA] p-4 rounded-2xl border border-gray-100 focus-within:border-[#1E88E5]/50 transition-all space-y-3">
                <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block">
                  Informasi Klien (Kepada)
                </label>
                <div className="flex items-center gap-3 border-b border-gray-100 pb-2">
                  <Building2 size={16} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nama Perusahaan / Klien"
                    className="w-full bg-transparent font-bold text-sm text-[#0A0A0A] outline-none"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                <div className="flex items-start gap-3 pt-1">
                  <UserCircle size={16} className="text-gray-400 mt-1" />
                  <textarea
                    placeholder="Alamat Lengkap"
                    rows={2}
                    className="w-full bg-transparent font-medium text-xs text-gray-500 outline-none resize-none"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                  />
                </div>
              </div>

              {/* Input Barang */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    Daftar Item
                  </label>
                  <button
                    onClick={addItem}
                    className="text-[#1E88E5] hover:text-[#00ACC1] font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 transition-colors"
                  >
                    <Plus size={12} /> Tambah
                  </button>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-xl p-3 relative group hover:border-[#1E88E5]/30 transition-colors"
                    >
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <Trash2 size={12} />
                      </button>
                      <input
                        type="text"
                        placeholder="Nama Produk / Jasa"
                        className="w-full bg-transparent font-bold text-sm text-[#0A0A0A] outline-none mb-3 border-b border-dashed border-gray-200 pb-1"
                        value={item.name}
                        onChange={(e) =>
                          updateItem(item.id, "name", e.target.value)
                        }
                      />
                      <div className="flex gap-3">
                        <div className="w-1/3">
                          <label className="text-[8px] font-bold text-gray-400 uppercase">
                            Qty
                          </label>
                          <input
                            type="number"
                            className="w-full bg-gray-50 rounded-lg px-2 py-1.5 outline-none font-bold text-xs"
                            value={item.qty || ""}
                            onChange={(e) =>
                              updateItem(item.id, "qty", Number(e.target.value))
                            }
                          />
                        </div>
                        <div className="w-2/3">
                          <label className="text-[8px] font-bold text-gray-400 uppercase">
                            Harga Satuan (Rp)
                          </label>
                          <input
                            type="number"
                            className="w-full bg-gray-50 rounded-lg px-2 py-1.5 outline-none font-bold text-xs"
                            value={item.price || ""}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "price",
                                Number(e.target.value),
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pajak Toggle */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-body text-[11px] font-bold text-gray-800 uppercase tracking-widest">
                    Terapkan PPN 12%
                  </p>
                  <p className="text-[9px] text-gray-400 mt-0.5">
                    Sesuai UU HPP (Berlaku 2025)
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={includeTax}
                    onChange={() => setIncludeTax(!includeTax)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E88E5]"></div>
                </label>
              </div>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="w-full mt-4 bg-gradient-to-r from-[#1E88E5] to-[#00ACC1] text-white py-4 rounded-2xl font-body font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all active:scale-95"
              >
                <Printer size={18} /> Ekspor PDF / Cetak
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT: A4 PREVIEW (Ini yang akan dicetak) */}
        <section className="lg:col-span-7 overflow-x-auto no-print">
          {/* A4 Paper Container */}
          <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl mx-auto p-[20mm] print-container relative">
            {/* Pita Dekorasi Kop Surat */}
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#1E88E5] via-[#00ACC1] to-[#FFC400]"></div>

            {/* HEADER KERTAS */}
            <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
              <div>
                <h1 className="font-display text-5xl tracking-widest text-[#0A0A0A] mb-1">
                  PRICE<span className="text-[#1E88E5]">POINT</span>
                </h1>
                <p className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">
                  Analytics Cloud
                </p>
                <p className="font-body text-xs text-gray-500 leading-relaxed max-w-[200px]">
                  <strong>{vendorName}</strong>
                  <br />
                  Fakultas Ilmu Sosial & Politik
                  <br />
                  Universitas Sam Ratulangi, Manado
                  <br />
                  Sulawesi Utara, 95115
                </p>
              </div>
              <div className="text-right">
                <h2 className="font-display text-5xl tracking-wider text-gray-200 mb-2">
                  {docType}
                </h2>
                <div className="font-body text-xs text-gray-600 space-y-1">
                  <p>
                    <span className="text-gray-400 font-bold uppercase tracking-widest mr-2 text-[9px]">
                      No Dokumen:
                    </span>{" "}
                    <strong className="text-gray-900">{invoiceNumber}</strong>
                  </p>
                  <p>
                    <span className="text-gray-400 font-bold uppercase tracking-widest mr-2 text-[9px]">
                      Tanggal:
                    </span>{" "}
                    <strong className="text-gray-900">
                      {new Date(issueDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </strong>
                  </p>
                </div>
              </div>
            </div>

            {/* BILL TO */}
            <div className="mb-10">
              <p className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 border-l-2 border-[#1E88E5] pl-2">
                Ditujukan Kepada:
              </p>
              <h4 className="font-body text-lg font-bold text-[#0A0A0A]">
                {clientName || "Nama Klien / Perusahaan"}
              </h4>
              <p className="font-body text-sm text-gray-500 mt-1 max-w-[300px] whitespace-pre-wrap leading-relaxed">
                {clientAddress || "Alamat lengkap klien..."}
              </p>
            </div>

            {/* TABLE ITEMS */}
            <table className="w-full text-left border-collapse mb-10 font-body">
              <thead>
                <tr className="border-y-2 border-gray-900">
                  <th className="py-3 text-[10px] font-bold text-gray-900 uppercase tracking-widest w-[10%]">
                    No
                  </th>
                  <th className="py-3 text-[10px] font-bold text-gray-900 uppercase tracking-widest w-[45%]">
                    Deskripsi Produk / Jasa
                  </th>
                  <th className="py-3 text-[10px] font-bold text-gray-900 uppercase tracking-widest w-[15%] text-center">
                    Qty
                  </th>
                  <th className="py-3 text-[10px] font-bold text-gray-900 uppercase tracking-widest w-[15%] text-right">
                    Harga
                  </th>
                  <th className="py-3 text-[10px] font-bold text-gray-900 uppercase tracking-widest w-[15%] text-right">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-800">
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="py-4 text-gray-400 font-bold">
                        {index + 1}
                      </td>
                      <td className="py-4 font-bold">{item.name || "-"}</td>
                      <td className="py-4 text-center">{item.qty}</td>
                      <td className="py-4 text-right text-gray-500">
                        {item.price.toLocaleString("id-ID")}
                      </td>
                      <td className="py-4 text-right font-bold text-gray-900">
                        {(item.qty * item.price).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-gray-300 font-bold text-xs uppercase tracking-widest"
                    >
                      Belum ada item
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* TOTALS & SIGNATURE */}
            <div className="flex justify-between items-end">
              <div className="w-1/2 pr-8">
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                  <p className="font-body text-[9px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-1">
                    Info Pembayaran
                  </p>
                  <p className="font-body text-xs text-gray-600 leading-relaxed">
                    Transfer via BCA: <strong>1234567890</strong>
                    <br />
                    A.n. Jeremia Paduli
                    <br />
                    Mohon sertakan No. Dokumen pada berita transfer.
                  </p>
                </div>
              </div>

              <div className="w-1/2 space-y-2">
                <div className="flex justify-between font-body text-sm text-gray-600 pb-2 border-b border-gray-100">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
                {includeTax && (
                  <div className="flex justify-between font-body text-sm text-gray-600 pb-2 border-b border-gray-100">
                    <span>PPN (12%)</span>
                    <span className="font-bold text-gray-900">
                      Rp {taxAmount.toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-body text-lg pt-2 items-center">
                  <span className="font-bold text-[#0A0A0A] uppercase tracking-widest text-[11px]">
                    Grand Total
                  </span>
                  <span className="font-display text-4xl text-[#1E88E5] tracking-wider">
                    Rp {grandTotal.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            {/* FOOTER SIGNATURE */}
            <div className="mt-20 flex justify-end">
              <div className="text-center w-48">
                <p className="font-body text-xs text-gray-500 mb-16">
                  Hormat Kami,
                </p>
                <p className="font-body text-sm font-bold text-[#0A0A0A] border-b border-gray-300 pb-1 inline-block min-w-[150px] uppercase">
                  Jeremia Paduli
                </p>
                <p className="font-body text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Founder & Developer
                </p>
              </div>
            </div>

            {/* Pita Bawah */}
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-100"></div>
          </div>
        </section>
      </main>

      {/* 🖨️ THE REAL PRINT CONTAINER (Disembunyikan di layar, muncul saat di-print) */}
      <div className="hidden print-only">
        {/* Konten Kertas A4 di atas secara otomatis akan menempati seluruh halaman kertas saat mode Print diaktifkan oleh CSS */}
      </div>
    </div>
  );
}
