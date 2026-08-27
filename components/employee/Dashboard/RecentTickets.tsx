import React from 'react';
import { Ticket } from '@/types/helpdesk';
import { StatusBadge } from '../StatusBadge';
import { PriorityBadge } from '../PriorityBadge';
import { EmptyState } from '../EmptyState';
import { Ticket as TicketIcon, ChevronRight, User, Clock, ArrowUpRight } from 'lucide-react';

interface RecentTicketsProps {
  tickets: Ticket[];
  onOpenTicket: (ticket: Ticket) => void;
  onViewAllTickets: () => void;
  onCreateTicket: () => void;
}

export const RecentTickets: React.FC<RecentTicketsProps> = ({
  tickets,
  onOpenTicket,
  onViewAllTickets,
  onCreateTicket,
}) => {
  const recentList = tickets.slice(0, 5);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 shadow-md">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <TicketIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Tiket Terbaru (Recent Tickets)</h3>
            <p className="text-xs text-zinc-400">Daftar tiket yang baru Anda laporkan</p>
          </div>
        </div>

        {tickets.length > 0 && (
          <button
            type="button"
            onClick={onViewAllTickets}
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>Lihat Semua Tiket</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {recentList.length === 0 ? (
        <EmptyState
          title="Belum ada tiket"
          description="Anda belum memiliki riwayat pengajuan tiket IT. Buat tiket baru jika membutuhkan bantuan."
          actionLabel="Buat Tiket Baru"
          onAction={onCreateTicket}
        />
      ) : (
        <div className="divide-y divide-zinc-800/80">
          {recentList.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => onOpenTicket(ticket)}
              className="group flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between cursor-pointer rounded-xl px-2.5 -mx-2.5 hover:bg-zinc-800/50 transition-all duration-150"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {ticket.number}
                  </span>
                  <span className="text-xs text-zinc-400">•</span>
                  <span className="text-xs text-zinc-400">{ticket.category}</span>
                  <span className="text-zinc-600 hidden sm:inline">/</span>
                  <span className="text-xs text-zinc-500 hidden sm:inline">{ticket.subcategory}</span>
                </div>

                <h4 className="mt-1.5 text-sm font-semibold text-zinc-200 group-hover:text-blue-300 transition-colors line-clamp-1">
                  {ticket.title}
                </h4>

                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3 text-zinc-500" />
                    {formatDate(ticket.createdAt)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <User className="h-3 w-3 text-zinc-500" />
                    {ticket.assigneeName || 'Menunggu Assignee'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-zinc-800/50">
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={ticket.priority} />
                  <StatusBadge status={ticket.status} size="sm" />
                </div>
                <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-150">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
