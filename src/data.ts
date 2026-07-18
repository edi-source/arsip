/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserAccount, SuratMasuk, SuratKeluar, AuditLog } from './types';

export const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'usr-admin',
    username: 'admin',
    name: 'Aditya Pratama, S.Kom.',
    role: 'admin',
    active: true,
  },
  {
    id: 'usr-kepsek',
    username: 'kepsek',
    name: 'Dra. Hj. Elvia, M.Pd.',
    role: 'kepsek',
    nip: '196812101994032005',
    active: true,
  },
  {
    id: 'usr-tu',
    username: 'tu',
    name: 'Robi Hartono, A.Md.',
    role: 'tu',
    nip: '198104152009011002',
    active: true,
  },
  {
    id: 'usr-guru',
    username: 'guru',
    name: 'Yulius Effendi, S.Pd.',
    role: 'guru',
    nip: '197405022002121003',
    active: true,
  },
];

export const DEFAULT_SURAT_MASUK: SuratMasuk[] = [
  {
    id: 'sm-1',
    nomorSurat: '420/102/Disdikbud-PP/2026',
    asalSurat: 'Dinas Pendidikan dan Kebudayaan Kota Padang Panjang',
    tanggalSurat: '2026-07-10',
    tanggalDiterima: '2026-07-12',
    perihal: 'Undangan Rapat Koordinasi Implementasi Kurikulum Merdeka Mandiri Berbagi',
    ringkasan: 'Undangan resmi untuk menghadiri rapat koordinasi teknis penyusunan KOSP dan kesiapan guru dalam mengajar menggunakan modul Kurikulum Merdeka Tahun Ajaran 2026/2027.',
    kategori: 'Undangan',
    fileName: 'undangan_rakor_kurikulum_2026.pdf',
    disposisi: [
      {
        id: 'disp-1',
        suratMasukId: 'sm-1',
        dari: 'Dra. Hj. Elvia, M.Pd.',
        kepadaId: 'usr-guru',
        kepadaNama: 'Yulius Effendi, S.Pd.',
        instruksi: 'Hadiri / Wakili',
        catatan: 'Harap mewakili saya dalam rapat ini. Siapkan catatan penting dan sosialisasikan materi rakor kepada guru-guru mata pelajaran pada rapat hari Sabtu besok.',
        status: 'Belum Selesai',
        tanggalDisposisi: '2026-07-13T09:15:00.000Z',
      },
    ],
  },
  {
    id: 'sm-2',
    nomorSurat: '005/341/PGRI-PP/2026',
    asalSurat: 'Pengurus PGRI Kota Padang Panjang',
    tanggalSurat: '2026-07-14',
    tanggalDiterima: '2026-07-15',
    perihal: 'Permohonan Delegasi Guru Peserta Lomba Menulis Esai Hari Guru Nasional',
    ringkasan: 'Surat permohonan pengiriman minimal 2 (dua) orang perwakilan guru hebat dari SMPN 1 Padang Panjang untuk mengikuti ajang esai pendidikan tingkat kota.',
    kategori: 'Dinas',
    fileName: 'permohonan_lomba_esai_pgri.pdf',
    disposisi: [],
  },
  {
    id: 'sm-3',
    nomorSurat: '421.3/512/Disdikbud-PP/2026',
    asalSurat: 'Dinas Pendidikan dan Kebudayaan Kota Padang Panjang',
    tanggalSurat: '2026-07-05',
    tanggalDiterima: '2026-07-06',
    perihal: 'Pemberitahuan Penyaluran Dana BOS Kinerja Afirmasi Triwulan II',
    ringkasan: 'Surat pemberitahuan resmi mengenai pencairan dan panduan pemanfaatan Dana Bantuan Operasional Sekolah (BOS) Kinerja untuk operasional digitalisasi sekolah.',
    kategori: 'Pemberitahuan',
    fileName: 'bos_kinerja_2026_t2.pdf',
    disposisi: [
      {
        id: 'disp-2',
        suratMasukId: 'sm-3',
        dari: 'Dra. Hj. Elvia, M.Pd.',
        kepadaId: 'usr-tu',
        kepadaNama: 'Robi Hartono, A.Md.',
        instruksi: 'Tindaklanjuti segera',
        catatan: 'Segera koordinasikan dengan Bendahara BOS sekolah untuk pencatatan buku kas umum dan rincian penggunaan anggaran sesuai juknis.',
        status: 'Selesai',
        tanggalDisposisi: '2026-07-07T08:30:00.000Z',
        tanggalSelesai: '2026-07-09T14:20:00.000Z',
      }
    ],
  }
];

export const DEFAULT_SURAT_KELUAR: SuratKeluar[] = [
  {
    id: 'sk-1',
    nomorSurat: '421.3/089/SMPN1-PP/2026',
    tujuanSurat: 'Orang Tua / Wali Murid Kelas VII, VIII, dan IX',
    tanggalSurat: '2026-07-16',
    perihal: 'Pemberitahuan Rapat Komite Sekolah Pengesahan RKAS Awal Tahun Ajaran 2026/2027',
    isiSurat: 'Sehubungan dengan mulainya Tahun Ajaran Baru 2026/2027, kami mengundang Bapak/Ibu Orang Tua Wali Murid untuk menghadiri Rapat Komite Sekolah guna menyelaraskan rencana program kerja tahunan dan pengesahan Rencana Kegiatan dan Anggaran Sekolah (RKAS). Kehadiran Bapak/Ibu sangat menentukan arah kemajuan pendidikan putra-putri kita di SMP Negeri 1 Padang Panjang.',
    kategori: 'Pemberitahuan',
    status: 'Kirim',
    pembuat: 'Robi Hartono, A.Md.',
    ttdKepsek: 'stempel_resmi',
    ttdTanggal: '2026-07-16',
  },
  {
    id: 'sk-2',
    nomorSurat: '421.3/090/SMPN1-PP/2026',
    tujuanSurat: 'Kepala Dinas Pendidikan dan Kebudayaan Kota Padang Panjang',
    tanggalSurat: '2026-07-16',
    perihal: 'Laporan Bulanan Keadaan Siswa, Guru, dan Tenaga Kependidikan Bulan Juli 2026',
    isiSurat: 'Dengan hormat, bersama surat ini kami sampaikan berkas Laporan Bulanan mengenai fluktuasi jumlah peserta didik baru, mutasi siswa keluar-masuk, serta rekapitulasi kehadiran Guru dan Tenaga Kependidikan (GTK) SMP Negeri 1 Padang Panjang untuk bulan Juli 2026. Laporan ini kami susun berdasarkan data Dapodikdasmen teraktual.',
    kategori: 'Dinas',
    status: 'Review',
    pembuat: 'Robi Hartono, A.Md.',
  },
  {
    id: 'sk-3',
    nomorSurat: '421.3/085/SMPN1-PP/2026',
    tujuanSurat: 'Lembaga Penjaminan Mutu Pendidikan (LPMP) Sumatera Barat',
    tanggalSurat: '2026-07-08',
    perihal: 'Permohonan Narasumber Diklat Peningkatan Kompetensi Guru',
    isiSurat: 'Dalam rangka meningkatkan kapasitas profesionalisme guru pasca libur semester, kami bermaksud menyelenggarakan workshop internal bertema Pemanfaatan Artificial Intelligence dalam Pembelajaran Interaktif. Oleh sebab itu, kami memohon kesediaan instansi LPMP mengirimkan narasumber ahli untuk mendampingi guru-guru kami.',
    kategori: 'Dinas',
    status: 'Ttd',
    pembuat: 'Robi Hartono, A.Md.',
  }
];

export const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-07-16T08:30:00.000Z',
    userId: 'usr-tu',
    userNama: 'Robi Hartono, A.Md.',
    role: 'tu',
    aktivitas: 'Mencatat Surat Masuk baru dari Dinas Pendidikan dengan nomor 420/102/Disdikbud-PP/2026',
    tipe: 'success',
  },
  {
    id: 'log-2',
    timestamp: '2026-07-16T09:15:00.000Z',
    userId: 'usr-kepsek',
    userNama: 'Dra. Hj. Elvia, M.Pd.',
    role: 'kepsek',
    aktivitas: 'Menerbitkan lembar disposisi untuk Surat Masuk nomor 420/102/Disdikbud-PP/2026 ditujukan kepada Yulius Effendi, S.Pd.',
    tipe: 'info',
  },
  {
    id: 'log-3',
    timestamp: '2026-07-16T11:00:00.000Z',
    userId: 'usr-tu',
    userNama: 'Robi Hartono, A.Md.',
    role: 'tu',
    aktivitas: 'Membuat draf Surat Keluar Baru perihal Rapat Komite Sekolah (421.3/089/SMPN1-PP/2026)',
    tipe: 'info',
  },
];

// LocalStorage helpers
export const loadData = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(`smpn1_arsip_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.error('Error loading data from localStorage', e);
    return defaultValue;
  }
};

export const saveData = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(`smpn1_arsip_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving data to localStorage', e);
  }
};

// Simulated Smart AI Assist (OCR extraction)
export const simulateOcrExtract = (fileName: string): Partial<SuratMasuk> => {
  const fileLower = fileName.toLowerCase();
  
  if (fileLower.includes('dikbud') || fileLower.includes('dinas') || fileLower.includes('pendidikan')) {
    return {
      nomorSurat: '420/' + Math.floor(Math.random() * 800 + 100) + '/Disdikbud-PP/' + new Date().getFullYear(),
      asalSurat: 'Dinas Pendidikan dan Kebudayaan Kota Padang Panjang',
      perihal: 'Sosialisasi Asesmen Nasional Berbasis Komputer (ANBK) Tingkat SMP',
      ringkasan: 'Surat pemberitahuan pelaksanaan gladi bersih dan sinkronisasi server ANBK tingkat SMP Kota Padang Panjang.',
      kategori: 'Dinas',
    };
  } else if (fileLower.includes('komite') || fileLower.includes('rapat') || fileLower.includes('undangan')) {
    return {
      nomorSurat: '005/' + Math.floor(Math.random() * 500 + 50) + '/Komite-SMPN1/' + new Date().getFullYear(),
      asalSurat: 'Komite Sekolah SMP Negeri 1 Padang Panjang',
      perihal: 'Undangan Rapat Pleno Koordinasi Program Unggulan Sekolah Terpadu',
      ringkasan: 'Undangan musyawarah pengurus harian komite bersama pimpinan sekolah untuk penetapan target kelulusan dan pendampingan olimpiade.',
      kategori: 'Undangan',
    };
  } else if (fileLower.includes('bantuan') || fileLower.includes('bos') || fileLower.includes('dana')) {
    return {
      nomorSurat: '900/' + Math.floor(Math.random() * 1000 + 200) + '/Sekr-PP/' + new Date().getFullYear(),
      asalSurat: 'Badan Pengelola Keuangan Daerah (BPKD) Padang Panjang',
      perihal: 'Surat Keputusan Penerima Hibah Sarana TIK Sekolah Menengah',
      ringkasan: 'Surat Keputusan penetapan SMP Negeri 1 Padang Panjang sebagai penerima hibah 15 unit Chromebook untuk penguatan laboratorium TIK.',
      kategori: 'Pemberitahuan',
    };
  } else {
    // Generic
    return {
      nomorSurat: Math.floor(Math.random() * 900 + 100) + '/EXT/' + new Date().getFullYear(),
      asalSurat: 'Kementerian Pendidikan Dasar dan Menengah RI',
      perihal: 'Surat Edaran Panduan Literasi & Numerasi Pagi Hari',
      ringkasan: 'Panduan teknis pengkondisian 15 menit kegiatan membaca terpandu sebelum jam pelajaran pertama dimulai.',
      kategori: 'Dinas',
    };
  }
};
