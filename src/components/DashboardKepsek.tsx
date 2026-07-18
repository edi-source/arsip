/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SuratMasuk, SuratKeluar, UserAccount, Disposisi } from '../types';
import SignatureCanvas from './SignatureCanvas';
import { 
  FileCheck, 
  Send, 
  Sparkles, 
  Plus, 
  PenTool, 
  FileText, 
  UserCheck, 
  Clock, 
  Check, 
  ChevronRight, 
  X, 
  AlertTriangle,
  Award
} from 'lucide-react';

interface DashboardKepsekProps {
  suratMasuk: SuratMasuk[];
  suratKeluar: SuratKeluar[];
  users: UserAccount[];
  currentUser: UserAccount;
  onAddDisposisi: (suratMasukId: string, disposisi: Disposisi) => void;
  onApproveSuratKeluar: (id: string, ttdData: string) => void;
  onRejectSuratKeluar: (id: string, catatan: string) => void;
  addLog: (userId: string, userNama: string, role: string, aktivitas: string, tipe: 'info' | 'warning' | 'success' | 'error') => void;
}

export default function DashboardKepsek({
  suratMasuk,
  suratKeluar,
  users,
  currentUser,
  onAddDisposisi,
  onApproveSuratKeluar,
  onRejectSuratKeluar,
  addLog,
}: DashboardKepsekProps) {
  // Tabs: 'masuk' (Disposisi), 'keluar' (Review/Signing)
  const [activeTab, setActiveTab] = useState<'masuk' | 'keluar'>('masuk');

  // Selected items for active workflows
  const [selectedSm, setSelectedSm] = useState<SuratMasuk | null>(null);
  const [selectedSk, setSelectedSk] = useState<SuratKeluar | null>(null);

  // Disposition Form States
  const [dispKepadaId, setDispKepadaId] = useState('');
  const [dispInstruksi, setDispInstruksi] = useState('Tindaklanjuti segera');
  const [dispCatatan, setDispCatatan] = useState('');

  // Rejection Form States
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectCatatan, setRejectCatatan] = useState('');

  // Signing Workflow states
  const [isSigning, setIsSigning] = useState(false);

  // Get active teachers/staff for delegation (excluding kepsek and admin)
  const staffUsers = users.filter(u => u.role === 'guru' || u.role === 'tu');

  // Filter letters needing action
  // Incoming letters that Kepsek can review/add disposition
  const pendingSuratMasuk = suratMasuk;

  // Outgoing letters in 'Review' status
  const reviewSuratKeluar = suratKeluar.filter(sk => sk.status === 'Review');

  // Handle disposition submit
  const handleDisposisiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSm) return;
    if (!dispKepadaId) {
      alert('Silakan pilih staf atau guru penerima disposisi dinas.');
      return;
    }

    const targetUser = users.find(u => u.id === dispKepadaId);
    if (!targetUser) return;

    const newDisp: Disposisi = {
      id: 'disp-' + Date.now(),
      suratMasukId: selectedSm.id,
      dari: currentUser.name,
      kepadaId: targetUser.id,
      kepadaNama: targetUser.name,
      instruksi: dispInstruksi,
      catatan: dispCatatan || 'Tidak ada catatan tertulis khusus.',
      status: 'Belum Selesai',
      tanggalDisposisi: new Date().toISOString(),
    };

    onAddDisposisi(selectedSm.id, newDisp);
    addLog(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      `Menerbitkan lembar disposisi dinas untuk Surat Masuk nomor "${selectedSm.nomorSurat}" ditugaskan kepada "${targetUser.name}"`,
      'info'
    );

    // Reset disposition form
    setDispKepadaId('');
    setDispInstruksi('Tindaklanjuti segera');
    setDispCatatan('');
    setSelectedSm(null);
  };

  // Handle approve & sign
  const handleApproveAndSign = (signatureValue: string) => {
    if (!selectedSk) return;

    onApproveSuratKeluar(selectedSk.id, signatureValue);
    addLog(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      `Menyetujui & membubuhkan tanda tangan digital pada draf Surat Keluar nomor "${selectedSk.nomorSurat}"`,
      'success'
    );

    // Reset states
    setIsSigning(false);
    setSelectedSk(null);
  };

  // Embed official gold stamp
  const handleSelectOfficialStamp = () => {
    handleApproveAndSign('stempel_resmi');
  };

  // Handle reject with comments
  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSk || !rejectCatatan) {
      alert('Silakan tuliskan catatan koreksi atau revisi terlebih dahulu.');
      return;
    }

    onRejectSuratKeluar(selectedSk.id, rejectCatatan);
    addLog(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      `Menolak & mengembalikan draf Surat Keluar nomor "${selectedSk.nomorSurat}" ke Tata Usaha dengan catatan: "${rejectCatatan}"`,
      'warning'
    );

    // Reset states
    setIsRejecting(false);
    setRejectCatatan('');
    setSelectedSk(null);
  };

  return (
    <div className="space-y-8 font-sans text-slate-800">
      
      {/* Principal Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">
            Konsol Pengesahan Kepala Sekolah
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pejabat Aktif: <strong className="text-slate-800">{currentUser.name}</strong> • Kepala Sekolah SMP Negeri 1 Padang Panjang
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="inline-flex bg-slate-100 p-1.5 rounded-lg border border-slate-200/80 self-start">
          <button
            id="tab-kepsek-masuk"
            onClick={() => { setActiveTab('masuk'); setSelectedSm(null); setSelectedSk(null); }}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'masuk'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Disposisi Surat Masuk ({pendingSuratMasuk.length})
          </button>
          <button
            id="tab-kepsek-keluar"
            onClick={() => { setActiveTab('keluar'); setSelectedSm(null); setSelectedSk(null); }}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'keluar'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ttd Surat Keluar ({reviewSuratKeluar.length})
          </button>
        </div>
      </div>

      {activeTab === 'masuk' ? (
        /* ================== TAB: DISPOSISI SURAT MASUK ================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* List of Incoming mail */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Arsip Surat Masuk untuk Delegasi Disposisi
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Pilih surat di bawah ini untuk menerbitkan arahan instruksi tertulis secara formal
              </p>
            </div>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {pendingSuratMasuk.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-100">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-bold">Tidak ada surat masuk terdaftar</p>
                </div>
              ) : (
                pendingSuratMasuk.map((sm) => (
                  <div
                    id={`kepsek-sm-${sm.id}`}
                    key={sm.id}
                    onClick={() => { setSelectedSm(sm); setSelectedSk(null); }}
                    className={`p-4 border rounded-lg transition-all text-left cursor-pointer space-y-2 relative ${
                      selectedSm?.id === sm.id
                        ? 'border-amber-500 bg-amber-50/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] bg-slate-200 text-slate-800 font-mono px-2 py-0.5 rounded font-bold">
                        {sm.nomorSurat}
                      </span>
                      <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded font-bold">
                        {sm.kategori}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {sm.perihal}
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Dari: <strong className="text-slate-700">{sm.asalSurat}</strong>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 text-[10px] text-slate-500">
                      <span>Diterima: {sm.tanggalDiterima}</span>
                      <span className="font-semibold text-amber-800 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                        {sm.disposisi && sm.disposisi.length > 0 
                          ? `Sudah Disposisi (${sm.disposisi.length})` 
                          : 'Belum Disposisi'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Disposition Issuer Form */}
          <div className="lg:col-span-5">
            {selectedSm ? (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Send className="w-4 h-4 text-amber-600" />
                    Lembar Disposisi Kepala Sekolah
                  </h3>
                  <button
                    id="btn-unselect-sm"
                    onClick={() => setSelectedSm(null)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Surat Brief Details */}
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded text-xs space-y-1.5">
                  <p className="text-[10px] font-mono text-slate-500 font-bold">{selectedSm.nomorSurat}</p>
                  <p className="font-bold text-slate-900 leading-snug">{selectedSm.perihal}</p>
                  <p className="text-[11px] text-slate-600">Asal: {selectedSm.asalSurat}</p>
                </div>

                <form onSubmit={handleDisposisiSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Diteruskan Kepada (Guru / Waka) *
                    </label>
                    <select
                      id="select-disp-penerima"
                      value={dispKepadaId}
                      onChange={(e) => setDispKepadaId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                      required
                    >
                      <option value="">-- Pilih Penerima Disposisi --</option>
                      {staffUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.role === 'guru' ? 'Guru/Waka' : 'Staf TU'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Opsi Instruksi / Tindakan Cepat
                    </label>
                    <select
                      id="select-disp-instruksi"
                      value={dispInstruksi}
                      onChange={(e) => setDispInstruksi(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Tindaklanjuti segera">Tindaklanjuti segera</option>
                      <option value="Hadiri / Wakili">Hadiri / Wakili</option>
                      <option value="Siapkan konsep / draf">Siapkan konsep / draf</option>
                      <option value="Hadiri rapat komite">Hadiri rapat komite</option>
                      <option value="Lakukan pembinaan">Lakukan pembinaan</option>
                      <option value="Koordinasikan segera">Koordinasikan segera</option>
                      <option value="Selesaikan sesuai ketentuan">Selesaikan sesuai ketentuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Catatan Instruksi Tertulis Kepala Sekolah
                    </label>
                    <textarea
                      id="input-disp-catatan"
                      rows={3}
                      placeholder="Masukkan catatan instruksi khusus yang jelas untuk ditindaklanjuti..."
                      value={dispCatatan}
                      onChange={(e) => setDispCatatan(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  <button
                    id="btn-disp-submit"
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs py-2.5 rounded shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" />
                    Kirim & Daftarkan Instruksi
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center">
                <Send className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-bold">Belum Ada Surat Terpilih</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
                  Silakan pilih surat masuk dari panel kiri untuk memunculkan Lembar Instruksi Disposisi Dinas.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ================== TAB: REVIEW & TTD SURAT KELUAR ================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* List of Drafts awaiting Review */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Draf Surat Keluar Menunggu Pengesahan
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Pilih surat keluar di bawah ini untuk meninjau redaksi dan membubuhkan tanda tangan elektronik resmi
              </p>
            </div>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {reviewSuratKeluar.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-100">
                  <FileCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-bold">Semua draf bersih! Tidak ada antrean review.</p>
                </div>
              ) : (
                reviewSuratKeluar.map((sk) => (
                  <div
                    id={`kepsek-sk-${sk.id}`}
                    key={sk.id}
                    onClick={() => { setSelectedSk(sk); setSelectedSm(null); setIsSigning(false); setIsRejecting(false); }}
                    className={`p-4 border rounded-lg transition-all text-left cursor-pointer space-y-2 relative ${
                      selectedSk?.id === sk.id
                        ? 'border-amber-500 bg-amber-50/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] bg-slate-200 text-slate-800 font-mono px-2 py-0.5 rounded font-bold">
                        {sk.nomorSurat}
                      </span>
                      <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded font-bold">
                        {sk.kategori}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {sk.perihal}
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Tujuan: <strong className="text-slate-700">{sk.tujuanSurat}</strong>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 text-[10px] text-slate-500">
                      <span>Pembuat: {sk.pembuat}</span>
                      <span className="text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1 text-[9px]">
                        <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                        Awaiting Ttd
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Signing & Review Action Area */}
          <div className="lg:col-span-5">
            {selectedSk ? (
              <div className="space-y-4">
                {/* Draft Document View */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      Lembar Pratinjau Surat Keluar
                    </h3>
                    <button
                      id="btn-unselect-sk"
                      onClick={() => { setSelectedSk(null); setIsSigning(false); setIsRejecting(false); }}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed max-h-[300px] overflow-y-auto pr-1">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">No. Surat Keluar</span>
                      <p className="font-mono text-slate-800 font-bold">{selectedSk.nomorSurat}</p>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Penerima Tujuan</span>
                      <p className="text-slate-800 font-bold">{selectedSk.tujuanSurat}</p>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Perihal</span>
                      <p className="text-slate-800 font-bold">{selectedSk.perihal}</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 border border-slate-200 rounded">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Isi Surat</span>
                      <p className="text-slate-700 whitespace-pre-wrap font-serif italic text-[11px] leading-relaxed">
                        "{selectedSk.isiSurat}"
                      </p>
                    </div>
                  </div>

                  {/* Approve / Reject buttons */}
                  {!isSigning && !isRejecting && (
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                      <button
                        id="btn-trigger-reject"
                        type="button"
                        onClick={() => { setIsRejecting(true); setIsSigning(false); }}
                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded font-bold text-xs text-center transition-all cursor-pointer"
                      >
                        Koreksi & Tolak
                      </button>

                      <button
                        id="btn-trigger-sign"
                        type="button"
                        onClick={() => { setIsSigning(true); setIsRejecting(false); }}
                        className="px-3 py-2 bg-slate-900 hover:bg-slate-950 text-white rounded font-bold text-xs text-center transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <PenTool className="w-3.5 h-3.5" />
                        Sahkan & Ttd
                      </button>
                    </div>
                  )}
                </div>

                {/* Signing Pad Area */}
                {isSigning && (
                  <div className="animate-fade-in">
                    <SignatureCanvas 
                      onSave={handleApproveAndSign}
                      onSelectStamp={handleSelectOfficialStamp}
                      onCancel={() => setIsSigning(false)}
                    />
                  </div>
                )}

                {/* Rejection Form */}
                {isRejecting && (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="text-xs font-bold text-red-800 uppercase flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        Catatan Revisi / Koreksi
                      </h4>
                      <button
                        id="btn-cancel-reject"
                        onClick={() => setIsRejecting(false)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleRejectSubmit} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Instruksi Revisi kepada Staf TU *
                        </label>
                        <textarea
                          id="input-reject-catatan"
                          rows={3}
                          value={rejectCatatan}
                          onChange={(e) => setRejectCatatan(e.target.value)}
                          placeholder="Contoh: Perbaiki penomoran klasifikasi surat, sesuaikan dengan draf terbaru dari dinas..."
                          className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-500 resize-none"
                          required
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <button
                          id="btn-cancel-reject-footer"
                          type="button"
                          onClick={() => setIsRejecting(false)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs transition-all cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          id="btn-submit-reject"
                          type="submit"
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-all cursor-pointer"
                        >
                          Kirim Koreksi
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center">
                <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-bold">Belum Ada Surat Terpilih</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
                  Silakan pilih draf surat keluar di antrean review kiri untuk melakukan pengesahan.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
