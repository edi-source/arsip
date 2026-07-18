import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  getDocs 
} from "firebase/firestore";
import { UserAccount, SuratMasuk, SuratKeluar, AuditLog } from "../types";
import { DEFAULT_USERS, DEFAULT_SURAT_MASUK, DEFAULT_SURAT_KELUAR, DEFAULT_AUDIT_LOGS } from "../data";

// Firebase Config
// Supports dynamic insertion of environment variables from .env
const metaEnv = (import.meta as any).env || {};
const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyDrxb3AQ0oiKDA0B2LIHBbXe3f3xm0u7jM",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "arsip-2be3b.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "arsip-2be3b",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "arsip-2be3b.firebasestorage.app",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "485205785785",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:485205785785:web:a43108c100c293dbbbef68"
};

const isFirebaseConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

let db: any = null;

if (isFirebaseConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    console.log("Firebase initialized successfully with config.");
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

// ==========================================
// MOCK REALTIME EMULATOR (BROADCASTCHANNEL SYNC)
// ==========================================
// This runs if real Firebase is not configured, ensuring zero-configuration, 
// flawless performance, and instant multi-tab/iframe real-time synchronization.

class RealtimeLocalDB {
  private listeners: { [collection: string]: Set<(data: any[]) => void> } = {};
  private channel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.channel = new BroadcastChannel('smpn1_arsip_sync');
      this.channel.onmessage = (event) => {
        const { collectionName } = event.data;
        if (collectionName) {
          this.triggerListeners(collectionName);
        }
      };
    }
  }

  private getCollectionData(collectionName: string): any[] {
    const key = `smpn1_arsip_${collectionName}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing local collection data", e);
      }
    }

    // Default Seed Data
    if (collectionName === 'users') return DEFAULT_USERS;
    if (collectionName === 'surat_masuk') return DEFAULT_SURAT_MASUK;
    if (collectionName === 'surat_keluar') return DEFAULT_SURAT_KELUAR;
    if (collectionName === 'audit_logs') return DEFAULT_AUDIT_LOGS;
    return [];
  }

  private saveCollectionData(collectionName: string, data: any[]) {
    const key = `smpn1_arsip_${collectionName}`;
    localStorage.setItem(key, JSON.stringify(data));
    this.triggerListeners(collectionName);
    this.channel?.postMessage({ collectionName });
  }

  private triggerListeners(collectionName: string) {
    if (this.listeners[collectionName]) {
      const data = this.getCollectionData(collectionName);
      this.listeners[collectionName].forEach(cb => cb(data));
    }
  }

  subscribe(collectionName: string, callback: (data: any[]) => void): () => void {
    if (!this.listeners[collectionName]) {
      this.listeners[collectionName] = new Set();
    }
    this.listeners[collectionName].add(callback);
    
    // Initial fetch
    callback(this.getCollectionData(collectionName));

    return () => {
      this.listeners[collectionName]?.delete(callback);
    };
  }

  async add(collectionName: string, item: any): Promise<void> {
    const current = this.getCollectionData(collectionName);
    const updated = [item, ...current];
    this.saveCollectionData(collectionName, updated);
  }

  async update(collectionName: string, id: string, updatedFields: any): Promise<void> {
    const current = this.getCollectionData(collectionName);
    const updated = current.map(item => item.id === id ? { ...item, ...updatedFields } : item);
    this.saveCollectionData(collectionName, updated);
  }

  async delete(collectionName: string, id: string): Promise<void> {
    const current = this.getCollectionData(collectionName);
    const updated = current.filter(item => item.id !== id);
    this.saveCollectionData(collectionName, updated);
  }

  async saveAll(collectionName: string, items: any[]): Promise<void> {
    this.saveCollectionData(collectionName, items);
  }
}

const mockDb = new RealtimeLocalDB();

// ==========================================
// REAL-TIME API INTERFACE
// ==========================================

// Subscribe to Users
export const subscribeUsers = (callback: (users: UserAccount[]) => void): () => void => {
  if (db) {
    return onSnapshot(collection(db, "users"), (snapshot) => {
      const list: UserAccount[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as UserAccount);
      });
      if (list.length > 0) {
        mockDb.saveAll("users", list);
        callback(list);
      } else {
        mockDb.subscribe("users", callback);
      }
    }, (error) => {
      console.warn("Firestore error, falling back to mock:", error);
      mockDb.subscribe("users", callback);
    });
  }
  return mockDb.subscribe("users", callback);
};

// Subscribe to Surat Masuk
export const subscribeSuratMasuk = (callback: (surat: SuratMasuk[]) => void): () => void => {
  if (db) {
    return onSnapshot(collection(db, "surat_masuk"), (snapshot) => {
      const list: SuratMasuk[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as SuratMasuk);
      });
      if (list.length > 0) {
        mockDb.saveAll("surat_masuk", list);
        callback(list);
      } else {
        mockDb.subscribe("surat_masuk", callback);
      }
    }, (error) => {
      console.warn("Firestore error, falling back to mock:", error);
      mockDb.subscribe("surat_masuk", callback);
    });
  }
  return mockDb.subscribe("surat_masuk", callback);
};

// Subscribe to Surat Keluar
export const subscribeSuratKeluar = (callback: (surat: SuratKeluar[]) => void): () => void => {
  if (db) {
    return onSnapshot(collection(db, "surat_keluar"), (snapshot) => {
      const list: SuratKeluar[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as SuratKeluar);
      });
      if (list.length > 0) {
        mockDb.saveAll("surat_keluar", list);
        callback(list);
      } else {
        mockDb.subscribe("surat_keluar", callback);
      }
    }, (error) => {
      console.warn("Firestore error, falling back to mock:", error);
      mockDb.subscribe("surat_keluar", callback);
    });
  }
  return mockDb.subscribe("surat_keluar", callback);
};

// Subscribe to Audit Logs
export const subscribeAuditLogs = (callback: (logs: AuditLog[]) => void): () => void => {
  if (db) {
    const q = query(collection(db, "audit_logs"), orderBy("timestamp", "desc"));
    return onSnapshot(q, (snapshot) => {
      const list: AuditLog[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as AuditLog);
      });
      if (list.length > 0) {
        mockDb.saveAll("audit_logs", list);
        callback(list);
      } else {
        mockDb.subscribe("audit_logs", callback);
      }
    }, (error) => {
      console.warn("Firestore error, falling back to mock:", error);
      mockDb.subscribe("audit_logs", callback);
    });
  }
  return mockDb.subscribe("audit_logs", callback);
};

// ------------------------------------------
// Mutations
// ------------------------------------------

// Add User
export const addUser = async (user: UserAccount): Promise<void> => {
  await mockDb.add("users", user);
  if (db) {
    try {
      await setDoc(doc(db, "users", user.id), user);
    } catch (e) {
      console.error("Firestore user add failed:", e);
    }
  }
};

// Update User
export const updateUser = async (id: string, updatedFields: Partial<UserAccount>): Promise<void> => {
  await mockDb.update("users", id, updatedFields);
  if (db) {
    try {
      await updateDoc(doc(db, "users", id), updatedFields);
    } catch (e) {
      console.error("Firestore user update failed:", e);
    }
  }
};

// Save All Users (Used in Admin user initialization or resets)
export const saveAllUsers = async (users: UserAccount[]): Promise<void> => {
  await mockDb.saveAll("users", users);
  if (db) {
    try {
      for (const u of users) {
        await setDoc(doc(db, "users", u.id), u);
      }
    } catch (e) {
      console.error("Firestore saveAllUsers failed:", e);
    }
  }
};

// Add Surat Masuk
export const addSuratMasuk = async (sm: SuratMasuk): Promise<void> => {
  await mockDb.add("surat_masuk", sm);
  if (db) {
    try {
      await setDoc(doc(db, "surat_masuk", sm.id), sm);
    } catch (e) {
      console.error("Firestore addSuratMasuk failed:", e);
    }
  }
};

// Edit Surat Masuk
export const editSuratMasuk = async (sm: SuratMasuk): Promise<void> => {
  await mockDb.update("surat_masuk", sm.id, sm);
  if (db) {
    try {
      await setDoc(doc(db, "surat_masuk", sm.id), sm);
    } catch (e) {
      console.error("Firestore editSuratMasuk failed:", e);
    }
  }
};

// Delete Surat Masuk
export const deleteSuratMasuk = async (id: string): Promise<void> => {
  await mockDb.delete("surat_masuk", id);
  if (db) {
    try {
      await deleteDoc(doc(db, "surat_masuk", id));
    } catch (e) {
      console.error("Firestore deleteSuratMasuk failed:", e);
    }
  }
};

// Add Surat Keluar
export const addSuratKeluar = async (sk: SuratKeluar): Promise<void> => {
  await mockDb.add("surat_keluar", sk);
  if (db) {
    try {
      await setDoc(doc(db, "surat_keluar", sk.id), sk);
    } catch (e) {
      console.error("Firestore addSuratKeluar failed:", e);
    }
  }
};

// Edit Surat Keluar
export const editSuratKeluar = async (sk: SuratKeluar): Promise<void> => {
  await mockDb.update("surat_keluar", sk.id, sk);
  if (db) {
    try {
      await setDoc(doc(db, "surat_keluar", sk.id), sk);
    } catch (e) {
      console.error("Firestore editSuratKeluar failed:", e);
    }
  }
};

// Delete Surat Keluar
export const deleteSuratKeluar = async (id: string): Promise<void> => {
  await mockDb.delete("surat_keluar", id);
  if (db) {
    try {
      await deleteDoc(doc(db, "surat_keluar", id));
    } catch (e) {
      console.error("Firestore deleteSuratKeluar failed:", e);
    }
  }
};

// Add Audit Log
export const addAuditLog = async (log: AuditLog): Promise<void> => {
  await mockDb.add("audit_logs", log);
  if (db) {
    try {
      await setDoc(doc(db, "audit_logs", log.id), log);
    } catch (e) {
      console.error("Firestore addAuditLog failed:", e);
    }
  }
};
