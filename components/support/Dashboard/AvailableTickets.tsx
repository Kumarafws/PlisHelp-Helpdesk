import React, { useState } from 'react';
import { Ticket } from '@/types/helpdesk';
import { StatusBadge } from '@/components/employee/StatusBadge';
import { PriorityBadge } from '@/components/employee/PriorityBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { SLABadge } from '../SLABadge';
import { EmptyState } from '@/components/employee/EmptyState';
import { Hand, Clock, User, ChevronRight, ArrowRight } from 'lucide-react';

interface AvailableTicketsProps {
  tickets: Ticket[];
  onTakeTicket: (ticketId: string) => void;
  onOpenTicket: (ticket: Ticket) => void;
  onViewAll: () => void;
}

export const AvailableTickets: React.FC<AvailableTicketsProps> = ({
  tickets,
  onTakeTicket,
  onOpenTicket,
  onViewAll,
}) => {
  const [ticketToTake, setTicketToTake] = useState<Ticket | null>(null);

  // Filter tickets that are OPEN and have no assignee
  const availableTickets = tickets.filter(
    (t) => t.status === 'OPEN' || !t.assigneeName || t.assigneeName === 'Belum Ditugaskan'
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
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Hand className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Tiket Tersedia (Available Tickets)</h3>
            <p className="text-xs text-zinc-400">Tiket masuk yang belum diambil teknisi penanggung jawab</p>
          </div>
        </div>

        {availableTickets.length > 0 && (
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>Lihat Semua ({availableTickets.length})</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {availableTickets.length === 0 ? (
        <EmptyState
          title="Tidak ada tiket baru"
          description="Semua tiket yang masuk sudah memiliki penanggung jawab IT Support."
        />
      ) : (
        <div className="divide-y divide-zinc-800/80">
          {availableTickets.slice(0, 5).map((ticket) => (
            <div
              key={ticket.id}
              className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between rounded-xl px-2.5 -mx-2.5 hover:bg-zinc-800/50 transition-all"
            >
              <div
                className="min-w-0 flex-1 cursor-pointer"
                onClick={() => onOpenTicket(ticket)}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {ticket.number}
                  </span>
                  <span className="text-xs text-zinc-400">{ticket.category}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs text-zinc-400">
                    Pemohon: <strong className="text-zinc-200">{ticket.requesterName}</strong> ({ticket.requesterDepartment})
                  </span>
                </div>

                <h4 className="mt-1.5 text-sm font-semibold text-zinc-200 hover:text-blue-300 transition-colors line-clamp-1">
                  {ticket.title}
                </h4>

                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3 text-zinc-500" />
                    {formatDate(ticket.createdAt)}
                  </span>
                  <PriorityBadge priority={ticket.priority} />
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-zinc-800/50">
                <button
                  type="button"
                  onClick={() => setTicketToTake(ticket)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 transition-all"
                >
                  <Hand className="h-3.5 w-3.5" />
                  <span>Ambil Tiket (Take)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Take Ticket Dialog */}
      {ticketToTake && (
        <ConfirmDialog
          isOpen={!!ticketToTake}
          title="Klaim Penanganan Tiket"
          description={
            <div>
              <p>
                Apakah Anda yakin ingin mengambil dan menangani tiket <strong>{ticketToTake.number}</strong> (<em>{ticketToTake.title}</em>)?
              </p>
              <p className="mt-2 text-xs text-zinc-400 bg-blue-950/20 p-2.5 rounded-lg border border-blue-500/20">
                📌 Status tiket akan otomatis berubah menjadi <strong className="text-blue-400">IN_PROGRESS</strong> dan masuk ke daftar &ldquo;Tiket Tanggungan Saya&rdquo;.
              </p>
            </div>
          }
          confirmText="Ya, Ambil Tiket Ini"
          cancelText="Batal"
          variant="info"
          icon={<Hand className="h-6 w-6 text-blue-400" />}
          onConfirm={() => {
            if (ticketToTake) {
              onTakeTicket(ticketToTake.id);
              setTicketToTake(null);
            }
          }}
          onCancel={() => setTicketToTake(null)}
        />
      )}
    </div>
  );
};
