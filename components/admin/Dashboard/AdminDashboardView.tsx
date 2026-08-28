import React from 'react';
import { AdminDashboardSummary, Ticket, UserProfile, ManagedUser } from '@/types/helpdesk';
import { AdminSummaryCards } from './AdminSummaryCards';
import { AdminSLAMonitoring } from './AdminSLAMonitoring';
import { AdminAnalyticsCharts } from './AdminAnalyticsCharts';
import { StatusBadge } from '@/components/employee/StatusBadge';
import { PriorityBadge } from '@/components/employee/PriorityBadge';
import { SLABadge } from '@/components/support/SLABadge';
import { ShieldCheck, Sparkles, UserCheck, ArrowUpRight, ChevronRight, UserPlus, Building, Layers } from 'lucide-react';

interface AdminDashboardViewProps {
  user: UserProfile;
  tickets: Ticket[];
  users: ManagedUser[];
  summary: AdminDashboardSummary;
  onFilterClick: (statusKey: string) => void;
  onOpenTicket: (ticket: Ticket) => void;
  onNavigateToTab: (tab: any) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  user,
  tickets,
  users,
  summary,
  onFilterClick,
  onOpenTicket,
  onNavigateToTab,
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-zinc-900 to-zinc-900 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400 border border-purple-500/20 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>IT ADMINISTRATION CONSOLE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Selamat Datang, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">{user.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
            Pusat kendali operasional helpdesk, monitoring pemenuhan SLA, penugasan teknisi, serta pengelolaan master data organisasi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigateToTab('users')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3.5 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            <UserPlus className="h-4 w-4 text-purple-400" />
            <span>Kelola User</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateToTab('tickets')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-500 transition-all"
          >
            <span>Semua Tiket</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <AdminSummaryCards
        summary={summary}
        onFilterClick={onFilterClick}
        onNavigateToUsers={() => onNavigateToTab('users')}
      />

      {/* SLA Monitoring Component */}
      <AdminSLAMonitoring tickets={tickets} complianceRate={summary.slaComplianceRate} />

      {/* Analytics Recharts */}
      <AdminAnalyticsCharts tickets={tickets} />

      {/* Recent High Priority & Unassigned Tickets Queue */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">Tiket Masuk Terbaru & Antrean Penugasan</h3>
            <p className="text-xs text-zinc-400">Daftar laporan yang memerlukan atensi atau assignment IT Support</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab('tickets')}
            className="inline-flex items-center gap-1 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>Buka Seluruh Tiket</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {tickets.slice(0, 5).map((ticket) => {
            const isUnassigned =
              ticket.status === 'OPEN' ||
              !ticket.assigneeName ||
              ticket.assigneeName === 'Belum Ditugaskan';

            return (
              <div
                key={ticket.id}
                onClick={() => onOpenTicket(ticket)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 cursor-pointer rounded-xl px-2.5 -mx-2.5 hover:bg-zinc-800/50 transition-all"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {ticket.number}
                    </span>
                    <span className="text-xs text-zinc-400">{ticket.category}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-xs text-zinc-400">
                      Requester: <strong className="text-zinc-200">{ticket.requesterName}</strong> ({ticket.requesterDepartment})
                    </span>
                  </div>

                  <h4 className="mt-1 text-sm font-semibold text-zinc-200 group-hover:text-purple-300 transition-colors line-clamp-1">
                    {ticket.title}
                  </h4>

                  <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                    <span>Assignee:</span>
                    <span className={isUnassigned ? 'text-amber-400 font-medium' : 'text-zinc-300'}>
                      {ticket.assigneeName || 'Belum Ditugaskan'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-zinc-800/50">
                  <SLABadge
                    status={ticket.slaInfo?.status || (ticket.status === 'NEED_INFO' ? 'PAUSED' : 'WITHIN_SLA')}
                    remainingTime={ticket.slaInfo?.remainingTimeFormatted}
                    size="sm"
                  />
                  <PriorityBadge priority={ticket.priority} />
                  <StatusBadge status={ticket.status} size="sm" />
                  <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
