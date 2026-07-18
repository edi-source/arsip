/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SuratMasuk, SuratKeluar } from '../types';
import OfficialHeader from './OfficialHeader';
import { 
  Printer, 
  Search, 
  Calendar, 
  Filter, 
  FileText, 
  Download, 
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ReportModuleProps {
  suratMasuk: SuratMasuk[];
  suratKeluar: SuratKeluar[];
}

export default function ReportModule({ suratMasuk, suratKeluar }: ReportModuleProps) {
  const [reportType, setReportType] = useState<'masuk' | 'keluar'>('masuk');
  
  // Filtering states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Print Preview state
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Apply filters to Surat Masuk
  const filteredMasuk = suratMasuk.filter(sm => {
    if (!sm) return false;
    
    // Safely check search terms
    const nomor = sm.nomorSurat || '';
    const asal = sm.asalSurat || '';
    const perihal = sm.perihal || '';
    
    const matchesSearch = 
      nomor.toLowerCase().includes(search.toLowerCase()) ||
      asal.toLowerCase().includes(search.toLowerCase()) ||
      perihal.toLowerCase().includes(search.toLowerCase());

    // Category
    const matchesCategory = category === 'Semua' || sm.kategori === category;

    // Dates
    const rawDate = sm.tanggalDiterima || sm.tanggalSurat || '';
    const mailDate = rawDate ? new Date(rawDate) : null;
    let matchesStartDate = true;
    let matchesEndDate = true;

    if (startDate && mailDate && !isNaN(mailDate.getTime())) {
      matchesStartDate = mailDate >= new Date(startDate);
    }
    if (endDate && mailDate && !isNaN(mailDate.getTime())) {
      matchesEndDate = mailDate <= new Date(endDate);
    }

    return matchesSearch && matchesCategory && matchesStartDate && matchesEndDate;
  });

  // Apply filters to Surat Keluar
  const filteredKeluar = suratKeluar.filter(sk => {
    if (!sk) return false;
    
    // Safely check search terms
    const nomor = sk.nomorSurat || '';
    const tujuan = sk.tujuanSurat || '';
    const perihal = sk.perihal || '';
    
    const matchesSearch = 
      nomor.toLowerCase().includes(search.toLowerCase()) ||
      tujuan.toLowerCase().includes(search.toLowerCase()) ||
      perihal.toLowerCase().includes(search.toLowerCase());

    // Category
    const matchesCategory = category === 'Semua' || sk.kategori === category;

    // Status
    const matchesStatus = statusFilter === 'Semua' || sk.status === statusFilter;

    // Dates
    const rawDate = sk.tanggalSurat || '';
    const mailDate = rawDate ? new Date(rawDate) : null;
    let matchesStartDate = true;
    let matchesEndDate = true;

    if (startDate && mailDate && !isNaN(mailDate.getTime())) {
      matchesStartDate = mailDate >= new Date(startDate);
    }
    if (endDate && mailDate && !isNaN(mailDate.getTime())) {
      matchesEndDate = mailDate <= new Date(endDate);
    }

    return matchesSearch && matchesCategory && matchesStatus && matchesStartDate && matchesEndDate;
  });

  const handleTriggerBrowserPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      
      {/* Module Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-5 gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">
            Rekapitulasi Laporan Dinas
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ekspor rekap, cetak arsip fisik, dan pantau statistik surat masuk & keluar secara berkala.
          </p>
        </div>

        <button
          id="btn-trigger-print-preview"
          type="button"
          onClick={() => setShowPrintModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          Cetak Rekap Laporan
        </button>
      </div>

      {/* Main filter board */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-wrap">
          
          {/* Left: Report Type selector */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              id="btn-report-type-sm"
              onClick={() => { setReportType('masuk'); setStatusFilter('Semua'); }}
              className={`px-3 py-1.5 text-xs font-bold rounded cursor-pointer ${
                reportType === 'masuk'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Surat Masuk ({filteredMasuk.length})
            </button>
            <button
              id="btn-report-type-sk"
              onClick={() => { setReportType('keluar'); setStatusFilter('Semua'); }}
              className={`px-3 py-1.5 text-xs font-bold rounded cursor-pointer ${
                reportType === 'keluar'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Surat Keluar ({filteredKeluar.length})
            </button>
          </div>

          {/* Right: Search and Advanced trigger */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute inset-y-0 left-0 pl-2.5 w-4 h-4 my-auto text-slate-400" />
              <input
                id="report-search-input"
                type="text"
                placeholder="Cari nomor/asal/perihal..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-50 border border-slate-200 pl-8 pr-3 py-1.5 rounded text-xs focus:outline-none focus:border-amber-500 w-full md:w-56"
              />
            </div>

            <button
              id="btn-toggle-adv-filters"
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 hover:border-slate-300 rounded text-xs text-slate-600 bg-slate-50 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Saring
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 animate-fade-in text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Kategori Klasifikasi
              </label>
              <select
                id="report-filter-kategori"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Dinas">Dinas</option>
                <option value="Undangan">Undangan</option>
                <option value="Pemberitahuan">Pemberitahuan</option>
                <option value="Kepegawaian">Kepegawaian</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {reportType === 'keluar' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Status Alur Sirkulasi
                </label>
                <select
                  id="report-filter-status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Draft">Draf TU</option>
                  <option value="Review">Sedang Direview</option>
                  <option value="Ttd">Telah Ditandatangani</option>
                  <option value="Kirim">Terkirim</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Mulai Tanggal
              </label>
              <input
                id="report-filter-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Sampai Tanggal
              </label>
              <input
                id="report-filter-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Report Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {reportType === 'masuk' ? (
            /* SURAT MASUK TABLE */
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200 text-[10px] uppercase">
                <tr>
                  <th className="px-4 py-3">Tanggal Terima</th>
                  <th className="px-4 py-3">Nomor Surat</th>
                  <th className="px-4 py-3">Asal Pengirim</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Perihal / Ringkasan</th>
                  <th className="px-4 py-3 text-center">Disposisi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMasuk.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400 font-bold bg-slate-50/50">
                      Tidak ada Surat Masuk cocok dengan saringan filter
                    </td>
                  </tr>
                ) : (
                  filteredMasuk.map((sm) => (
                    <tr key={sm.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-800">
                        {sm.tanggalDiterima}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-900 font-semibold whitespace-nowrap">
                        {sm.nomorSurat}
                      </td>
                      <td className="px-4 py-3.5 text-slate-800 font-bold">
                        {sm.asalSurat}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[9px] font-bold">
                          {sm.kategori}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 max-w-xs">
                        <p className="font-bold text-slate-900 line-clamp-1">{sm.perihal}</p>
                        <p className="text-[10px] text-slate-500 italic mt-0.5 line-clamp-1">"{sm.ringkasan}"</p>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {sm.disposisi && sm.disposisi.length > 0 ? (
                          <span className="bg-emerald-100 text-emerald-950 font-bold px-2 py-0.5 rounded text-[9px]">
                            {sm.disposisi.length} Disposisi
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[9px]">
                            Nihil
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            /* SURAT KELUAR TABLE */
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200 text-[10px] uppercase">
                <tr>
                  <th className="px-4 py-3">Tanggal Surat</th>
                  <th className="px-4 py-3">Nomor Surat</th>
                  <th className="px-4 py-3">Tujuan Penerima</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Perihal</th>
                  <th className="px-4 py-3 text-center">Ttd Kepsek</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredKeluar.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400 font-bold bg-slate-50/50">
                      Tidak ada Surat Keluar cocok dengan saringan filter
                    </td>
                  </tr>
                ) : (
                  filteredKeluar.map((sk) => (
                    <tr key={sk.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-800">
                        {sk.tanggalSurat}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-900 font-semibold whitespace-nowrap">
                        {sk.nomorSurat}
                      </td>
                      <td className="px-4 py-3.5 text-slate-800 font-bold">
                        {sk.tujuanSurat}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[9px] font-bold">
                          {sk.kategori}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 max-w-xs font-bold text-slate-950 line-clamp-1">
                        {sk.perihal}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {sk.ttdKepsek ? (
                          <span className="text-emerald-700 font-bold text-[9px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300">
                            SAH (TTD)
                          </span>
                        ) : (
                          <span className="text-red-600 font-bold text-[9px] bg-red-50 px-1.5 py-0.5 rounded border border-red-300">
                            BELUM
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          sk.status === 'Kirim' 
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                            : sk.status === 'Ttd'
                              ? 'bg-indigo-100 text-indigo-900'
                              : sk.status === 'Review'
                                ? 'bg-amber-100 text-amber-900 animate-pulse'
                                : 'bg-slate-100 text-slate-600'
                        }`}>
                          {sk.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* FULL PRINT PREVIEW MODAL OVERLAY */}
      {showPrintModal && (
        <div id="print-modal-overlay" className="fixed inset-0 bg-slate-950/90 flex flex-col justify-between p-4 md:p-6 z-50 overflow-y-auto">
          
          {/* Print controls bar */}
          <div className="bg-slate-900 text-white rounded-lg p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto w-full mb-6 print:hidden">
            <div>
              <h3 className="font-extrabold text-sm uppercase text-amber-400">
                Mode Pratinjau Kertas Kop Resmi Sekolah
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Layout ini diformat presisi sesuai Standar Kop Surat Kementerian dan Dinas Pendidikan Kota Padang Panjang.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-trigger-browser-print"
                onClick={handleTriggerBrowserPrint}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Cetak Cetakan Browser
              </button>
              <button
                id="btn-close-print-modal"
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
              >
                ✕ Keluar
              </button>
            </div>
          </div>

          {/* PHYSICAL PAPER CONTAINER */}
          <div className="bg-white text-black p-10 md:p-12 shadow-2xl rounded-sm max-w-4xl mx-auto w-full min-h-[1050px] font-serif border border-slate-300 relative select-text flex flex-col justify-between">
            <div>
              {/* Institutional double-ruled Kop Surat */}
              <OfficialHeader />

              {/* Title Section */}
              <div className="text-center my-6 space-y-1">
                <h2 className="text-sm font-bold uppercase tracking-wider underline">
                  REKAPITULASI LAPORAN DATA DIGITAL ARSIP SEKOLAH
                </h2>
                <p className="text-[11px] font-mono tracking-tight text-slate-700">
                  Jenis Arsip: {reportType === 'masuk' ? 'SURAT MASUK RESMI' : 'SURAT KELUAR RESMI'} | Periode: {startDate || 'Awal'} s.d. {endDate || 'Hari Ini'}
                </p>
              </div>

              {/* Printed Table Content */}
              <table className="w-full text-[11px] border-collapse border border-black font-sans my-6 text-left">
                <thead>
                  <tr className="bg-slate-100 border-b border-black">
                    <th className="border border-black px-2 py-1.5 font-bold">No</th>
                    <th className="border border-black px-2 py-1.5 font-bold">{reportType === 'masuk' ? 'Tanggal Terima' : 'Tanggal Surat'}</th>
                    <th className="border border-black px-2 py-1.5 font-bold">Nomor Registrasi Surat</th>
                    <th className="border border-black px-2 py-1.5 font-bold">{reportType === 'masuk' ? 'Instansi Pengirim' : 'Instansi Penerima'}</th>
                    <th className="border border-black px-3 py-1.5 font-bold">Kategori</th>
                    <th className="border border-black px-3 py-1.5 font-bold">Perihal / Deskripsi Dokumen</th>
                    {reportType === 'keluar' && (
                      <th className="border border-black px-2 py-1.5 font-bold text-center">Ttd</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {reportType === 'masuk' ? (
                    filteredMasuk.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="border border-black text-center py-8 text-slate-500 italic">
                          Tidak ada arsip surat masuk terdata pada kriteria filter ini.
                        </td>
                      </tr>
                    ) : (
                      filteredMasuk.map((sm, index) => (
                        <tr key={sm.id}>
                          <td className="border border-black px-2 py-2 text-center">{index + 1}</td>
                          <td className="border border-black px-2 py-2 font-mono whitespace-nowrap">{sm.tanggalDiterima}</td>
                          <td className="border border-black px-2 py-2 font-mono font-semibold">{sm.nomorSurat}</td>
                          <td className="border border-black px-2 py-2 font-bold">{sm.asalSurat}</td>
                          <td className="border border-black px-3 py-2 text-center">{sm.kategori}</td>
                          <td className="border border-black px-3 py-2 italic">"{sm.perihal}"</td>
                        </tr>
                      ))
                    )
                  ) : (
                    filteredKeluar.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="border border-black text-center py-8 text-slate-500 italic">
                          Tidak ada arsip surat keluar terdata pada kriteria filter ini.
                        </td>
                      </tr>
                    ) : (
                      filteredKeluar.map((sk, index) => (
                        <tr key={sk.id}>
                          <td className="border border-black px-2 py-2 text-center">{index + 1}</td>
                          <td className="border border-black px-2 py-2 font-mono whitespace-nowrap">{sk.tanggalSurat}</td>
                          <td className="border border-black px-2 py-2 font-mono font-semibold">{sk.nomorSurat}</td>
                          <td className="border border-black px-2 py-2 font-bold">{sk.tujuanSurat}</td>
                          <td className="border border-black px-3 py-2 text-center">{sk.kategori}</td>
                          <td className="border border-black px-3 py-2 italic">"{sk.perihal}"</td>
                          <td className="border border-black px-2 py-2 text-center font-bold text-emerald-800">
                            {sk.ttdKepsek ? 'SAH' : 'BELUM'}
                          </td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Formal Signing Block (Ttd Kepala Sekolah) */}
            <div className="flex justify-end pt-10 font-sans text-xs">
              <div className="w-72 text-center space-y-16">
                <div>
                  <p>Padang Panjang, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="font-bold">Kepala Sekolah SMPN 1 Padang Panjang</p>
                </div>

                <div className="relative flex items-center justify-center">
                  {/* Stempel Emas Resmi / Tanda tangan preview */}
                  <div className="absolute -top-12 w-28 h-28 border-4 border-amber-500 border-double rounded-full flex items-center justify-center flex-col text-amber-600 bg-amber-50/50 p-2 opacity-80 pointer-events-none transform -rotate-12">
                    <span className="text-[7px] font-extrabold text-center uppercase tracking-tight">SMP NEGERI 1</span>
                    <span className="text-[6px] text-center font-mono uppercase">PADANG PANJANG</span>
                    <div className="w-1.5 h-1.5 bg-amber-600 rounded-full my-0.5" />
                    <span className="text-[7px] font-bold uppercase text-slate-700">STEMPEL RESMI</span>
                  </div>

                  <div className="h-10 w-full border-b border-black flex items-center justify-center">
                    <span className="text-[10px] text-slate-400 italic">Dra. Hj. Elvia, M.Pd.</span>
                  </div>
                </div>

                <div>
                  <p className="font-bold underline">Dra. Hj. Elvia, M.Pd.</p>
                  <p className="font-mono text-[10px]">NIP. 196812101994032005</p>
                </div>
              </div>
            </div>

          </div>

          <div className="text-center text-slate-500 text-[10px] mt-6 print:hidden">
            Tekan <strong className="text-white">Cetak Cetakan Browser</strong> atau gunakan pintasan browser <strong className="text-white">Ctrl + P</strong> untuk mencetak dokumen.
          </div>
        </div>
      )}

    </div>
  );
}
