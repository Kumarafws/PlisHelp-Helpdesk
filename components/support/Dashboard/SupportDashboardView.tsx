import React from 'react';
import { SupportDashboardSummary, Ticket, UserProfile } from '@/types/helpdesk';
import { SupportSummaryCards } from './SupportSummaryCards';
import { SupportAnalyticsCharts } from './SupportAnalyticsCharts';
import { MyAssignedTickets } from './MyAssignedTickets';
import { AvailableTickets } from './AvailableTickets';
import { Headphones, Sparkles } from 'lucide-react';

interface SupportDashboardViewProps {
  user: UserProfile;
  tickets: Ticket[];
  summary: SupportDashboardSummary;
  onFilterClick: (filterKey: string) => void;
  onOpenTicket: (ticket: Ticket) => void;
  onTakeTicket: (ticketId: string) => void;
  onViewMyTickets: () => void;
  onViewAvailableTickets: () => void;
}

export const SupportDashboardView: React.FC<SupportDashboardViewProps> = ({
  user,
  tickets,
  summary,
  onFilterClick,
  onOpenTicket,
  onTakeTicket,
  onViewMyTickets,
  onViewAvailableTickets,
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/30 via-zinc-900 to-zinc-900 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>IT SUPPORT OPERATIONS DESK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Selamat Datang, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-300">{user.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
            Pantau antrean tiket masuk, prioritaskan kendala mendekati batas SLA, dan tangani permohonan layanan IT lintas departemen perusahaan.
          </p>
        </div>
      </div>

      {/* 5 Summary Metric Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Ringkasan Antrean & Beban Kerja
          </h2>
          <span className="text-[11px] text-zinc-500">Klik kartu untuk filter daftar tiket</span>
        </div>
        <SupportSummaryCards summary={summary} onFilterClick={onFilterClick} />
      </div>

      {/* Recharts Visualizations */}
      <SupportAnalyticsCharts tickets={tickets} />

      {/* Two Column Grid: My Assigned Tickets + Available Tickets */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MyAssignedTickets
          tickets={tickets}
          currentUser={user}
          onOpenTicket={onOpenTicket}
          onViewAll={onViewMyTickets}
        />

        <AvailableTickets
          tickets={tickets}
          onTakeTicket={onTakeTicket}
          onOpenTicket={onOpenTicket}
          onViewAll={onViewAvailableTickets}
        />
      </div>
    </div>
  );
};
