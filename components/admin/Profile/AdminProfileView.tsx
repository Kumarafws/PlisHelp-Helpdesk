import React from 'react';
import { UserProfile, Ticket, ManagedUser } from '@/types/helpdesk';
import { ShieldCheck, Users, Building, Layers, Clock, Mail } from 'lucide-react';

interface AdminProfileViewProps {
  user: UserProfile;
  tickets: Ticket[];
  users: ManagedUser[];
}

export const AdminProfileView: React.FC<AdminProfileViewProps> = ({
  user,
  tickets,
  users,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Profil Administrator Sistem</h1>
        <p className="text-xs text-zinc-400">Informasi kredensial dan ruang lingkup otoritas sistem helpdesk</p>
      </div>

      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-2xl shadow-xl shadow-purple-600/30">
            AD
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400 border border-purple-500/20">
                Super Administrator
              </span>
            </div>
            <p className="text-xs text-zinc-400">{user.email}</p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-zinc-500" />
                Unit: <strong className="text-zinc-200">{user.department}</strong>
              </span>
              <span className="text-zinc-600">•</span>
              <span className="inline-flex items-center gap-1.5 text-purple-400 font-medium">
                <ShieldCheck className="h-3.5 w-3.5" />
                Akses Otoritas: Penuh (Full Control)
              </span>
            </div>
          </div>
        </div>

        {/* System Scope Metrics */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 pt-6 border-t border-zinc-800">
          <div className="rounded-xl border border-zinc-800 bg-zinc-850/50 p-4">
            <div className="text-xs font-medium text-zinc-400">Total Pengguna Terdaftar</div>
            <div className="mt-1 text-2xl font-bold text-white">{users.length} User</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Employee, Support & Admin</div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-850/50 p-4">
            <div className="text-xs font-medium text-zinc-400">Total Tiket Sistem</div>
            <div className="mt-1 text-2xl font-bold text-purple-400">{tickets.length} Tiket</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Arsip & tiket aktif</div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-850/50 p-4">
            <div className="text-xs font-medium text-zinc-400">Status Sistem Helpdesk</div>
            <div className="mt-1 text-2xl font-bold text-emerald-400">Operational</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">All services healthy</div>
          </div>
        </div>
      </div>
    </div>
  );
};
