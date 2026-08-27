import React from 'react';
import { Ticket, UserProfile } from '@/types/helpdesk';
import { StatusBadge } from '../employee/StatusBadge';
import { PriorityBadge } from '../employee/PriorityBadge';
import {
  Headphones,
  LayoutDashboard,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Ticket as TicketIcon,
  LogOut,
  ChevronRight,
  ShieldCheck,
  User,
  Sparkles,
} from 'lucide-react';

interface SupportDashboardProps {
  user: UserProfile;
  tickets: Ticket[];
  onLogout: () => void;
}

export const SupportDashboard: React.FC<SupportDashboardProps> = ({ user, tickets, onLogout }) => {
  const activeTickets = tickets.filter(
    (t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS' || t.status === 'NEED_INFO'
  );
  const needInfoTickets = tickets.filter((t) => t.status === 'NEED_INFO');
  const resolvedTickets = tickets.filter((t) => t.status === 'RESOLVED');
  const closedTickets = tickets.filter((t) => t.status === 'CLOSED');

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
      {/* Sidebar IT Support */}
      <aside className="w-64 flex flex-col justify-between border-r border-zinc-800 bg-zinc-900/70 p-5 shrink-0 sticky top-0 h-screen">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-white flex items-center gap-1">
                Plis<span className="text-indigo-400">Help</span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                IT SUPPORT PORTAL
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-850/50 p-3 text-xs">
            <div className="text-zinc-400 text-[11px]">Penugasan Unit</div>
            <div className="font-bold text-zinc-200 mt-0.5">{user.department}</div>
            <div className="mt-1 flex items-center gap-1 text-emerald-400 text-[10px] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>Duty Active</span>
            </div>
          </div>

          <nav className="space-y-1">
            <div className="px-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
              Workspace IT Support
            </div>
            <button className="flex w-full items-center gap-3 rounded-xl bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 px-3.5 py-2.5 text-xs font-semibold">
              <LayoutDashboard className="h-4 w-4" />
              <span>Queue Dashboard</span>
            </button>
            <button className="flex w-full items-center gap-3 rounded-xl text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200 px-3.5 py-2.5 text-xs font-medium transition-all">
              <TicketIcon className="h-4 w-4" />
              <span>Semua Antrean Tiket</span>
            </button>
          </nav>
        </div>

        <div className="space-y-3 pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 rounded-xl bg-zinc-850 p-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-300 font-bold text-xs">
              BS
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
        {/* Top Notification Banner */}
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 via-zinc-900 to-zinc-900 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>IT SUPPORT WORKSPACE</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Selamat Datang, {user.name}</h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Anda sedang berada di dashboard <strong>IT Support</strong>. Sesuai instruksi PRD saat ini fokus fitur utama telah disiapkan pada Employee Experience. Antrean tiket di bawah ini menampilkan tiket yang diajukan oleh karyawan.
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="text-xs text-zinc-400">Total Antrean Aktif</div>
            <div className="mt-2 text-2xl font-bold text-blue-400">{activeTickets.length}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Memerlukan penanganan</div>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="text-xs text-zinc-400">Menunggu Respon (Need Info)</div>
            <div className="mt-2 text-2xl font-bold text-orange-400">{needInfoTickets.length}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Menunggu respon requester</div>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="text-xs text-zinc-400">Resolved Hari Ini</div>
            <div className="mt-2 text-2xl font-bold text-emerald-400">{resolvedTickets.length}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Menunggu konfirmasi employee</div>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="text-xs text-zinc-400">SLA Compliance</div>
            <div className="mt-2 text-2xl font-bold text-white">98.2%</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">Dalam batas target</div>
          </div>
        </div>

        {/* Queue Table */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white">Daftar Antrean Tiket (Incoming Queue)</h2>
              <p className="text-xs text-zinc-400">Seluruh laporan masuk dari seluruh departemen perusahaan</p>
            </div>
            <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-300">
              {tickets.length} total tiket
            </span>
          </div>

          <div className="divide-y divide-zinc-800">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-indigo-400 font-semibold">{ticket.number}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-xs text-zinc-400">{ticket.category}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-xs text-zinc-400">Requester: <strong className="text-zinc-200">{ticket.requesterName}</strong> ({ticket.requesterDepartment})</span>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-200 mt-1">{ticket.title}</h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <PriorityBadge priority={ticket.priority} />
                  <StatusBadge status={ticket.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
