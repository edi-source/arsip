/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'admin' | 'kepsek' | 'tu' | 'guru';

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  nip?: string;
  active: boolean;
}

export interface Disposisi {
  id: string;
  suratMasukId: string;
  dari: string; // "Dra. Elvia, M.Pd" (Kepala Sekolah)
  kepadaId: string; // Target Guru/Waka User ID
  kepadaNama: string; // Target Guru/Waka Name
  instruksi: string; // "Tindaklanjuti segera", "Hadiri/Wakili", "Siapkan konsep/draf", dll.
  catatan: string; // Catatan tambahan Kepsek
  status: 'Belum Selesai' | 'Selesai';
  tanggalDisposisi: string;
  tanggalSelesai?: string;
}

export interface SuratMasuk {
  id: string;
  nomorSurat: string;
  asalSurat: string;
  tanggalSurat: string;
  tanggalDiterima: string;
  perihal: string;
  ringkasan: string;
  kategori: string; // "Dinas" | "Undangan" | "Pemberitahuan" | "Kepegawaian" | "Lainnya"
  fileUrl?: string; // base64 or custom representation
  fileName?: string;
  disposisi?: Disposisi[];
}

export interface SuratKeluar {
  id: string;
  nomorSurat: string;
  tujuanSurat: string;
  tanggalSurat: string;
  perihal: string;
  isiSurat: string;
  kategori: string; // "Dinas" | "Undangan" | "Pemberitahuan" | "Kepegawaian" | "Lainnya"
  status: 'Draft' | 'Review' | 'Ttd' | 'Kirim';
  pembuat: string; // TU user name
  ttdKepsek?: string; // base64 signature image OR 'stempel_resmi'
  ttdTanggal?: string;
  catatanRevisi?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userNama: string;
  role: UserRole;
  aktivitas: string;
  tipe: 'info' | 'warning' | 'success' | 'error';
}
