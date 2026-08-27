import React from 'react';
import { Ticket, UserProfile } from '@/types/helpdesk';
import { CATEGORIES_DATA } from '@/services/mockTicketService';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Building,
  Layers,
  BarChart3,
  LogOut,
  ChevronRight,
  Sparkles,
  Lock,
} from 'lucide-react';

interface AdminDashboardProps {
  user: UserProfile;
  tickets: Ticket[];
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, tickets, onLogout }) => {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
      {/* Sidebar Admin */}
      <aside className="w-64 flex flex-col justify-between border-r border-zinc-800 bg-zinc-900/70 p-5 shrink-0 sticky top-0 h-screen">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-600/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-white flex items-center gap-1">
                Plis<span className="text-purple-400">Help</span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                ADMINISTRATION PANEL
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-850/50 p-3 text-xs">
            <div className="text-zinc-400 text-[11px]">Scope Kewenangan</div>
            <div className="font-bold text-zinc-200 mt-0.5">{user.department}</div>
            <div className="mt-1 flex items-center gap-1 text-purple-400 text-[10px] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400"></span>
              <span>Super Administrator</span>
            </div>
          </div>

          <nav className="space-y-1">
            <div className="px-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              Master Data & Settings
            </div>
            <button className="flex w-full items-center gap-3 rounded-xl bg-purple-600/15 text-purple-400 border border-purple-500/30 px-3.5 py-2.5 text-xs font-semibold">
              <LayoutDashboard className="h-4 w-4" />
              <span>Admin Overview</span>
            </button>
            <button className="flex w-full items-center gap-3 rounded-xl text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200 px-3.5 py-2.5 text-xs font-medium transition-all">
              <Users className="h-4 w-4" />
              <span>User & Role Access</span>
            </button>
            <button className="flex w-full items-center gap-3 rounded-xl text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200 px-3.5 py-2.5 text-xs font-medium transition-all">
              <Building className="h-4 w-4" />
              <span>Department Master</span>
            </button>
            <button className="flex w-full items-center gap-3 rounded-xl text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200 px-3.5 py-2.5 text-xs font-medium transition-all">
              <Layers className="h-4 w-4" />
              <span>Category & Subcategory</span>
            </button>
          </nav>
        </div>

        <div className="space-y-3 pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 rounded-xl bg-zinc-850 p-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600/20 text-purple-300 font-bold text-xs">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-zinc-200 truncate">{user.name}</div>
              <div className="text-[11px] text-zinc-400 truncate">{user.role}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 py-2 text-xs font-medium text-zinc-400 hover:bg-rose-950/30 hover:border-rose-800/50 hover:text-rose-300 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Keluar ke Halaman Awal</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-zinc-900 to-zinc-900 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400 border border-purple-500/20 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>ADMINISTRATION WORKSPACE</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Control Panel</h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Selamat datang, <strong>{user.name}</strong>. Anda memiliki otoritas penuh untuk mengonfigurasi master data organisasi, struktur departemen, dan kategori helpdesk.
            </p>
          </div>
        </div>

        {/* Master Data Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Users & Roles</h3>
              <p className="text-xs text-zinc-400 mt-0.5">128 karyawan terdaftar di sistem</p>
            </div>
            <div className="pt-2 text-xs text-blue-400 flex items-center gap-1 font-medium">
              <span>Kelola Akun Pengguna</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Departemen</h3>
              <p className="text-xs text-zinc-400 mt-0.5">8 unit organisasi perusahaan</p>
            </div>
            <div className="pt-2 text-xs text-purple-400 flex items-center gap-1 font-medium">
              <span>Kelola Struktur Departemen</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Kategori & Subkategori</h3>
              <p className="text-xs text-zinc-400 mt-0.5">{CATEGORIES_DATA.length} kategori utama helpdesk</p>
            </div>
            <div className="pt-2 text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <span>Kelola Taksonomi Masalah</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
