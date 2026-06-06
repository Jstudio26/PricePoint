"use client";

import React from "react";

interface ToolGuideProps {
  title: string;
  description: string;
  items: string[];
  note?: string;
}

export default function ToolGuide({
  title,
  description,
  items,
  note,
}: ToolGuideProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-[2rem] p-6 md:p-8 shadow-lg shadow-black/5">
      <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#FF6B00] mb-3">
        Panduan Penggunaan
      </p>
      <h2 className="text-2xl font-bold text-[#0A0A0A] mb-3">{title}</h2>
      <p className="text-sm text-gray-600 leading-relaxed mb-5">
        {description}
      </p>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3 items-start">
            <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-[#FF6B00]"></span>
            <span className="text-sm text-gray-600 leading-snug">{item}</span>
          </li>
        ))}
      </ul>
      {note ? <p className="mt-5 text-[12px] text-gray-400">{note}</p> : null}
    </div>
  );
}
