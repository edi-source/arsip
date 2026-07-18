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
  ShieldAlert, 
  ShieldCheck, 
  ToggleLeft, 
  ToggleRight, 
  Clock, 
  AlertCircle,
  Activity
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

    // Check if username already exists
    const exists = users.some(u => u.username.toLowerCase() === newUsername.toLowerCase());
    if (exists) {
      setFormError(`Username "${newUsername}" sudah terdaftar dalam database.`);
      return;
    }

    const newUser: UserAccount = {
      id: 'usr-' + Date.now(),
      username: newUsername.toLowerCase(),
      name: newName,
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

  // Helper for audit badges
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

              <div className="sm:col-span-2">
                <button
                  id="btn-reg-submit"
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs py-2 rounded shadow-sm transition-all cursor-pointer"
                >
                  Daftarkan Akun & atur Sandi
                </button>
              </div>
            </form>
          </div>

          {/* User accounts list */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <Users className="w-4 h-4 text-amber-600" />
              Daftar Pengguna Terdaftar ({users.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50/80">
                  <tr>
                    <th className="px-3 py-2">Akun & NIP</th>
                    <th className="px-3 py-2">Peran</th>
                    <th className="px-3 py-2">Username</th>
                    <th className="px-3 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-55/40">
                      <td className="px-3 py-2.5">
                        <p className="font-bold text-slate-900">{user.name}</p>
                        {user.nip && <p className="text-[9px] text-slate-500 font-mono mt-0.5">NIP: {user.nip}</p>}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-950 border border-purple-200' 
                            : user.role === 'kepsek'
                              ? 'bg-amber-100 text-amber-950 border border-amber-200'
                              : user.role === 'tu'
                                ? 'bg-blue-100 text-blue-950 border border-blue-200'
                                : 'bg-slate-100 text-slate-700'
                        }`}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-slate-700">
                        {user.username}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <button
                          id={`btn-toggle-active-${user.id}`}
                          onClick={() => handleToggleActive(user.id, user.name, user.active)}
                          disabled={user.id === currentUser.id}
                          className="focus:outline-none transition-all disabled:opacity-30 cursor-pointer inline-flex"
                          title={user.active ? 'Klik untuk Menonaktifkan' : 'Klik untuk Mengaktifkan'}
                        >
                          {user.active ? (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full">
                              Aktif
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] text-red-700 font-bold bg-red-50 border border-red-300 px-2 py-0.5 rounded-full">
                              Nonaktif
                            </span>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Real-time System Audit Logs */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-amber-500 animate-spin-slow" />
              Lintasan Audit Log Real-Time
            </h3>
            <span className="text-[10px] bg-slate-900 border border-slate-700 text-slate-400 px-2 py-0.5 rounded font-mono font-bold">
              SYS-AUDIT
            </span>
          </div>

          {/* Log Stream list */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {auditLogs.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-10">Belum ada rekam log aktivitas sistem.</p>
            ) : (
              auditLogs.map((log) => (
                <div
                  id={`log-item-${log.id}`}
                  key={log.id}
                  className="p-3 bg-slate-900/60 border border-slate-900 hover:border-slate-800 rounded text-[11px] leading-relaxed transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-slate-400 font-bold">{log.userNama}</span>
                      <span className="text-[8px] bg-slate-800 border border-slate-700 text-slate-300 px-1 py-0.2 rounded font-mono uppercase">
                        {log.role}
                      </span>
                    </div>
                    <span className={`text-[8px] font-mono px-1.5 py-0.2 border rounded uppercase ${getLogBadge(log.tipe)}`}>
                      {log.tipe}
                    </span>
                  </div>

                  <p className="text-slate-300">
                    {log.aktivitas}
                  </p>

                  <div className="text-[9px] text-slate-500 font-mono flex items-center gap-1 pt-1 border-t border-slate-900">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
