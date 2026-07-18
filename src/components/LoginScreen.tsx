/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserAccount } from '../types';
import { Lock, User, KeyRound, School, Check, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  users: UserAccount[];
  onLoginSuccess: (user: UserAccount) => void;
  addLog: (userId: string, userNama: string, role: string, aktivitas: string, tipe: 'info' | 'warning' | 'success' | 'error') => void;
}

export default function LoginScreen({ users, onLoginSuccess, addLog }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Silakan isi Username dan Kata Sandi.');
      return;
    }

    // Match credentials
    const userObj = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
    let matchedRole: string | null = null;
    let expectedPass = '';

    if (userObj) {
      matchedRole = userObj.role;
      if (userObj.username === 'admin') {
        expectedPass = 'admin123';
      } else if (userObj.username === 'kepsek') {
        expectedPass = 'kepsek123';
      } else if (userObj.username === 'tu') {
        expectedPass = 'tu123';
      } else if (userObj.username === 'guru') {
        expectedPass = 'guru123';
      } else {
        // Untuk akun kustom baru, sandi default disesuaikan dengan peran mereka (misal: guru123 atau tu123)
        // Kami juga mendukung 'sandi123' atau '123456' sebagai opsi universal agar mudah
        if (password === `${userObj.role}123` || password === 'sandi123' || password === '123456') {
          expectedPass = password;
        } else {
          expectedPass = `${userObj.role}123`; // Default jika salah
        }
      }
    }

    if (!matchedRole || password !== expectedPass) {
      setError('Kredensial salah! Silakan periksa kembali Username dan Kata Sandi Anda.');
      return;
    }

    if (userObj) {
      if (!userObj.active) {
        setError('Akun Anda dinonaktifkan oleh Administrator.');
        return;
      }
      addLog(userObj.id, userObj.name, userObj.role, `Berhasil masuk ke dalam sistem sebagai ${userObj.role.toUpperCase()}`, 'success');
      onLoginSuccess(userObj);
    } else {
      setError('Akun tidak ditemukan dalam database.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 md:p-6 select-none font-sans relative overflow-hidden">
      {/* Decorative background accents */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-950/85 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl overflow-hidden p-8 flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-900 border border-slate-800 text-amber-500 mb-3 animate-pulse">
            <School className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-extrabold text-white tracking-tight uppercase">
            Arsip Surat Digital
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            SMP Negeri 1 Padang Panjang • Sumatera Barat
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-950/40 border border-red-800 rounded-lg flex items-start gap-2 text-red-400 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleManualLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1.5">
              Username Akun
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                id="input-username"
                type="text"
                placeholder="Masukkan username Anda"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="input-password"
                type="password"
                placeholder="Masukkan sandi akses Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>
          </div>

          <button
            id="btn-login-submit"
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-3 rounded-lg shadow-md hover:shadow-amber-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            <KeyRound className="w-4 h-4" />
            Masuk ke Aplikasi
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-800/40 pt-4">
          <p className="text-[10px] text-slate-500 leading-normal">
            Sistem Kearsipan Resmi SMPN 1 Padang Panjang.<br />
            Sumatera Barat • Hak Cipta Dilindungi © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
