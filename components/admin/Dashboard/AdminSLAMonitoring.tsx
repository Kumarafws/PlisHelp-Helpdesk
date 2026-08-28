import React from 'react';
import { Ticket } from '@/types/helpdesk';
import { ShieldCheck, AlertTriangle, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

interface AdminSLAMonitoringProps {
  tickets: Ticket[];
  complianceRate: number;
}

export const AdminSLAMonitoring: React.FC<AdminSLAMonitoringProps> = ({
  tickets,
  complianceRate,
}) => {
  const atRiskCount = tickets.filter((t) => t.slaInfo?.status === 'AT_RISK').length;
  const breachedCount = tickets.filter((t) => t.slaInfo?.status === 'BREACHED').length;
  const withinCount = tickets.filter(
    (t) => !t.slaInfo || t.slaInfo.status === 'WITHIN_SLA' || t.slaInfo.status === 'PAUSED'
  ).length;

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">SLA Operations Monitoring</h3>
            <p className="text-xs text-zinc-400">Tingkat kepatuhan waktu penanganan SLA helpdesk perusahaan</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Target Efektivitas:</span>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            ≥ 95.0%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Compliance Rate */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-850/40 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>SLA Compliance Rate</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white tracking-tight">{complianceRate}%</div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${Math.min(complianceRate, 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">Dalam batas aman target SLA</span>
        </div>

        {/* Tickets At Risk */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-850/40 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Tiket At Risk (&lt; 1 Jam)</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-amber-400 tracking-tight">{atRiskCount}</div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Tiket yang sedang berjalan dan mendekati batas target resolusi.
          </p>
        </div>

        {/* Tickets Breached */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-850/40 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Tiket Melewati Batas (Breached)</span>
            <AlertCircle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-3xl font-bold text-rose-400 tracking-tight">{breachedCount}</div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Tiket yang melewati batas waktu penyelesaian yang disepakati.
          </p>
        </div>
      </div>
    </div>
  );
};
