"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import {
  Mail,
  Lock,
  ArrowRight,
  UserPlus,
  LogIn,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AxiosError } from "axios";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const endpoint = isRegister ? "/register" : "/login";

    try {
      const res = await api.post(endpoint, { email, password });

      if (isRegister) {
        setSuccess("Akun berhasil dibuat! Silakan login, Jere.");
        setIsRegister(false);
      } else {
        login(res.data.token);
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ error: string }>;
      setError(
        axiosError.response?.data?.error ||
          "Terjadi kesalahan pada sistem Atlas.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] relative overflow-hidden px-4 font-body">
      {/* ── FONT IMPORT ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* BACKGROUND DECORATION (SaaS Glow) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-[#FFC400]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] bg-[#DD2C00]/10 rounded-full blur-[100px]"></div>
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

      <div className="w-full max-w-md z-10">
        {/* TOMBOL KEMBALI */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-[#FF6B00] font-body font-bold text-[10px] uppercase tracking-[0.2em] bg-white/50 px-4 py-2.5 rounded-full border border-gray-200 hover:border-[#FF6B00]/30 active:scale-95 transition-all backdrop-blur-md group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Kembali ke Utama
          </Link>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-black/[0.03] border border-gray-100 p-8 md:p-12 relative overflow-hidden transition-all duration-500">
          {/* HEADER STRIP GRADASI API */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FFC400] via-[#FF6B00] to-[#DD2C00]"></div>

          <div className="text-center mb-10">
            {/* LOGO BARU PRICEPOINT (Matching Navbar) */}
            <div className="bg-gradient-to-br from-[#FFC400] to-[#DD2C00] p-[2px] rounded-[1.2rem] shadow-lg shadow-orange-500/10 inline-block mb-6">
              <div className="bg-white p-3 rounded-2xl flex items-center justify-center overflow-hidden w-16 h-16 relative">
                <Image
                  src="/price.svg"
                  alt="PricePoint Logo"
                  fill
                  className="object-contain p-2"
                  priority
                />
              </div>
            </div>

            <h1 className="font-display text-5xl tracking-wide text-[#0A0A0A] leading-none mb-2">
              {isRegister ? (
                <>
                  CREATE <span className="text-[#DD2C00]">ACCOUNT</span>
                </>
              ) : (
                <>
                  WELCOME <span className="text-[#FF6B00]">BACK</span>
                </>
              )}
            </h1>
            <p className="font-body text-gray-400 font-bold text-[9px] uppercase tracking-[0.3em]">
              PricePoint Analytics Cloud
            </p>
          </div>

          {error && (
            <div className="bg-red-50/80 border border-red-100 text-red-600 p-4 mb-8 rounded-2xl text-[11px] font-bold tracking-wide flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
              {error}
            </div>
          )}

          {success && (
            <div className="bg-[#4CAF50]/10 border border-[#4CAF50]/20 text-[#4CAF50] p-4 mb-8 rounded-2xl text-[11px] font-bold tracking-wide flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4CAF50] animate-pulse"></div>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1 block">
                Email Kampus / Bisnis
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#FF6B00] transition-colors"
                  size={20}
                />
                <input
                  type="email"
                  required
                  placeholder="name@student.unsrat.ac.id"
                  className="w-full pl-12 pr-4 py-4 bg-[#FAFAFA] rounded-2xl outline-none border border-gray-100 focus:border-[#FF6B00]/50 focus:bg-white transition-all font-body font-bold text-gray-800 placeholder:text-gray-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-body text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1 block">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#FF6B00] transition-colors"
                  size={20}
                />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-[#FAFAFA] rounded-2xl outline-none border border-gray-100 focus:border-[#FF6B00]/50 focus:bg-white transition-all font-body font-bold text-gray-800 placeholder:text-gray-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-2 ${isRegister ? "bg-[#0A0A0A] hover:bg-gray-800" : "bg-gradient-to-r from-[#FFC400] to-[#FF6B00] hover:shadow-[#FF6B00]/30"} text-white py-4 rounded-2xl font-body font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-lg hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0`}
            >
              {isLoading ? (
                <span className="animate-pulse">PROCESSING...</span>
              ) : (
                <>
                  {isRegister ? "REGISTER NOW" : "SECURE LOGIN"}{" "}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
                setSuccess("");
              }}
              className="text-gray-400 font-body text-[10px] font-bold hover:text-[#FF6B00] transition-colors uppercase tracking-[0.2em] flex items-center justify-center gap-2 mx-auto group"
            >
              {isRegister ? (
                <>
                  <LogIn
                    size={14}
                    className="group-hover:-translate-x-1 transition-transform"
                  />{" "}
                  Already have an account? Login
                </>
              ) : (
                <>
                  <UserPlus
                    size={14}
                    className="group-hover:-translate-y-0.5 transition-transform"
                  />{" "}
                  Need an account? Register here
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
