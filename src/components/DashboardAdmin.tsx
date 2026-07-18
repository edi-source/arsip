/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserAccount, AuditLog, UserRole } from '../types';
import { 
  Users, 
  History, 
  UserPlus, 
  ShieldCheck, 
  ToggleLeft, 
  ToggleRight, 
  Clock, 
  AlertCircle
} from 'lucide-react';

interface DashboardAdminProps {
  users: UserAccount[];
  auditLogs: AuditLog[];
  currentUser: UserAccount;
  onAddUser: (user: UserAccount) => void;
  onToggleUserActive: (id: string) => void;
  addLog: (userId: string, userNama: string, role: string, aktivitas: string, tipe: 'info' | 'warning' | 'success' | 'error') => void;
}

export default function DashboardAdmin({
  users,
  auditLogs,
  currentUser,
  onAddUser,
  onToggleUserActive,
  addLog,
}: DashboardAdminProps) {
  // Form states for new user
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('guru');
  const [newNip, setNewNip] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const handleRegisterUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newUsername || !newName) {
      setFormError('Nama Lengkap dan Username wajib diisi.');
      return;
    }

    // Pengecekan aman menggunakan optional chaining (?.) agar tidak crash
    const exists = users && Array.isArray(users) && users.some(u => {
  if (!u || !u.username) return false; // Abaikan jika ada data user yang rusak/kosong di database
  return u.username.toLowerCase() === newUsername.toLowerCase().trim();
});
    }

    const newUser: UserAccount = {
      id: 'usr-' + Date.now(),
      username: newUsername.toLowerCase().trim(),
      name: newName.trim(),
      role: newRole,
      nip: newNip || undefined,
      active: true,
    };

    onAddUser(newUser);
    addLog(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      `Mendaftarkan pengguna baru "${newUser.name}" dengan peran "${newUser.role.toUpperCase()}"`,
      'success'
    );

    setFormSuccess(`Akun "${newUser.name}" berhasil didaftarkan.`);
    
    // Reset form
    setNewUsername('');
    setNewName('');
    setNewRole('guru');
    setNewNip('');
  };

  const handleToggleActive = (id: string, name: string, currentlyActive: boolean) => {
    if (id === currentUser.id) {
      alert('Anda tidak bisa menonaktifkan akun Anda sendiri!');
      return;
    }
    onToggleUserActive(id);
    const actionStr = currentlyActive ? 'Menonaktifkan' : 'Mengaktifkan kembali';
    addLog(
      currentUser.id,
      currentUser.name,
      currentUser.role,
      `${actionStr} akun staf "${name}" (ID: ${id})`,
      currentlyActive ? 'warning' : 'success'
    );
  };

  const getLogBadge = (tipe: AuditLog['tipe']) => {
    switch (tipe) {
      case 'success':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'warning':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'error':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="space-y-8 font-sans text-slate-800">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">
            Konsol Pengawas Administrator
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Administrator: <strong className="text-slate-800">{currentUser.name}</strong> • Kelola Akun Institusi & Pantau Jalur Audit Log
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* User Accounts Management */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Add User Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-amber-600" />
                Registrasi Akun Staf/Guru Baru
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">
                REG-STAFF
              </span>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-700 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleRegisterUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  id="reg-name"
                  type="text"
                  placeholder="Contoh: Dra. Herlina, M.Pd."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  NIP Pegawai (Opsional)
                </label>
                <input
                  id="reg-nip"
                  type="text"
                  placeholder="Contoh: 197805122005011002"
                  value={newNip}
                  onChange={(e) => setNewNip(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Peran Administratif *
                </label>
                <select
                  id="reg-role"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="guru">Guru / Wakil Kepala</option>
                  <option value="tu">Staf Tata Usaha (TU)</option>
                  <option value="kepsek">Kepala Sekolah</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Username Login *
                </label>
                <input
                  id="reg-username"
                  type="text"
                  placeholder="Contoh: herlina"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded text-xs transition duration-150 uppercase tracking-wider cursor-pointer"
                >
                  Daftarkan Akun Baru
                </button>
              </div>
            </form>
          </div>

          {/* User List Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <Users className="w-4 h-4 text-blue-600" />
              Daftar Akun Terdaftar ({users?.length || 0})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-2">Nama / NIP</th>
                    <th className="pb-2">Username</th>
                    <th className="pb-2">Role</th>
                    <th className="pb-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {users?.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="py-2.5 pr-2">
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{u.nip || 'Tidak ada NIP'}</div>
                      </td>
