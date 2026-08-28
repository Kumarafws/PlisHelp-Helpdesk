import React from 'react';
import { UserProfile, Ticket } from '@/types/helpdesk';
import { Headphones, ShieldCheck, Clock, CheckCircle2, AlertTriangle, Building, Mail } from 'lucide-react';

interface SupportProfileViewProps {
  user: UserProfile;
  tickets: Ticket[];
}

export const SupportProfileView: React.FC<SupportProfileViewProps> = ({ user, tickets }) => {
  const myAssigned = tickets.filter(
    (t) => t.assigneeEmail === user.email || t.assigneeName?.includes(user.name)
  );
  const myResolved = myAssigned.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED');
  const myActive = myAssigned.filter((t) => t.status !== 'CLOSED' && t.status !== 'RESOLVED');

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Profil Petugas IT Support</h1>
        <p className="text-xs text-zinc-400">Informasi teknisi resolver dan metrik kinerja penyelesaian kendala</p>
      </div>

      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white font-bold text-2xl shadow-xl shadow-indigo-600/30">
            {user.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                {user.role} (Resolver)
              </span>
            </div>
            <p className="text-xs text-zinc-400">{user.email}</p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-zinc-500" />
                Unit: <strong className="text-zinc-200">{user.department}</strong>
              </span>
              <span className="text-zinc-600">•</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Status Penugasan: Aktif
              </span>
            </div>
          </div>
        </div>

        {/* Support Resolver KPI Metrics */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 pt-6 border-t border-zinc-800">
          <div className="rounded-xl border border-zinc-800 bg-zinc-850/50 p-4">
            <div className="text-xs font-medium text-zinc-400">Total Tiket Ditangani</div>
            <div className="mt-1 text-2xl font-bold text-white">{myAssigned.length}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Sepanjang periode operasional</div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-850/50 p-4">
            <div className="text-xs font-medium text-zinc-400">Sedang Aktif Dikerjakan</div>
            <div className="mt-1 text-2xl font-bold text-amber-400">{myActive.length}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Membutuhkan investigasi / respon</div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-850/50 p-4">
            <div className="text-xs font-medium text-zinc-400">Berhasil Diselesaikan</div>
            <div className="mt-1 text-2xl font-bold text-emerald-400">{myResolved.length}</div>
            <div className="text-[11px] text-zinc-500 mt-0.5">Status Resolved & Closed</div>
          </div>
        </div>
      </div>
    </div>
  );
};
