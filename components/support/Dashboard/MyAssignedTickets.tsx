import React from 'react';
import { Ticket, UserProfile } from '@/types/helpdesk';
import { StatusBadge } from '@/components/employee/StatusBadge';
import { PriorityBadge } from '@/components/employee/PriorityBadge';
import { SLABadge } from '../SLABadge';
import { EmptyState } from '@/components/employee/EmptyState';
import { UserCheck, Clock, User, ChevronRight, ArrowUpRight } from 'lucide-react';

interface MyAssignedTicketsProps {
  tickets: Ticket[];
  currentUser: UserProfile;
  onOpenTicket: (ticket: Ticket) => void;
  onViewAll: () => void;
}

export const MyAssignedTickets: React.FC<MyAssignedTicketsProps> = ({
  tickets,
  currentUser,
  onOpenTicket,
  onViewAll,
}) => {
  // Filter tickets assigned to current IT Support and active
  const myTickets = tickets.filter(
    (t) =>
      (t.assigneeEmail === currentUser.email || t.assigneeName?.includes(currentUser.name)) &&
      t.status !== 'CLOSED'
  );

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
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Tiket Tanggungan Saya (My Assigned Tickets)</h3>
            <p className="text-xs text-zinc-400">Tiket yang sedang Anda tangani secara aktif</p>
          </div>
        </div>

        {myTickets.length > 0 && (
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {myTickets.length === 0 ? (
        <EmptyState
          title="Tidak ada tiket aktif"
          description="Saat ini Anda tidak memiliki tiket yang sedang dalam penanganan. Ambil tiket baru dari antrean Available Tickets."
        />
      ) : (
        <div className="divide-y divide-zinc-800/80">
          {myTickets.slice(0, 5).map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => onOpenTicket(ticket)}
              className="group flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between cursor-pointer rounded-xl px-2.5 -mx-2.5 hover:bg-zinc-800/50 transition-all"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {ticket.number}
                  </span>
                  <span className="text-xs text-zinc-400">{ticket.category}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs text-zinc-400">
                    Pemohon: <strong className="text-zinc-200">{ticket.requesterName}</strong> ({ticket.requesterDepartment})
                  </span>
                </div>

                <h4 className="mt-1.5 text-sm font-semibold text-zinc-200 group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {ticket.title}
                </h4>

                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3 text-zinc-500" />
                    {formatDate(ticket.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-zinc-800/50">
                <SLABadge
                  status={ticket.slaInfo?.status || (ticket.status === 'NEED_INFO' ? 'PAUSED' : 'WITHIN_SLA')}
                  remainingTime={ticket.slaInfo?.remainingTimeFormatted || '01h 45m'}
                  size="sm"
                />
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} size="sm" />
                <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
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
