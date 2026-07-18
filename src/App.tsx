/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserAccount, SuratMasuk, SuratKeluar, AuditLog, Disposisi } from './types';
import { 
  DEFAULT_USERS, 
  DEFAULT_SURAT_MASUK, 
  DEFAULT_SURAT_KELUAR, 
  DEFAULT_AUDIT_LOGS, 
  loadData, 
  saveData 
} from './data';
import {
  subscribeUsers,
  subscribeSuratMasuk,
  subscribeSuratKeluar,
  subscribeAuditLogs,
  addUser as dbAddUser,
  updateUser as dbUpdateUser,
  addSuratMasuk as dbAddSuratMasuk,
  editSuratMasuk as dbEditSuratMasuk,
  deleteSuratMasuk as dbDeleteSuratMasuk,
  addSuratKeluar as dbAddSuratKeluar,
  editSuratKeluar as dbEditSuratKeluar,
  deleteSuratKeluar as dbDeleteSuratKeluar,
  addAuditLog as dbAddAuditLog,
  saveAllUsers as dbSaveAllUsers
} from './lib/firebase';
import LoginScreen from './components/LoginScreen';
import DashboardTU from './components/DashboardTU';
import DashboardKepsek from './components/DashboardKepsek';
import DashboardGuru from './components/DashboardGuru';
import DashboardAdmin from './components/DashboardAdmin';
import ReportModule from './components/ReportModule';
import { 
  School, 
  LogOut, 
  FolderLock, 
  FileSpreadsheet, 
  Users, 
  Activity, 
  Cpu, 
  Database,
  RefreshCw,
  Bell
} from 'lucide-react';

export default function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    return loadData<UserAccount | null>('session_user', null);
  });

  // Core records lists (populated in real-time from Firebase/Broadcaster)
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [suratMasuk, setSuratMasuk] = useState<SuratMasuk[]>([]);
  const [suratKeluar, setSuratKeluar] = useState<SuratKeluar[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Navigation tab within the app: 'dashboard' | 'reports' | 'admin'
  const [activeNav, setActiveNav] = useState<'dashboard' | 'reports' | 'admin'>('dashboard');

  // Real-time Firebase listeners
  useEffect(() => {
    const unsub = subscribeUsers(setUsers);
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = subscribeSuratMasuk(setSuratMasuk);
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = subscribeSuratKeluar(setSuratKeluar);
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = subscribeAuditLogs(setAuditLogs);
    return () => unsub();
  }, []);

  // Sync session with localStorage
  useEffect(() => {
    saveData('session_user', currentUser);
  }, [currentUser]);

  // Global log generator helper
  const addLog = (
    userId: string, 
    userNama: string, 
    role: string, 
    aktivitas: string, 
    tipe: 'info' | 'warning' | 'success' | 'error'
  ) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      userId,
      userNama,
      role: role as any,
      aktivitas,
      tipe,
    };
    dbAddAuditLog(newLog);
  };

  // State handlers - Surat Masuk
  const handleAddSuratMasuk = (sm: SuratMasuk) => {
    dbAddSuratMasuk(sm);
  };

  const handleEditSuratMasuk = (updated: SuratMasuk) => {
    dbEditSuratMasuk(updated);
  };

  const handleDeleteSuratMasuk = (id: string) => {
    dbDeleteSuratMasuk(id);
  };

  // State handlers - Surat Keluar
  const handleAddSuratKeluar = (sk: SuratKeluar) => {
    dbAddSuratKeluar(sk);
  };

  const handleEditSuratKeluar = (updated: SuratKeluar) => {
    dbEditSuratKeluar(updated);
  };

  const handleUpdateSuratKeluarStatus = (id: string, status: SuratKeluar['status']) => {
    const sk = suratKeluar.find(x => x.id === id);
    if (sk) {
      dbEditSuratKeluar({ ...sk, status, catatanRevisi: undefined });
    }
  };

  const handleDeleteSuratKeluar = (id: string) => {
    dbDeleteSuratKeluar(id);
  };

  // State handler - Disposisi
  const handleAddDisposisi = (suratMasukId: string, disposisi: Disposisi) => {
    const sm = suratMasuk.find(x => x.id === suratMasukId);
    if (sm) {
      dbEditSuratMasuk({
        ...sm,
        disposisi: [disposisi, ...(sm.disposisi || [])]
      });
    }
  };

  const handleCompleteDisposisi = (suratMasukId: string, disposisiId: string) => {
    const sm = suratMasuk.find(x => x.id === suratMasukId);
    if (sm && sm.disposisi) {
      const updatedDisposisi = sm.disposisi.map(d => {
        if (d.id === disposisiId) {
          return { 
            ...d, 
            status: 'Selesai', 
            tanggalSelesai: new Date().toISOString() 
          };
        }
        return d;
      });
      dbEditSuratMasuk({ ...sm, disposisi: updatedDisposisi });
    }
  };

  // State handler - Kepsek approvals
  const handleApproveSuratKeluar = (id: string, ttdData: string) => {
    const sk = suratKeluar.find(x => x.id === id);
    if (sk) {
      dbEditSuratKeluar({
        ...sk,
        status: 'Ttd', // ready for TU to send
        ttdKepsek: ttdData,
        ttdTanggal: new Date().toISOString().split('T')[0],
        catatanRevisi: undefined
      });
    }
  };

  const handleRejectSuratKeluar = (id: string, catatan: string) => {
    const sk = suratKeluar.find(x => x.id === id);
    if (sk) {
      dbEditSuratKeluar({
        ...sk,
        status: 'Draft', // returns to TU Draft
        catatanRevisi: catatan
      });
    }
  };

  // State handler - User management
  const handleAddUser = (user: UserAccount) => {
    dbAddUser(user);
  };

  const handleToggleUserActive = (id: string) => {
    const u = users.find(x => x.id === id);
    if (u) {
      dbUpdateUser(id, { active: !u.active });
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      addLog(currentUser.id, currentUser.name, currentUser.role, 'Keluar (Logout) dari sistem', 'info');
    }
    setCurrentUser(null);
    setActiveNav('dashboard');
  };

  // Render role-specific main consoles
  const renderDashboardByRole = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case 'tu':
        return (
          <DashboardTU
            suratMasuk={suratMasuk}
            suratKeluar={suratKeluar}
            currentUser={currentUser}
            onAddSuratMasuk={handleAddSuratMasuk}
            onAddSuratKeluar={handleAddSuratKeluar}
            onEditSuratMasuk={handleEditSuratMasuk}
            onEditSuratKeluar={handleEditSuratKeluar}
            onUpdateSuratKeluarStatus={handleUpdateSuratKeluarStatus}
            onDeleteSuratMasuk={handleDeleteSuratMasuk}
            onDeleteSuratKeluar={handleDeleteSuratKeluar}
            addLog={addLog}
          />
        );
      case 'kepsek':
        return (
          <DashboardKepsek
            suratMasuk={suratMasuk}
            suratKeluar={suratKeluar}
            users={users}
            currentUser={currentUser}
            onAddDisposisi={handleAddDisposisi}
            onApproveSuratKeluar={handleApproveSuratKeluar}
            onRejectSuratKeluar={handleRejectSuratKeluar}
            addLog={addLog}
          />
        );
      case 'guru':
        return (
          <DashboardGuru
            suratMasuk={suratMasuk}
            currentUser={currentUser}
            onCompleteDisposisi={handleCompleteDisposisi}
            addLog={addLog}
          />
        );
      case 'admin':
        return (
          <DashboardAdmin
            users={users}
            auditLogs={auditLogs}
            currentUser={currentUser}
            onAddUser={handleAddUser}
            onToggleUserActive={handleToggleUserActive}
            addLog={addLog}
          />
        );
      default:
        return null;
    }
  };

  // If user is not logged in, render authentication gate
  if (!currentUser) {
    return (
      <LoginScreen
        users={users}
        onLoginSuccess={setCurrentUser}
        addLog={addLog}
      />
    );
  }

  // Get uncompleted dispositions count for notification bell (specifically for Guru)
  const getPendingTaskCount = () => {
    if (currentUser.role !== 'guru') return 0;
    let count = 0;
    suratMasuk.forEach(sm => {
      sm.disposisi?.forEach(d => {
        if (d.kepadaId === currentUser.id && d.status === 'Belum Selesai') {
          count++;
        }
      });
    });
    return count;
  };

  const pendingTaskCount = getPendingTaskCount();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none antialiased border-t-8 border-blue-700">
      
      {/* INSTITUTIONAL MAIN NAVIGATION BAR */}
      <header className="bg-blue-900 border-b-4 border-blue-600 shadow-md sticky top-0 z-40 print:hidden text-white select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Brand Area */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-sm">
                <School className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xs font-black tracking-widest text-slate-200 uppercase leading-none">
                  ARSIP DIGITAL
                </h1>
                <p className="text-[10px] text-amber-500 font-extrabold tracking-tight mt-0.5 leading-none">
                  SMP NEGERI 1 PADANG PANJANG
                </p>
              </div>
            </div>

            {/* Middle: Navigation tabs */}
            <nav className="hidden md:flex space-x-1">
              <button
                id="nav-btn-dashboard"
                onClick={() => setActiveNav('dashboard')}
                className={`px-3 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  activeNav === 'dashboard'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                Panel Utama
              </button>
              
              <button
                id="nav-btn-reports"
                onClick={() => setActiveNav('reports')}
                className={`px-3 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  activeNav === 'reports'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                Rekap Laporan
              </button>

              {currentUser.role === 'admin' && (
                <button
                  id="nav-btn-admin"
                  onClick={() => setActiveNav('admin')}
                  className={`px-3 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    activeNav === 'admin'
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  Sistem Admin
                </button>
              )}
            </nav>

            {/* Right: Active user state / Actions */}
            <div className="flex items-center gap-4">
              
              {/* Notification Badges */}
              {pendingTaskCount > 0 && (
                <div className="relative cursor-pointer hover:bg-slate-800 p-1.5 rounded-full transition-all" title={`${pendingTaskCount} Disposisi aktif`}>
                  <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white font-mono text-[8px] font-bold rounded-full flex items-center justify-center">
                    {pendingTaskCount}
                  </span>
                </div>
              )}

              {/* User badge */}
              <div className="text-right hidden sm:block">
                <span className="block text-xs font-extrabold text-slate-100">{currentUser.name}</span>
                <span className="inline-flex items-center text-[9px] bg-slate-800 border border-slate-700 text-amber-500 font-extrabold px-1.5 py-0.2 rounded font-mono mt-0.5">
                  {currentUser.role.toUpperCase()}
                </span>
              </div>

              {/* Logout button */}
              <button
                id="btn-logout"
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600/20 hover:bg-red-600 border border-red-500/30 hover:border-red-500 text-red-200 hover:text-white text-xs font-bold rounded-md transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE LOWER NAVIGATION (Visible on mobile only) */}
      <div className="md:hidden bg-slate-950 border-t border-slate-800 p-2 flex items-center justify-around fixed bottom-0 left-0 right-0 z-40 print:hidden select-none">
        <button
          id="mobile-nav-dashboard"
          onClick={() => setActiveNav('dashboard')}
          className={`flex flex-col items-center p-1 cursor-pointer transition-all ${
            activeNav === 'dashboard' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <FolderLock className="w-4.5 h-4.5" />
          <span className="text-[9px] font-bold mt-1">Konsol</span>
        </button>

        <button
          id="mobile-nav-reports"
          onClick={() => setActiveNav('reports')}
          className={`flex flex-col items-center p-1 cursor-pointer transition-all ${
            activeNav === 'reports' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <FileSpreadsheet className="w-4.5 h-4.5" />
          <span className="text-[9px] font-bold mt-1">Laporan</span>
        </button>

        {currentUser.role === 'admin' && (
          <button
            id="mobile-nav-admin"
            onClick={() => setActiveNav('admin')}
            className={`flex flex-col items-center p-1 cursor-pointer transition-all ${
              activeNav === 'admin' ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            <Users className="w-4.5 h-4.5" />
            <span className="text-[9px] font-bold mt-1">Admin</span>
          </button>
        )}
      </div>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        
        {/* Sync Status Banner */}
        <div className="mb-4 bg-slate-900 border border-slate-800 text-slate-300 p-2.5 rounded-lg flex items-center justify-between text-[10px] shadow-sm select-none print:hidden">
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute" />
              <span className="block w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
            </div>
            <span>
              Penyimpanan Luring Lanjutan Aktif (Local Storage Terenkripsi Lokal SMPN 1 PP)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-slate-500 animate-spin-slow" />
            <span className="text-slate-400 font-mono text-[9px]">SINKRONISASI AKTIF</span>
          </div>
        </div>

        {/* View Routing */}
        {activeNav === 'reports' ? (
          <ReportModule suratMasuk={suratMasuk} suratKeluar={suratKeluar} />
        ) : activeNav === 'admin' && currentUser.role === 'admin' ? (
          <DashboardAdmin
            users={users}
            auditLogs={auditLogs}
            currentUser={currentUser}
            onAddUser={handleAddUser}
            onToggleUserActive={handleToggleUserActive}
            addLog={addLog}
          />
        ) : (
          renderDashboardByRole()
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-[10px] text-slate-400 print:hidden select-none">
        <p>
          Arsip Surat Digital SMP Negeri 1 Padang Panjang • Dinas Pendidikan dan Kebudayaan Kota Padang Panjang, Sumatera Barat
        </p>
        <p className="mt-0.5">
          Keamanan & Enkripsi Lokal dijamin 100% aman dalam Cache Peramban • Sistem Kearsipan v3.5
        </p>
      </footer>

    </div>
  );
}
