import React from 'react';
import { DashboardSummary, Ticket, TicketStatus, UserProfile } from '@/types/helpdesk';
import { WelcomeBanner } from './WelcomeBanner';
import { SummaryCards } from './SummaryCards';
import { ActionRequired } from './ActionRequired';
import { StatusChart } from './StatusChart';
import { RecentTickets } from './RecentTickets';

interface EmployeeDashboardProps {
  user: UserProfile;
  tickets: Ticket[];
  summary: DashboardSummary;
  onCreateTicket: () => void;
  onOpenTicket: (ticket: Ticket) => void;
  onSelectStatusFilter: (status: TicketStatus | 'ALL') => void;
  onViewAllTickets: () => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  user,
  tickets,
  summary,
  onCreateTicket,
  onOpenTicket,
  onSelectStatusFilter,
  onViewAllTickets,
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. Welcome & Greeting Banner */}
      <WelcomeBanner user={user} onCreateTicket={onCreateTicket} />

      {/* 2. Summary Metric Cards (5 status counters) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Ringkasan Tiket Saya (My Tickets)
          </h2>
          <span className="text-xs text-zinc-500">Klik kartu untuk filter langsung</span>
        </div>
        <SummaryCards summary={summary} onSelectStatusFilter={onSelectStatusFilter} />
      </div>

      {/* 3. Action Required Section (If any NEED_INFO or RESOLVED tickets) */}
      <ActionRequired tickets={tickets} onOpenTicket={onOpenTicket} />

      {/* 4. Distribution Chart & Recent Tickets */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <RecentTickets
            tickets={tickets}
            onOpenTicket={onOpenTicket}
            onViewAllTickets={onViewAllTickets}
            onCreateTicket={onCreateTicket}
          />
        </div>
        <div className="lg:col-span-4">
          <StatusChart summary={summary} />
        </div>
      </div>
    </div>
  );
};
