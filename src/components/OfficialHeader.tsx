/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export default function OfficialHeader() {
  return (
    <div className="flex items-center justify-between border-b-4 border-double border-slate-800 pb-4 mb-6 font-sans text-slate-900 select-none">
      {/* Emblem Kementerian / Pemko */}
      <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center border-2 border-amber-600 rounded-full p-1 bg-amber-50">
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800 fill-current">
          <path d="M50 5 L90 35 L80 85 L50 95 L20 85 L10 35 Z" fill="none" stroke="currentColor" strokeWidth="4" />
          {/* Outer ring */}
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1.5" />
          {/* Educational book symbol */}
          <path d="M35 48 C 35 48, 43 40, 50 48 C 57 40, 65 48, 65 48 L 65 65 C 65 65, 57 58, 50 63 C 43 58, 35 65, 35 65 Z" fill="currentColor" opacity="0.3"/>
          <path d="M35 48 C 35 48, 43 40, 50 48 C 57 40, 65 48, 65 48 L 65 65 C 65 65, 57 58, 50 63 C 43 58, 35 65, 35 65 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
          {/* Torch/Obor of education */}
          <path d="M50 48 L 50 68" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path d="M47 38 C 47 32, 53 32, 53 38 C 50 41, 50 41, 47 38 Z" fill="#d97706" />
          <path d="M49 42 C 49 39, 51 39, 51 42" stroke="currentColor" strokeWidth="1.5" />
          {/* Stars */}
          <polygon points="50,15 52,19 57,19 53,22 55,27 50,24 45,27 47,22 43,19 48,19" fill="#d97706" />
        </svg>
      </div>

      {/* Main Text Content */}
      <div className="text-center flex-grow px-4">
        <h3 className="text-sm font-semibold tracking-widest text-slate-700 uppercase">
          PEMERINTAH KOTA PADANG PANJANG
        </h3>
        <h2 className="text-base font-bold tracking-wider text-slate-800 uppercase">
          DINAS PENDIDIKAN DAN KEBUDAYAAN
        </h2>
        <h1 className="text-xl font-extrabold tracking-normal text-slate-900 uppercase">
          SMP NEGERI 1 PADANG PANJANG
        </h1>
        <p className="text-[10px] text-slate-600 font-mono tracking-tight mt-1">
          Jl. Jenderal Sudirman No. 3, Kel. Balai-Balai, Padang Panjang Barat, Kota Padang Panjang, Sumatera Barat 27114
        </p>
        <p className="text-[10px] text-slate-600 font-mono tracking-tight">
          Telp: (0752) 82015 | Faks: (0752) 82015 | Surel: info@smpn1padangpanjang.sch.id | Web: smpn1padangpanjang.sch.id
        </p>
      </div>

      {/* Secondary Emblem (Tut Wuri Handayani style) */}
      <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center p-1 border border-slate-300 rounded bg-slate-50">
        <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600 fill-current">
          {/* Triangular background of Tut Wuri Handayani */}
          <polygon points="50,10 90,80 10,80" fill="none" stroke="currentColor" strokeWidth="3" />
          <polygon points="50,18 82,75 18,75" fill="none" stroke="currentColor" strokeWidth="1" />
          {/* Book */}
          <path d="M25 65 L45 55 L50 58 L55 55 L75 65 L75 50 L50 40 L25 50 Z" />
          {/* Fire torch flame */}
          <circle cx="50" cy="32" r="6" fill="#d97706" />
          <path d="M50 32 L50 48" stroke="currentColor" strokeWidth="4" />
        </svg>
      </div>
    </div>
  );
}
