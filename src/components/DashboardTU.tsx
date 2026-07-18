/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SuratMasuk, SuratKeluar, UserAccount } from '../types';
import { simulateOcrExtract } from '../data';
import { 
  FileDown, 
  FileUp, 
  Plus, 
  Search, 
  Sparkles, 
  Send, 
  Trash2, 
  Eye, 
  ChevronRight, 
  CheckCircle, 
  History,
  FileText,
  AlertCircle,
  Clock,
  ArrowRight,
  Pencil,
  X
} from 'lucide-react';

interface DashboardTUProps {
  suratMasuk: SuratMasuk[];
  suratKeluar: SuratKeluar[];
  currentUser: UserAccount;
  onAddSuratMasuk: (surat: SuratMasuk) => void;
  onAddSuratKeluar: (surat: SuratKeluar) => void;
  onEditSuratMasuk: (surat: SuratMasuk) => void;
  onEditSuratKeluar: (surat: SuratKeluar) => void;
  onUpdateSuratKeluarStatus: (id: string, status: SuratKeluar['status']) => void;
  onDeleteSuratMasuk: (id: string) => void;
  onDeleteSuratKeluar: (id: string) => void;
  addLog: (userId: string, userNama: string, role: string, aktivitas: string, tipe: 'info' | 'warning' | 'success' | 'error') => void;
}

export default function DashboardTU({
  suratMasuk,
  suratKeluar,
  currentUser,
  onAddSuratMasuk,
  onAddSuratKeluar,
  onEditSuratMasuk,
  onEditSuratKeluar,
  onUpdateSuratKeluarStatus,
  onDeleteSuratMasuk,
  onDeleteSuratKeluar,
  addLog
}: DashboardTUProps) {
  // Tabs: 'masuk' or 'keluar'
  const [activeTab, setActiveTab] = useState<'masuk' | 'keluar'>('masuk');

  // Edit States
  const [editingSmId, setEditingSmId] = useState<string | null>(null);
  const [editingSkId, setEditingSkId] = useState<string | null>(null);

  // Form states - Surat Masuk
  const [smNomor, setSmNomor] = useState('');
  const [smAsal, setSmAsal] = useState('');
  const [smTanggalSurat, setSmTanggalSurat] = useState('');
  const [smTanggalTerima, setSmTanggalTerima] = useState(new Date().toISOString().split('T')[0]);
  const [smPerihal, setSmPerihal] = useState('');
  const [smRingkasan, setSmRingkasan] = useState('');
  const [smKategori, setSmKategori] = useState('Dinas');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [ocrSuccessMsg, setOcrSuccessMsg] = useState('');

  // Form states - Surat Keluar
  const [skNomor, setSkNomor] = useState('');
  const [skTujuan, setSkTujuan] = useState('');
  const [skTanggal, setSkTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [skPerihal, setSkPerihal] = useState('');
  const [skIsi, setSkIsi] = useState('');
  const [skKategori, setSkKategori] = useState('Dinas');

  // View Modal state
  const [selectedSm, setSelectedSm] = useState<SuratMasuk | null>(null);
  const [selectedSk, setSelectedSk] = useState<SuratKeluar | null>(null);

  // Search/Filter states
  const [searchTerm, setSearchTerm] = useState('');

  // Handle Drag & Drop
  const [isDragActive, setIsDragActive] = useState(false);
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      setOcrSuccessMsg(`Berkas "${file.name}" berhasil diunggah.`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setOcrSuccessMsg(`Berkas "${file.name}" berhasil diunggah.`);
    }
  };

  // Trigger Smart AI / OCR Simulation
  const handleOcrAnalysis = () => {
    if (!uploadedFile) {
      alert('Silakan unggah atau drag-and-drop berkas pindaian surat masuk terlebih dahulu!');
      return;
    }

    setIsOcrLoading(true);
    setOcrSuccessMsg('AI sedang menganalisis berkas pindaian...');

    setTimeout(() => {
      const extracted = simulateOcrExtract(uploadedFile.name);
      
      setSmNomor(extracted.nomorSurat || '');
      setSmAsal(extracted.asalSurat || '');
      setSmPerihal(extracted.perihal || '');
      setSmRingkasan(extracted.ringkasan || '');
      setSmKategori(extracted.kategori || 'Dinas');
      setSmTanggalSurat(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 3 days ago

      setIsOcrLoading(false);
      setOcrSuccessMsg('Simulasi AI OCR Berhasil! Informasi surat berhasil diekstrak otomatis.');
      addLog(
        currentUser.id,
        currentUser.name,
        currentUser.role,
        `Menggunakan Smart AI Assist (Simulasi OCR) untuk mengekstrak data dari "${uploadedFile.name}"`,
        'success'
      );
    }, 1500);
  };

  // Submit Surat Masuk
  const handleSubmitSuratMasuk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smNomor || !smAsal || !smTanggalSurat || !smPerihal) {
      alert('Mohon lengkapi semua field utama (Nomor, Asal, Tanggal Surat, dan Perihal).');
      return;
    }

    if (editingSmId) {
      const existingSm = suratMasuk.find(sm => sm.id === editingSmId);
      const updatedSm: SuratMasuk = {
        id: editingSmId,
        nomorSurat: smNomor,
        asalSurat: smAsal,
        tanggalSurat: smTanggalSurat,
        tanggalDiterima: smTanggalTerima,
        perihal: smPerihal,
        ringkasan: smRingkasan || 'Tidak ada ringkasan tertulis.',
        kategori: smKategori,
        fileName: uploadedFile ? uploadedFile.name : (existingSm?.fileName),
        disposisi: existingSm?.disposisi || [],
      };

      onEditSuratMasuk(updatedSm);
      addLog(
        currentUser.id,
        currentUser.name,
        currentUser.role,
        `Mengubah data Surat Masuk nomor "${updatedSm.nomorSurat}" dari "${updatedSm.asalSurat}"`,
        'success'
      );
      setEditingSmId(null);
    } else {
      const newSm: SuratMasuk = {
        id: 'sm-' + Date.now(),
        nomorSurat: smNomor,
        asalSurat: smAsal,
        tanggalSurat: smTanggalSurat,
        tanggalDiterima: smTanggalTerima,
        perihal: smPerihal,
        ringkasan: smRingkasan || 'Tidak ada ringkasan tertulis.',
        kategori: smKategori,
        fileName: uploadedFile ? uploadedFile.name : undefined,
        disposisi: [],
      };

      onAddSuratMasuk(newSm);
      addLog(
        currentUser.id,
        currentUser.name,
        currentUser.role,
        `Mencatat Surat Masuk baru dengan nomor "${newSm.nomorSurat}" dari "${newSm.asalSurat}"`,
        'success'
      );
    }

    // Reset Form
    setSmNomor('');
    setSmAsal('');
    setSmTanggalSurat('');
    setSmPerihal('');
    setSmRingkasan('');
    setSmKategori('Dinas');
    setUploadedFile(null);
    setOcrSuccessMsg('');
  };

  // Submit Surat Keluar
  const handleSubmitSuratKeluar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skNomor || !skTujuan || !skPerihal || !skIsi) {
      alert('Mohon lengkapi semua field draf surat keluar (Nomor, Tujuan, Perihal, Isi).');
      return;
    }

    if (editingSkId) {
      const existingSk = suratKeluar.find(sk => sk.id === editingSkId);
      const updatedSk: SuratKeluar = {
        id: editingSkId,
        nomorSurat: skNomor,
        tujuanSurat: skTujuan,
        tanggalSurat: skTanggal,
        perihal: skPerihal,
        isiSurat: skIsi,
        kategori: skKategori,
        status: existingSk ? existingSk.status : 'Draft',
        pembuat: existingSk ? existingSk.pembuat : currentUser.name,
        ttdKepsek: existingSk?.ttdKepsek,
        ttdTanggal: existingSk?.ttdTanggal,
        catatanRevisi: existingSk?.catatanRevisi
      };

      onEditSuratKeluar(updatedSk);
      addLog(
        currentUser.id,
        currentUser.name,
        currentUser.role,
        `Mengubah draf Surat Keluar nomor "${updatedSk.nomorSurat}" tujuan "${updatedSk.tujuanSurat}"`,
        'success'
      );
      setEditingSkId(null);
    } else {
      const newSk: SuratKeluar = {
        id: 'sk-' + Date.now(),
        nomorSurat: skNomor,
        tujuanSurat: skTujuan,
        tanggalSurat: skTanggal,
        perihal: skPerihal,
        isiSurat: skIsi,
        kategori: skKategori,
        status: 'Draft',
        pembuat: currentUser.name,
      };

      onAddSuratKeluar(newSk);
      addLog(
        currentUser.id,
        currentUser.name,
        currentUser.role,
        `Membuat draf Surat Keluar baru dengan nomor "${newSk.nomorSurat}" tujuan "${newSk.tujuanSurat}"`,
        'info'
      );
    }

    // Reset Form
    setSkNomor('');
    setSkTujuan('');
    setSkPerihal('');
    setSkIsi('');
    setSkKategori('Dinas');
  };

  // Filtered lists based on search term
  const filteredSuratMasuk = suratMasuk.filter(sm => 
    sm.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sm.asalSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sm.perihal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSuratKeluar = suratKeluar.filter(sk => 
    sk.nomorSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sk.tujuanSurat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sk.perihal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stepper UI Renderer
  const renderStepper = (status: SuratKeluar['status']) => {
    const steps: { name: SuratKeluar['status']; label: string }[] = [
      { name: 'Draft', label: 'Draf TU' },
      { name: 'Review', label: 'Review Kepsek' },
      { name: 'Ttd', label: 'Tanda Tangan' },
      { name: 'Kirim', label: 'Terkirim' },
    ];

    const getStepIndex = (s: SuratKeluar['status']) => {
      if (s === 'Draft') return 0;
      if (s === 'Review') return 1;
      if (s === 'Ttd') return 2;
      return 3;
    };

    const currentIndex = getStepIndex(status);

    return (
      <div className="flex items-center gap-1">
        {steps.map((step, idx) => {
          const isActive = idx === currentIndex;
          const isCompleted = idx < currentIndex;
          return (
            <React.Fragment key={step.name}>
              <div className="flex flex-col items-center">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  isActive 
                    ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                    : isCompleted 
                      ? 'bg-emerald-100 text-emerald-900' 
                      : 'bg-slate-100 text-slate-500'
                }`}>
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8 font-sans text-slate-800">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">
            Konsol Administrasi Tata Usaha
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Petugas Aktif: <strong className="text-slate-800">{currentUser.name}</strong> • Manajemen Kearsipan & Surat Menyurat Sekolah
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="inline-flex bg-slate-100 p-1.5 rounded-lg border border-slate-200/80 self-start">
          <button
            id="tab-sm"
            onClick={() => { setActiveTab('masuk'); setSearchTerm(''); }}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'masuk'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Surat Masuk
          </button>
          <button
            id="tab-sk"
            onClick={() => { setActiveTab('keluar'); setSearchTerm(''); }}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'keluar'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Draf Surat Keluar
          </button>
        </div>
      </div>

      {activeTab === 'masuk' ? (
        /* ================== SURAT MASUK TAB ================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Pencatatan Baru */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                {editingSmId ? <Pencil className="w-4 h-4 text-amber-600" /> : <Plus className="w-4 h-4 text-amber-600" />}
                {editingSmId ? 'Edit Surat Masuk' : 'Catat Surat Masuk Baru'}
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">
                FORM-SM
              </span>
            </div>

            {/* Drag & Drop scanner */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-5 text-center transition-all ${
                isDragActive 
                  ? 'border-amber-500 bg-amber-50/50' 
                  : uploadedFile 
                    ? 'border-emerald-300 bg-emerald-50/20' 
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50/60'
              }`}
            >
              <input 
                id="file-upload-sm"
                type="file" 
                accept=".pdf,image/*" 
                onChange={handleFileChange} 
                className="hidden"
              />
              <label htmlFor="file-upload-sm" className="cursor-pointer block">
                <FileUp className={`w-8 h-8 mx-auto mb-2 ${uploadedFile ? 'text-emerald-600' : 'text-slate-400'}`} />
                <p className="text-xs font-bold text-slate-700">
                  {uploadedFile ? 'Salinan Berkas Berhasil Diunggah' : 'Drag & Drop Berkas Surat Masuk'}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  {uploadedFile ? uploadedFile.name : 'Mendukung format PDF atau Gambar scan fisik surat'}
                </p>
              </label>

              {uploadedFile && (
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-center gap-2">
                  <button
                    id="btn-ai-ocr"
                    type="button"
                    disabled={isOcrLoading}
                    onClick={handleOcrAnalysis}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-white bg-slate-800 hover:bg-slate-900 rounded shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    {isOcrLoading ? 'Mengekstrak AI...' : 'Analisis AI (Simulasi OCR)'}
                  </button>
                </div>
              )}
            </div>

            {ocrSuccessMsg && (
              <div className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                isOcrLoading ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
                <span>{ocrSuccessMsg}</span>
              </div>
            )}

            {/* Standard Form fields */}
            <form onSubmit={handleSubmitSuratMasuk} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Klasifikasi Kategori
                  </label>
                  <select
                    id="select-sm-kategori"
                    value={smKategori}
                    onChange={(e) => setSmKategori(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Dinas">Dinas</option>
                    <option value="Undangan">Undangan</option>
                    <option value="Pemberitahuan">Pemberitahuan</option>
                    <option value="Kepegawaian">Kepegawaian</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Tanggal Diterima
                  </label>
                  <input
                    id="input-sm-terima"
                    type="date"
                    value={smTanggalTerima}
                    onChange={(e) => setSmTanggalTerima(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Nomor Surat Resmi *
                </label>
                <input
                  id="input-sm-nomor"
                  type="text"
                  placeholder="Contoh: 420/102/Disdikbud-PP/2026"
                  value={smNomor}
                  onChange={(e) => setSmNomor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Asal Instansi / Pengirim *
                </label>
                <input
                  id="input-sm-asal"
                  type="text"
                  placeholder="Contoh: Dinas Pendidikan Kota Padang Panjang"
                  value={smAsal}
                  onChange={(e) => setSmAsal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Tanggal Surat Tertera *
                  </label>
                  <input
                    id="input-sm-tglsurat"
                    type="date"
                    value={smTanggalSurat}
                    onChange={(e) => setSmTanggalSurat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Perihal Surat *
                </label>
                <input
                  id="input-sm-perihal"
                  type="text"
                  placeholder="Tuliskan judul atau perihal surat"
                  value={smPerihal}
                  onChange={(e) => setSmPerihal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Isi Ringkasan / Resume
                </label>
                <textarea
                  id="input-sm-ringkasan"
                  rows={2}
                  placeholder="Ringkasan poin utama atau instruksi di dalam surat"
                  value={smRingkasan}
                  onChange={(e) => setSmRingkasan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex gap-2">
                {editingSmId && (
                  <button
                    id="btn-sm-cancel"
                    type="button"
                    onClick={() => {
                      setEditingSmId(null);
                      setSmNomor('');
                      setSmAsal('');
                      setSmTanggalSurat('');
                      setSmTanggalTerima(new Date().toISOString().split('T')[0]);
                      setSmPerihal('');
                      setSmRingkasan('');
                      setSmKategori('Dinas');
                      setUploadedFile(null);
                      setOcrSuccessMsg('');
                    }}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs py-2.5 rounded shadow-sm transition-all cursor-pointer text-center"
                  >
                    Batal
                  </button>
                )}
                <button
                  id="btn-sm-submit"
                  type="submit"
                  className={`${editingSmId ? 'flex-1' : 'w-full'} bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2.5 rounded shadow-sm transition-all cursor-pointer`}
                >
                  {editingSmId ? 'Simpan Perubahan' : 'Simpan & Daftarkan Surat'}
                </button>
              </div>
            </form>
          </div>

          {/* List Surat Masuk Terdaftar */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Daftar Arsip Surat Masuk
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Menampilkan semua surat masuk yang dicatatkan di database luring sekolah
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute inset-y-0 left-0 pl-2.5 w-4 h-4 my-auto text-slate-400" />
                <input
                  id="search-sm"
                  type="text"
                  placeholder="Cari nomor/asal/perihal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-50 border border-slate-200 pl-8 pr-3 py-1.5 rounded text-xs focus:outline-none focus:border-amber-500 w-full sm:w-48"
                />
              </div>
            </div>

            {/* List of archives */}
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {filteredSuratMasuk.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-100">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-bold">Tidak ada Surat Masuk ditemukan</p>
                  <p className="text-[10px] text-slate-400">Silakan masukkan data baru atau ganti kata kunci pencarian</p>
                </div>
              ) : (
                filteredSuratMasuk.map((sm) => (
                  <div
                    id={`sm-card-${sm.id}`}
                    key={sm.id}
                    className="p-4 border border-slate-200 hover:border-slate-300 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] bg-slate-200 text-slate-800 font-mono px-2 py-0.5 rounded font-bold">
                        {sm.nomorSurat}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded font-semibold">
                          {sm.kategori}
                        </span>
                        {sm.disposisi && sm.disposisi.length > 0 ? (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                            <CheckCircle className="w-2.5 h-2.5" />
                            Disposisi ({sm.disposisi.length})
                          </span>
                        ) : (
                          <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            Belum Disposisi
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {sm.perihal}
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Asal: <strong className="text-slate-700">{sm.asalSurat}</strong>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 text-[10px] text-slate-500">
                      <span>Diterima: {sm.tanggalDiterima}</span>
                      <div className="flex items-center gap-2">
                        <button
                          id={`btn-edit-sm-${sm.id}`}
                          onClick={() => {
                            setEditingSmId(sm.id);
                            setSmNomor(sm.nomorSurat);
                            setSmAsal(sm.asalSurat);
                            setSmTanggalSurat(sm.tanggalSurat);
                            setSmTanggalTerima(sm.tanggalDiterima);
                            setSmPerihal(sm.perihal);
                            setSmRingkasan(sm.ringkasan);
                            setSmKategori(sm.kategori);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-amber-600 hover:text-amber-800 p-1 hover:bg-amber-50 rounded transition-all cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-view-sm-${sm.id}`}
                          onClick={() => setSelectedSm(sm)}
                          className="text-slate-600 hover:text-slate-900 p-1 hover:bg-slate-200 rounded transition-all cursor-pointer"
                          title="Lihat Detail"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-delete-sm-${sm.id}`}
                          onClick={() => {
                            if (confirm('Apakah Anda yakin ingin menghapus arsip surat masuk ini beserta data disposisinya?')) {
                              onDeleteSuratMasuk(sm.id);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-all cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ================== SURAT KELUAR TAB ================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Penyusunan Surat Keluar */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                {editingSkId ? <Pencil className="w-4 h-4 text-amber-600" /> : <Plus className="w-4 h-4 text-amber-600" />}
                {editingSkId ? 'Edit Draf Surat Keluar' : 'Buat Draf Surat Keluar'}
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">
                FORM-SK
              </span>
            </div>

            <form onSubmit={handleSubmitSuratKeluar} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Klasifikasi Kategori
                  </label>
                  <select
                    id="select-sk-kategori"
                    value={skKategori}
                    onChange={(e) => setSkKategori(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Dinas">Dinas</option>
                    <option value="Undangan">Undangan</option>
                    <option value="Pemberitahuan">Pemberitahuan</option>
                    <option value="Kepegawaian">Kepegawaian</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Tanggal Surat
                  </label>
                  <input
                    id="input-sk-tgl"
                    type="date"
                    value={skTanggal}
                    onChange={(e) => setSkTanggal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Nomor Surat Keluar *
                </label>
                <input
                  id="input-sk-nomor"
                  type="text"
                  placeholder="Contoh: 421.3/091/SMPN1-PP/2026"
                  value={skNomor}
                  onChange={(e) => setSkNomor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Tujuan Penerima *
                </label>
                <input
                  id="input-sk-tujuan"
                  type="text"
                  placeholder="Contoh: Dinas Pendidikan dan Kebudayaan Padang Panjang"
                  value={skTujuan}
                  onChange={(e) => setSkTujuan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Perihal Surat Keluar *
                </label>
                <input
                  id="input-sk-perihal"
                  type="text"
                  placeholder="Perihal draf surat"
                  value={skPerihal}
                  onChange={(e) => setSkPerihal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Isi Surat Keluar (Formal) *
                </label>
                <textarea
                  id="input-sk-isi"
                  rows={4}
                  placeholder="Tulis draf isi surat secara lengkap..."
                  value={skIsi}
                  onChange={(e) => setSkIsi(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 resize-none font-sans"
                  required
                />
              </div>

              <div className="flex gap-2">
                {editingSkId && (
                  <button
                    id="btn-sk-cancel"
                    type="button"
                    onClick={() => {
                      setEditingSkId(null);
                      setSkNomor('');
                      setSkTujuan('');
                      setSkTanggal(new Date().toISOString().split('T')[0]);
                      setSkPerihal('');
                      setSkIsi('');
                      setSkKategori('Dinas');
                    }}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs py-2.5 rounded shadow-sm transition-all cursor-pointer text-center"
                  >
                    Batal
                  </button>
                )}
                <button
                  id="btn-sk-submit"
                  type="submit"
                  className={`${editingSkId ? 'flex-1' : 'w-full'} bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-2.5 rounded shadow-sm transition-all cursor-pointer`}
                >
                  {editingSkId ? 'Simpan Perubahan' : 'Simpan Sebagai Draf TU'}
                </button>
              </div>
            </form>
          </div>

          {/* List Surat Keluar / Sirkulasi Progres */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Alur Sirkulasi & Draf Surat Keluar
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Gunakan tombol draf untuk mengirim berkas kepada Kepala Sekolah untuk proses pengesahan tanda tangan.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute inset-y-0 left-0 pl-2.5 w-4 h-4 my-auto text-slate-400" />
                <input
                  id="search-sk"
                  type="text"
                  placeholder="Cari draf nomor/tujuan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-50 border border-slate-200 pl-8 pr-3 py-1.5 rounded text-xs focus:outline-none focus:border-amber-500 w-full sm:w-48"
                />
              </div>
            </div>

            <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
              {filteredSuratKeluar.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-100">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-bold">Tidak ada Surat Keluar ditemukan</p>
                </div>
              ) : (
                filteredSuratKeluar.map((sk) => (
                  <div
                    id={`sk-card-${sk.id}`}
                    key={sk.id}
                    className="p-4 border border-slate-200 hover:border-slate-300 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] bg-slate-200 text-slate-800 font-mono px-2 py-0.5 rounded font-bold">
                        {sk.nomorSurat}
                      </span>
                      {sk.status === 'Draft' && (
                        <span className="text-[9px] bg-blue-100 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded font-semibold uppercase">
                          Draf Lokal
                        </span>
                      )}
                      {sk.status === 'Review' && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-semibold uppercase animate-pulse">
                          Sedang Direview Kepsek
                        </span>
                      )}
                      {sk.status === 'Ttd' && (
                        <span className="text-[9px] bg-indigo-100 text-indigo-800 border border-indigo-200 px-1.5 py-0.5 rounded font-semibold uppercase">
                          Siap Kirim / Sudah Ttd
                        </span>
                      )}
                      {sk.status === 'Kirim' && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold uppercase">
                          Sudah Dikirim
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {sk.perihal}
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Tujuan: <strong className="text-slate-700">{sk.tujuanSurat}</strong>
                      </p>
                    </div>

                    {/* Stepper Progres Visual */}
                    <div className="bg-white p-2.5 rounded-md border border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                        Sirkulasi Status:
                      </span>
                      {renderStepper(sk.status)}
                    </div>

                    {/* Revision note from Kepsek */}
                    {sk.catatanRevisi && (
                      <div className="bg-red-50 border border-red-200 text-red-800 p-2.5 rounded text-[11px] flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Catatan Revisi Kepsek:</strong> "{sk.catatanRevisi}"
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 text-[10px] text-slate-500">
                      <span>Pembuat: {sk.pembuat} ({sk.tanggalSurat})</span>
                      <div className="flex items-center gap-2">
                        {sk.status === 'Draft' && (
                          <button
                            id={`btn-send-review-${sk.id}`}
                            onClick={() => {
                              onUpdateSuratKeluarStatus(sk.id, 'Review');
                              addLog(
                                currentUser.id,
                                currentUser.name,
                                currentUser.role,
                                `Mengirim draf Surat Keluar "${sk.nomorSurat}" ke Kepala Sekolah untuk direview`,
                                'info'
                              );
                            }}
                            className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 px-2 py-1 rounded text-[10px] font-extrabold shadow-sm transition-all cursor-pointer"
                          >
                            <Send className="w-3 h-3" />
                            Kirim Review
                          </button>
                        )}
                        {sk.status === 'Ttd' && (
                          <button
                            id={`btn-finalize-send-${sk.id}`}
                            onClick={() => {
                              onUpdateSuratKeluarStatus(sk.id, 'Kirim');
                              addLog(
                                currentUser.id,
                                currentUser.name,
                                currentUser.role,
                                `Melakukan ekspedisi pengiriman fisik Surat Keluar nomor "${sk.nomorSurat}"`,
                                'success'
                              );
                            }}
                            className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-900 text-white px-2 py-1 rounded text-[10px] font-bold shadow-sm transition-all cursor-pointer"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Ekspedisi Kirim
                          </button>
                        )}
                        {sk.status !== 'Kirim' && (
                          <button
                            id={`btn-edit-sk-${sk.id}`}
                            onClick={() => {
                              setEditingSkId(sk.id);
                              setSkNomor(sk.nomorSurat);
                              setSkTujuan(sk.tujuanSurat);
                              setSkTanggal(sk.tanggalSurat);
                              setSkPerihal(sk.perihal);
                              setSkIsi(sk.isiSurat);
                              setSkKategori(sk.kategori);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-amber-600 hover:text-amber-800 p-1 hover:bg-amber-50 rounded transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          id={`btn-view-sk-${sk.id}`}
                          onClick={() => setSelectedSk(sk)}
                          className="text-slate-600 hover:text-slate-900 p-1 hover:bg-slate-200 rounded transition-all cursor-pointer"
                          title="Pratinjau"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-delete-sk-${sk.id}`}
                          disabled={sk.status === 'Kirim'}
                          onClick={() => {
                            if (confirm('Hapus draf surat keluar ini?')) {
                              onDeleteSuratKeluar(sk.id);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL VIEW SURAT MASUK */}
      {selectedSm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="bg-slate-950 text-white p-4 flex items-center justify-between">
              <h3 className="font-extrabold text-xs uppercase tracking-wider">
                Detail Berkas Surat Masuk
              </h3>
              <button
                id="btn-close-sm-modal"
                onClick={() => setSelectedSm(null)}
                className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[480px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 text-xs border-b border-slate-100 pb-3">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nomor Surat</span>
                  <span className="font-mono text-slate-800 font-bold">{selectedSm.nomorSurat}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori</span>
                  <span className="font-bold text-slate-800">{selectedSm.kategori}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asal Surat</span>
                <p className="text-slate-800 font-bold">{selectedSm.asalSurat}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs border-y border-slate-100 py-3">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Surat</span>
                  <span className="text-slate-700">{selectedSm.tanggalSurat}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Diterima</span>
                  <span className="text-slate-700">{selectedSm.tanggalDiterima}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Perihal</span>
                <p className="text-slate-800 font-bold leading-relaxed">{selectedSm.perihal}</p>
              </div>

              <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded border border-slate-200">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ringkasan Dokumen</span>
                <p className="text-slate-700 italic leading-relaxed">"{selectedSm.ringkasan}"</p>
              </div>

              {selectedSm.fileName && (
                <div className="flex items-center gap-2 p-2 bg-emerald-50 text-emerald-800 text-[11px] rounded border border-emerald-100">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Lampiran Pindaian: <strong>{selectedSm.fileName}</strong></span>
                </div>
              )}

              {/* Disposisi List */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider">
                  Riwayat Disposisi Dinas:
                </h4>
                {selectedSm.disposisi && selectedSm.disposisi.length > 0 ? (
                  <div className="space-y-3">
                    {selectedSm.disposisi.map((disp) => (
                      <div key={disp.id} className="border border-slate-200 rounded p-3 bg-amber-50/20 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
                            {disp.instruksi}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded font-semibold ${
                            disp.status === 'Selesai' ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
                          }`}>
                            {disp.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700">
                          Catatan Kepsek: <strong className="text-slate-800">"{disp.catatan}"</strong>
                        </p>
                        <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-200/50">
                          <span>Diberikan Kepada: <strong>{disp.kepadaNama}</strong></span>
                          <span>Tanggal: {new Date(disp.tanggalDisposisi).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded text-center">
                    Belum ada instruksi disposisi dari Kepala Sekolah untuk surat ini.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 text-right">
              <button
                id="btn-close-sm-modal-footer"
                onClick={() => setSelectedSm(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-bold transition-all cursor-pointer"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VIEW SURAT KELUAR */}
      {selectedSk && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="bg-slate-950 text-white p-4 flex items-center justify-between">
              <h3 className="font-extrabold text-xs uppercase tracking-wider">
                Detail Berkas Surat Keluar
              </h3>
              <button
                id="btn-close-sk-modal"
                onClick={() => setSelectedSk(null)}
                className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[480px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 text-xs border-b border-slate-100 pb-3">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nomor Surat Keluar</span>
                  <span className="font-mono text-slate-800 font-bold">{selectedSk.nomorSurat}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori / Status</span>
                  <span className="font-bold text-slate-800">{selectedSk.kategori} ({selectedSk.status})</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tujuan Penerima</span>
                <p className="text-slate-800 font-bold">{selectedSk.tujuanSurat}</p>
              </div>

              <div className="space-y-1 text-xs border-y border-slate-100 py-3">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Perihal</span>
                <p className="text-slate-800 font-bold leading-relaxed">{selectedSk.perihal}</p>
              </div>

              <div className="space-y-2 text-xs bg-slate-50 p-4 rounded border border-slate-200">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Draf Isi Surat</span>
                <p className="text-slate-700 font-serif whitespace-pre-wrap leading-relaxed">{selectedSk.isiSurat}</p>
              </div>

              {/* Sign Status */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Pembuat Draf</span>
                  <span className="text-xs text-slate-700 font-bold">{selectedSk.pembuat}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider text-right">Tanda Tangan Kepsek</span>
                  {selectedSk.ttdKepsek ? (
                    <div className="text-right">
                      {selectedSk.ttdKepsek === 'stempel_resmi' ? (
                        <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-300 font-bold px-2 py-0.5 rounded">
                          Stempel Resmi Emas
                        </span>
                      ) : (
                        <img 
                          src={selectedSk.ttdKepsek} 
                          alt="Signature" 
                          className="h-10 object-contain ml-auto border border-slate-200 p-0.5 bg-white rounded"
                        />
                      )}
                      <span className="block text-[8px] text-slate-500 font-mono mt-0.5">Tgl: {selectedSk.ttdTanggal}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-red-500 italic">Belum Ditandatangani</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 text-right">
              <button
                id="btn-close-sk-modal-footer"
                onClick={() => setSelectedSk(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-bold transition-all cursor-pointer"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
