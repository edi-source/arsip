/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SuratMasuk, UserAccount, Disposisi } from '../types';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  User, 
  FileText, 
  ListTodo, 
  Sparkles,
  ClipboardList,
  AlertCircle
} from 'lucide-react';

interface DashboardGuruProps {
  suratMasuk: SuratMasuk[];
  currentUser: UserAccount;
  onCompleteDisposisi: (suratMasukId: string, disposisiId: string) => void;
  addLog: (userId: string, userNama: string, role: string, aktivitas: string, tipe: 'info' | 'warning' | 'success' | 'error') => void;
}

export default function DashboardGuru({
  suratMasuk,
  currentUser,
  onCompleteDisposisi,
  addLog
}: DashboardGuruProps) {
  const [filterStatus, setFilterStatus] = useState<'Semua' | 'Belum Selesai' | 'Selesai'>('Belum Selesai');

  // Extract all dispositions targeted to the logged-in Guru
  const allGuruDisposisi: { disp: Disposisi; sm: SuratMasuk }[] = [];

  suratMasuk.forEach(sm => {
    if (sm.disposisi) {
      sm.disposisi.forEach(disp => {
        if (disp.kepadaId === currentUser.id) {
          allGuruDisposisi.push({ disp, sm });
        }
      });
    }
  });

  // Filter based on status
  const filteredDisposisi = allGuruDisposisi.filter(item => {
    if (filterStatus === 'Semua') return true;
    return item.disp.status === filterStatus;
  });

  const handleCompleteAction = (suratMasukId: string, disposisiId: string, itemSubject: string) => {
    onCompleteDisposisi(suratMasukId, disposisiId);
    addLog(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      `Menyelesaikan tugas disposisi dinas terkait perihal: "${itemSubject}"`,
      'success'
    );
  };

  return (
    <div className="space-y-8 font-sans text-slate-800">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">
            Panel Tugas & Disposisi Guru
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Guru Aktif: <strong className="text-slate-800">{currentUser.name}</strong> • NIP: {currentUser.nip || '-'} • SMP Negeri 1 Padang Panjang
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200 self-start">
          {['Semua', 'Belum Selesai', 'Selesai'].map((status) => (
            <button
              id={`tab-guru-disp-${status.toLowerCase().replace(' ', '-')}`}
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded transition-all cursor-pointer ${
                filterStatus === status
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid View */}
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-slate-900 text-amber-400 p-4 rounded-xl border border-amber-500/20 shadow-sm">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-5 h-5" />
            <div>
              <h3 className="text-xs font-extrabold tracking-wider text-slate-100 uppercase">
                Arahan Disposisi Kepala Sekolah Dra. Hj. Elvia, M.Pd.
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Segera tindak lanjuti instruksi dinas resmi yang telah didelegasikan khusus kepada Anda.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono bg-amber-500/15 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full font-bold">
            Total Tugas: {filteredDisposisi.length}
          </span>
        </div>

        {filteredDisposisi.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-xl border border-slate-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="text-sm text-slate-600 font-bold">Luar Biasa, Semua Tugas Selesai!</p>
            <p className="text-xs text-slate-400 mt-1">Tidak ada disposisi dinas aktif yang belum Anda selesaikan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDisposisi.map(({ disp, sm }) => {
              const isFinished = disp.status === 'Selesai';
              return (
                <div
                  id={`guru-disp-card-${disp.id}`}
                  key={disp.id}
                  className={`border-2 rounded-xl p-5 shadow-sm transition-all duration-300 flex flex-col justify-between ${
                    isFinished
                      ? 'border-emerald-200 bg-emerald-50/10 hover:bg-emerald-50/20'
                      : 'border-amber-400 bg-amber-50/10 hover:border-amber-500 shadow-amber-500/5'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top badging */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <span className="text-[9px] bg-slate-800 text-slate-200 font-mono px-2 py-0.5 rounded font-bold">
                        {sm.nomorSurat}
                      </span>
                      <span className={`text-[9px] font-extrabold tracking-wide px-2 py-0.5 rounded uppercase flex items-center gap-1 ${
                        isFinished 
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                          : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                      }`}>
                        {isFinished ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {disp.status}
                      </span>
                    </div>

                    {/* Letter perihal info */}
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Surat Masuk Terkait
                      </span>
                      <h4 className="text-xs font-extrabold text-slate-900 leading-snug">
                        {sm.perihal}
                      </h4>
                      <p className="text-[10px] text-slate-500">Asal Surat: {sm.asalSurat}</p>
                    </div>

                    {/* Core instruction panel */}
                    <div className="bg-slate-900 text-slate-100 p-3.5 rounded-lg space-y-2 relative overflow-hidden border border-slate-800">
                      <div className="absolute top-0 right-0 p-1">
                        <Award className="w-8 h-8 text-amber-500/10" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-extrabold font-mono uppercase">
                          {disp.instruksi}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-serif leading-relaxed italic">
                        "{disp.catatan}"
                      </p>
                    </div>

                    {/* Metadata lines */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 pt-2 border-t border-slate-200/50">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        Pemberi: Dra. Hj. Elvia
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Disposisi: {new Date(disp.tanggalDisposisi).toLocaleDateString()}
                      </span>
                    </div>

                    {isFinished && disp.tanggalSelesai && (
                      <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Tuntas diselesaikan pada: {new Date(disp.tanggalSelesai).toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Complete Task trigger button */}
                  {!isFinished && (
                    <div className="pt-4 mt-4 border-t border-slate-200/50">
                      <button
                        id={`btn-complete-disp-${disp.id}`}
                        onClick={() => handleCompleteAction(sm.id, disp.id, sm.perihal)}
                        className="w-full bg-slate-900 hover:bg-slate-950 text-amber-400 font-extrabold text-xs py-2.5 rounded-lg shadow-sm hover:shadow-slate-900/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-amber-500" />
                        Selesaikan Tugas & Laporkan Hasil
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
