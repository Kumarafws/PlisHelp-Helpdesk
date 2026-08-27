import React from 'react';
import { UserProfile, Ticket } from '@/types/helpdesk';
import { User, Mail, Building, ShieldCheck, Ticket as TicketIcon, Calendar, CheckCircle2 } from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  tickets: Ticket[];
  onCreateTicket: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, tickets, onCreateTicket }) => {
  const closedCount = tickets.filter((t) => t.status === 'CLOSED').length;
  const activeCount = tickets.filter((t) => t.status !== 'CLOSED').length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Profil Karyawan (Employee Profile)</h1>
        <p className="text-sm text-zinc-400">Informasi akun pengguna dan statistik helpdesk Anda</p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-2xl shadow-xl shadow-blue-600/30">
            {user.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/20">
                {user.role}
              </span>
            </div>
            <p className="text-sm text-zinc-400">{user.email}</p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-zinc-500" />
                Departemen: <strong className="text-zinc-200">{user.department}</strong>
              </span>
              <span className="text-zinc-600">•</span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Akses Terverifikasi (Laravel Sanctum)
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 pt-6 border-t border-zinc-800">
          <div className="rounded-xl border border-zinc-800 bg-zinc-850/50 p-4">
            <div className="text-xs font-medium text-zinc-400">Total Tiket Diajukan</div>
            <div className="mt-1 text-2xl font-bold text-white">{tickets.length}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Sepanjang waktu</div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-850/50 p-4">
            <div className="text-xs font-medium text-zinc-400">Tiket Sedang Aktif</div>
            <div className="mt-1 text-2xl font-bold text-amber-400">{activeCount}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Memerlukan penanganan / respon</div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-850/50 p-4">
            <div className="text-xs font-medium text-zinc-400">Tiket Terselesaikan</div>
            <div className="mt-1 text-2xl font-bold text-emerald-400">{closedCount}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Sudah ditutup & dikonfirmasi</div>
          </div>
        </div>
      </div>
    </div>
  );
};
